'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser } = require('../utils/CAUtils');
const { buildCCPOrg1, buildWallet } = require('../utils/AppUtils');
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');

exports.enrollUser = async function (req, res) {
    try {
      // Build an in memory object with the network configuration (connection profile)
		const ccp = buildCCPOrg1();

    // Build an instance of the fabric ca services client based on the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    // Setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, req.body.org1UserId, 'org1.department1');
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
};


