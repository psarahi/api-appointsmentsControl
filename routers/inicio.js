const dayjs = require('dayjs');
const express = require('express');
const router = express.Router();

router.get('', function(req, res) {
    try {
        res.send(`Bienvenido Api  ${dayjs().format()}`);
    } catch (error) {
        console.log(error);
        res.send(`Error ${dayjs().format()}`);
    }
});

module.exports = router;