'use strict';

module.exports = function (app) {
    var commodities = require('../controllers/commoditiesControlloer');
    // var loans = require('../controllers/loansController');
    const auth = require("../middleware/auth");

    //Announcement Routes
    app.route('/funderjet/api/commodities')
        .get( commodities.getAllCommodities)
        // .post(commodities.create_a_commodity);

    // app.route('/funderjet/api/commodities/:commodityId')
    //     .get( commodities.read_a_commodity)
    //     .put( commodities.update_a_commodity)
    //     .delete( commodities.delete_a_commodity);
    
    // Loans Routes
    // app.route('/funderjet/api/loans')
    //     .get( loans.listLoans)
    //     .post( loans.addLoan);

    // app.route('/funderjet/api/loans/:loanId')
    //     .delete( loans.deleteLoan)
};
