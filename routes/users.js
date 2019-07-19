var express = require('express');
var router = express.Router();

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const db=require('../config/db');
const conn=db.db;
/* GET users listing. */
router.get('/cities', function(req, res, next) {
    console.log(conn);
    conn.query('SELECT * FROM Cities', function(err, results) {
        if (err) throw err
        res.render('cities',{'Cities':results});

    })



});

module.exports = router;
