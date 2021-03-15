const express = require('express');
const User = require('../models/User')


const router = express.Router();



router.get("/users", (req, res) => {

    User.find({}, function (err, users) {
        res.send(users);
    });

});


module.exports = router;