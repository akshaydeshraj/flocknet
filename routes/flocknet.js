var express = require('express');
var flock = require('flockos');
var flocknetRouter = express.Router();
var User = require('../models/User');

/* GET home page. */
flocknetRouter.post('/webhook', function (req, res, next) {
    console.log(req.body);

    switch (req.body.name) {
        case 'app.install':
            User.update({
                'userId': req.body.userId
            }, req.body, {
                'upsert': true
            }, console.log);

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

/**
 * Configuration URL
 */
flocknetRouter.get('/configure', function (req, res, next) {
    var user_data = flock.verifyEventToken(req.query.flockValidationToken);
    console.log(user_data);

    User.findOne({
        userId: user_data.userId
    }).exec(function (err, result) {
        var token = result.token;
        flock.callMethod('groups.list', token, {}, console.log);
    });

    res.send('Dummy Data');
});

module.exports = flocknetRouter;