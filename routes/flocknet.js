var express = require('express');
var flocknetRouter = express.Router();
var User = require('../models/User');

/* GET home page. */
flocknetRouter.post('/webhook', function (req, res, next) {
    console.log(req.body);

    switch (req.body.name) {
        case 'app.install':
            var user = new User(req.body);
            user.save(console.log);
            break;
        case 'app.uninstall':
            break;
    }

    res.sendStatus(200);
});

/**
 * Outgoing Webhook
 */
flocknetRouter.post('/outgoing', function (req, res, next) {
    console.log(req.body);
    res.sendStatus(200);
});

module.exports = flocknetRouter;