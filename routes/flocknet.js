var express = require('express');
var flocknetRouter = express.Router();

/* GET home page. */
flocknetRouter.post('/webhook', function (req, res, next) {
    console.log(req.body);
    res.sendStatus(200);
});

module.exports = flocknetRouter;