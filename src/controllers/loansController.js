'use strict';

const util = require("util");
const moment = require("moment");
const channelName =  'funderjet';
const chaincodeName =  'basic';
const utf8Decoder = new util.TextDecoder();
const { initializeGRpcConnection } = require('../utils/AppUtils.js');

let client; 
let gateway;

/**
 * Request for a loan
 */
 exports.requestShariaLoan = async function (req, res) {
    await initConnection();
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
     await initConnection();
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
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Authorise Loan ---> ');
        console.log(req.body);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');

        const resultBytes = await contract.submitTransaction('AuthoriseLoanRequest', req.body.loanId, req.body.decision, req.body.installmentPeriod, req.body.profitMargin);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);

        if(result===true && req.body.decision==='APPROVED'){
            const resultBytes = await contract.submitTransaction('_trfc_trxn_completion', req.body.loanId);
            const resultJson = utf8Decoder.decode(resultBytes);
            result = JSON.parse(resultJson);
        }

        return res.json(result)
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
     await initConnection();
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
     await initConnection();
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
     await initConnection();
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

/**
 * Read Loan history
 */
 exports.loanHistory = async function (req, res) {
     await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Loan History '+ req.params.loanId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'LoanRequest');
        const resultBytes = await contract.evaluateTransaction('GetLoanHistory', req.params.loanId);
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

async function initConnection() {
    const connection = await initializeGRpcConnection();
    client = connection.client;
    gateway = connection.gateway;
}
