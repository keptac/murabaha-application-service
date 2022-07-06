'use strict';

const grpc = require("@grpc/grpc-js");
const fabric_gateway = require("@hyperledger/fabric-gateway");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const util = require("util");
const moment = require("moment");

const channelName = envOrDefault('CHANNEL_NAME', 'funderjet');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', '..', 'fabric-network','test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'cert.pem'));
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
const utf8Decoder = new util.TextDecoder();
let client; 
let gateway;

/**
 * Request for a loan
 */
 exports.requestShariaLoan = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Request Loan');
        console.log(req.body);

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.submitTransaction('RequestShariaLoan', req.body.requestorId, req.body.requestorName, req.body.commodityId);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json(result)
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
    finally {
        gateway.close();
        client.close();
    }
};

/**
 * Returns all the current loans on the ledger
 */
exports.getAllLoans = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Get All Loans');

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.evaluateTransaction('GetAllLoans');
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json(result)
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
    finally {
        gateway.close();
        client.close();
    }
};

/**
 * Authorise a loan requested
 */
 exports.authoriseLoanRequest = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Authorise Loan ---> ');
        console.log(req.body);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.submitTransaction('AuthoriseLoanRequest', req.body.loanId, req.body.decision, req.body.installmentPeriod, req.body.profitMargin);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json(result)
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
    finally {
        gateway.close();
        client.close();
    }
};

/**
 * Read Loan
 */
exports.readLoan = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Read Commodity'+ req.params.commodityId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.evaluateTransaction('ReadLoan', req.params.loanId);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json(result)
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
    finally {
        gateway.close();
        client.close();
    }
};

/**
 * Gets loans to be customer loans
 */
exports.getCustomerLoans = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Loan Balance for '+ req.params.customerId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.evaluateTransaction('GetLoansPerCustomer', req.params.customerId);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json(result)
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
    finally {
        gateway.close();
        client.close();
    }
};

/**
 * Gets loans to be authorised by user
 */
exports.getAuthoriserLoans = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: CommodityBalanceOf'+ req.params.authoriserId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.evaluateTransaction('GetAuthoriserLoans', req.params.authoriserid);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json(result)
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
    finally {
        gateway.close();
        client.close();
    }
};

//Initialization of Network connections
async function initializeGRpcConnection() {
    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    client = await newGrpcConnection();
    gateway = (0, fabric_gateway.connect)({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });
}

async function newGrpcConnection() {
    const tlsRootCert = await fs.promises.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity() {
    const credentials = await fs.promises.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner() {
    const files = await fs.promises.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.promises.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return fabric_gateway.signers.newPrivateKeySigner(privateKey);
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}