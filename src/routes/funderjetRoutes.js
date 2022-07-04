'use strict';

module.exports = function (app) {
    var commodities = require('../controllers/commoditiesControlloer');
    // var loans = require('../controllers/loansController');
    const auth = require("../middleware/auth");

    //Commodities Routes
    app.route('/funderjet/api/commodity')
        .post(commodities.createCommodity)
        .get( commodities.getAllCommodities);
    
    app.route('/funderjet/api/commodity/transfer')
        .post( commodities.transferCommodity)

    app.route('/funderjet/api/commodity/:commodityId')
        .get( commodities.readCommodity)
        .put( commodities.updateCommodity)
    
    app.route('/funderjet/api/commodity/balance')
        .post( commodities.commodityBalanceOf)
};
