var express = require('express');
var flock = require('flockos');
var flocknetRouter = express.Router();
var User = require('../models/User');
var Group = require('../models/Group');

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
 * { type: 'GROUPCHAT',
  id: '000030b8-0000-002e-0000-0000000e57f0',
  to: 'g:7947368345418820210',
  from: 'u:dmx9dmux1m9m0mw9',
  actor: '',
  text: 'hi',
  uid: '1477137822201-RWEUNX-apollo-z6' }
 */
flocknetRouter.post('/outgoing', function (req, res, next) {
    console.log(req.body);
    if (req.body.type !== 'GROUPCHAT') res.send();
    Group.find({
        groupId: req.body.to
    }).exec(
        function (err, result) {
            User.find({
                userId: result.associated_user
            }).exec(function (err, r) {
                flock.callMethod('groups.getMembers', r.token, {
                    groupId: req.body.to
                }, function (err, response) {
                    /**
                     * [{
                            "id": "u:cfc76545-3400-4864-892a-513a9f4ae409",
                            "firstName": "Nicole",
                            "lastName": "Sullivan"
                        },{
                            "id": "u:d08c8f64-1a64-4cd9-a563-df5079794aa7",
                            "firstName": "Bob",
                            "lastName": "Hartnett",
                        },{
                        ...
                        }]
                     */
                    console.log(response);
                });
            });

        });

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
        flock.callMethod('groups.list', token, {}, function (err, response) {
            if (err) throw err;
            response.userId = user_data.userId;
            res.render('configure', {
                data: response
            });
        });
    });

});

/**
 * Outgoing Webhook
 */
flocknetRouter.post('/subscribe-channel', function (req, res, next) {
    Group.update({
        'groupId': req.body.userId
    }, req.body, {
        'upsert': true
    }, function (err, result) {
        res.sendStatus(200);
    });



});

module.exports = flocknetRouter;