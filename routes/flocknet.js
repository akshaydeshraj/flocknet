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
    }

    res.sendStatus(200);
});

module.exports = flocknetRouter;