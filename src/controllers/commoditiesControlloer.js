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
// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', '..', 'fabric-network','test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));
// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
// Path to user certificate.
const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'cert.pem'));
// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
const utf8Decoder = new util.TextDecoder();
let client; 
let gateway;

/**
 * Submit Create Commodity transaction synchronously, blocking until it has been committed to the ledger.
 */
 exports.createCommodity = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: CreateAsset');
        console.log(req.body);

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('CreateCommodity', req.body.description, req.body.value, req.body.owner, req.body.ownerId);
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
 * Returns all the current commodities on the ledger
 */
exports.getAllCommodities = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Get All Commodities');

        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);
        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.evaluateTransaction('GetAllCommodities');
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
 * Transfer Commodity transaction synchronously
 */
 exports.transferCommodity = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Transfer Commodity ---> '+JSON.parse(req));
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('TransferCommodity', req.body.commodityId, req.body.newOwner, req.body.newOwnerId);
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
 * Read Commodity
 */
exports.readCommodity = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Read Commodity'+ req.params.commodityId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.evaluateTransaction('ReadCommodity', req.params.commodityId);
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
 * Update a commodity with new description || value
 */
 exports.updateCommodity = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: UpdateCommodity'+ req.body.commodityId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('UpdateCommodity', req.params.commodityId, req.body.description, req.body.value);
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
 * Get user commodity balance
 */
 exports.commodityBalanceOf = async function (req, res) {
    await initializeGRpcConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Commodity Balance Of '+ req.params.owner);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.evaluateTransaction('CommodityBalanceOf', req.params.owner);
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
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
// async function transferCommodityAsync(contract) {
//     console.log('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');
//     const commit = await contract.submitAsync('TransferAsset', {
//         arguments: [assetId, 'Saptha'],
//     });
//     const oldOwner = utf8Decoder.decode(commit.getResult());
//     console.log(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`);
//     console.log('*** Waiting for transaction commit');
//     const status = await commit.getStatus();
//     if (!status.successful) {
//         throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}`);
//     }
//     console.log('*** Transaction committed successfully');
// }

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