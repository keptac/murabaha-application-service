'use strict';

module.exports = function (app) {
    var commodities = require('../controllers/commoditiesControlloer');
    var loans = require('../controllers/loansController');
    var token = require('../controllers/tokenController');
    // const auth = require("../middleware/auth");

    //Commodities Routes
    app.route('/funderjet/api/commodity')
        .post(commodities.createCommodity)
        .get(commodities.getAllCommodities);
    
    app.route('/funderjet/api/commodity/transfer')
        .post(commodities.transferCommodity)

    app.route('/funderjet/api/commodity/:commodityId')
        .get(commodities.readCommodity)
        .put(commodities.updateCommodity)

    app.route('/funderjet/api/commodity/history/:commodityId')
        .get(commodities.commodityHistory)
    
    app.route('/funderjet/api/commodity/balance/:owner')
        .get(commodities.commodityBalanceOf)

    //Loan Request Routes
    app.route('/funderjet/api/loan')
        .post(loans.requestShariaLoan)
        .get(loans.getAllLoans);
    
    app.route('/funderjet/api/loan/authoriser/:authoriserid')
        .get(loans.getAuthoriserLoans)
    
    app.route('/funderjet/api/loan/customer/:customerId')
        .get(loans.getCustomerLoans)

    app.route('/funderjet/api/loan/authorise')
        .post(loans.authoriseLoanRequest)

    app.route('/funderjet/api/loan/:loanId')
        .get(loans.readLoan)

    app.route('/funderjet/api/loan/history/:loanId')
        .get(loans.loanHistory)

    //Token endpoints
    app.route('/funderjet/api/token/balance/:owner')
        .get(token.balanceOf)

};
