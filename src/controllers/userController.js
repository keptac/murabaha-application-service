'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin, fetchIdentity } = require('../utils/CAUtils');
const { buildCCPOrg1, buildWallet } = require('../utils/AppUtils');
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname,'..', 'data','wallet');

var db = require('../middleware/db');

exports.registerUser = async function (req, res) {
    try {
      // Build an in memory object with the network configuration (connection profile)
		const ccp = buildCCPOrg1();

    // Build an instance of the fabric ca services client based on the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    // Setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		const response = await registerAndEnrollUser(caClient, wallet, mspOrg1, req.body.userId, 'org1.department1', req.body);
    if(response.success){
      await db.put(req.body.userId, JSON.stringify(response)); 
    }

    res.json(response);
    }
    catch(error){
        console.log(error)
        res.send(error);
    }
};

exports.fetchUser = async function (req, res) {
  try {
    const wallet = await buildWallet(Wallets, walletPath);
    const response = await fetchIdentity(wallet, req.params.userId);

    if(response.userExists){
      db.get(req.params.userId, function(err, value) {    
        if (err) {  
          return handleError(err);  
        }  
        console.log(JSON.parse(value))

        res.json({
          userExists: response.userExists,
          message: response.message,
          user: JSON.parse(value)
        });
    
      });
     
    }else{
      res.json(response)
    }
  }
  catch(error){
      console.log(error)
      res.send(error);
  }
};




