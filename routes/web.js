var express = require('express');
var router = express.Router();

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const db=require('../config/db');
const conn=db.db;


router.get('/',function (req,res,next) {
    res.render("web/home",{layout:false});
})
















module.exports = router;

