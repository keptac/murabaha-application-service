/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return {
				success:false,
				message: 'An identity for the admin user already exists in the wallet'
			};
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation, userProfile) => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);

			return {
				success:false,
				message: `An identity for the user ${userId} already exists in the wallet`
			};
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet... \n\n Creating admin wallet');
			
			this.enrollAdmin(caClient, wallet, orgMspId);
			// return {
			// 	success:false,
			// 	message: 'An error occured please contact system admin'
			// };
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			affiliation: affiliation,
			enrollmentID: userId,
			role: 'client'
		}, adminUser);

		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});

		const randomHex = () => `fx${Math.floor(Math.random() * 0xfffffffffffff).toString(16)}`;
		var accountAddress;
		if(userProfile.role=="ADMIN"){
			 accountAddress = 'fx46049c3413f15'
		}else{
			 accountAddress = randomHex();
		}
		
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			// accountAddress: accountAddress,
			// firstName:userProfile.firstname,
			// lastName:userProfile.lastname,
			// role: userProfile.role,
			mspId: orgMspId,
			type: 'X.509'
		};

		await wallet.put(userId, x509Identity);
		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);

		const identityResponse = {
			success: true,
			userId:userId,
			accountAddress: accountAddress,
			firstName:userProfile.firstName,
			lastName:userProfile.lastName,
			role: userProfile.role
		};

		return identityResponse
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};

exports.fetchIdentity = async (wallet, userId) => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			return {
				success:true,
				userExists: true,
				message: `User identity found.`
			};
		}else{
			return {
				success:true,
				userExists:false,
				message: `An identity for the user ${userId} does not exist`
			};
		}

	} catch (error) {
		console.error(`Failed to find user : ${error}`);
	}
};
