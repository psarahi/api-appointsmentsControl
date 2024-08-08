const express = require('express');
const router = express.Router();
const moment = require('moment');

router.get('', function(req, res) {
    try {
        res.send(`Bienvenido Api  ${moment().format()}`);
    } catch (error) {
        console.log(error);
        res.send(`Error ${moment().format()}`);
    }
});

module.exports = router;