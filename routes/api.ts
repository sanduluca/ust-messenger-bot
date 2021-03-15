import express from "express"
import User from "../models/User"


const router = express.Router();



router.get("/users", (req, res) => {

    User.find({}, function (_, users) {
        res.send(users);
    });

});


export default router;