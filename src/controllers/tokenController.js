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
 * Get token amount balance of user
 */
 exports.balanceOf = async function (req, res) {
     await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Token Balance Of '+ req.params.owner);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FTJERC20');
        const resultBytes = await contract.evaluateTransaction('BalanceOf', req.params.owner);
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
 * Get account statement
 */
 exports.accountStatement = async function (req, res) {
     await initConnection();
    try {
        console.log('\n' + moment(Date().toISOString).format('YYYY-MM-DD HH:mm:ss') + ' Evaluate Transaction: Account History  '+ req.params.owner);
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName, 'FTJERC20');
        const resultBytes = await contract.evaluateTransaction('GetAccountStatement', req.params.owner);
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