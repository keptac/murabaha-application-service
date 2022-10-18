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
 * Submit Create Commodity transaction synchronously, blocking until it has been committed to the ledger.
 */
exports.createCommodity = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: CreateAsset');
        console.log(req.body);

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('CreateCommodity', req.body.description, req.body.quantity, req.body.unitPrice, req.body.owner, req.body.ownerId, req.body.commodityName);
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
 * Returns all the current commodities on the market
 */
exports.getAllMarketCommodities = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Get All Market Commodities');

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
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Transfer Commodity ---> ');
        console.log(req.body);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('TransferCommodity', req.body.commodityId, req.body.newOwner, req.body.newOwnerId, req.body.status);
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

exports.transferPartOfCommodity = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Transfer part of Commodity ---> ');
        console.log(req.body);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('TransferPartOfCommodity', req.body.commodityId, req.body.newOwner, req.body.newOwnerId, req.body.status , req.body.quantityRequested);
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


exports.burnCommodity = async function (req, res) {
    await initConnection();
    try {
        
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Burn Commodity ---> ');
        console.log(req.body);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('BurnCommodity', req.body.commodityId);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.json({
            success:true,
            body:result
        })
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
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Read Commodity '+ req.params.commodityId);
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
    await initConnection();
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
    await initConnection();
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
 * Read Commodity History
 */
 exports.commodityHistory = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Commodity Hostory '+ req.params.commodityId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName,'CommodityTransfer');
        const resultBytes = await contract.evaluateTransaction('GetCommodityHistory', req.params.commodityId);
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


//SALES
exports.getAllSales = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Get All Sales');

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'CommodityTransfer');
        const resultBytes = await contract.evaluateTransaction('GetAllSales');
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

exports.proposeSale = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Propose Sale');
        console.log(req.body);

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('ProposeSale', req.body.commodityId, req.body.buyer, req.body.buyerId);
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

exports.authoriseSale = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Submit Transaction: Authorise Sale');
        console.log(req.body);

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.submitTransaction('AuthoriseSale', req.body.saleId, req.body.decision);
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

exports.getSalesBySeller = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Get All Sales per Seller');

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.evaluateTransaction('GetSalesBySeller', req.params.userAccountId);
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

exports.getSalesByBuyer = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Get All Sales per Buyer Account');

        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        const resultBytes = await contract.evaluateTransaction('GetSalesByBuyer', req.params.userAccountId);
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

exports.saleHistory = async function (req, res) {
    await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Sale History '+ req.params.saleId);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName,'CommodityTransfer');
        const resultBytes = await contract.evaluateTransaction('GetSaleHistory', req.params.saleId);
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


async function initConnection() {
    const connection = await initializeGRpcConnection();
    client = connection.client;
    gateway = connection.gateway;
}





