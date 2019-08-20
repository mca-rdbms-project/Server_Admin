var express = require('express');
var router = express.Router();

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const db=require('../config/db');
const conn=db.db;


router.get('/login',function (req,res,next) {
    res.render("web/login",{layout:false});
})
router.get('/map',function (req,res,next) {
    res.render("web/map",{layout:false});
})
router.get('/offer-trip',function (req,res,next) {
    res.render("web/offer-trip",{layout:"user-layout"});
})

















module.exports = router;

