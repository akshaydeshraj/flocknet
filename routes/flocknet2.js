var express = require('express');
var flock = require('flockos');
var flocknetRouter = express.Router();
var User = require('../models/User');
var Group = require('../models/Group');
var request = require('request');


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
                userId: result[0].associated_user
            }).exec(function (err, r) {
                flock.callMethod('groups.getMembers', r[0].token, {
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
                    for (user in response) {
                        console.log(user);
                        if (response[user].id == req.body.from) {
                            // Loop through all incoming webhooks
                            console.log('****************************88', response[user]);
                            var find_user = user;
                            Group
                                .find()
                                .where('groupId').ne(req.body.to)
                                .exec(function (err, groupArray) {
                                    console.log(err, groupArray)
                                    for (group in groupArray) {
                                        request({
                                            url: groupArray[group].webhook_url,
                                            method: 'POST',
                                            body: JSON.stringify({
                                                text: req.body.text,
                                                attachments: req.body.attachments,
                                                sendAs: {
                                                    name: response[find_user].firstName + " " + response[find_user].lastName,
                                                    profileImage: response[find_user].profileImage
                                                }
                                            }),
                                            header: {
                                                'content-type': 'application/json'
                                            }
                                        }, function (err, response, body) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log(response.statusCode, body);
                                            }
                                        });
                                    }
                                });
                        }
                    }
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
    flock.setAppId(process.env.FLOCK_APP_ID2);
    flock.setAppSecret(process.env.FLOCK_APP_SECRET2);
    var user_data = flock.verifyEventToken(req.query.flockValidationToken);
    console.log(user_data);

    User.findOne({
        userId: user_data.userId
    }).exec(function (err, result) {
        var token = result.token;
        flock.callMethod('groups.list', token, {}, function (err, response) {
            if (err) throw err;
            Group.find().distinct('f_channel', function (err, re) {
                res.render('configure', {
                    data: response,
                    userId: user_data.userId,
                    channels: re
                });
            });

        });
    });

});

/**
 * Outgoing Webhook
 */
flocknetRouter.post('/subscribe-channel', function (req, res, next) {
    console.log("*********************/subscribe-channel body****************: ", req.body);
    Group.update({
        'groupId': req.body.groupId
    }, req.body, {
        'upsert': true
    }, function (err, result) {
        console.log("****************Group collection Operation****************: ", err, result);
        res.sendStatus(200);
    });

});

module.exports = flocknetRouter;