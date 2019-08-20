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
    if(!req.session.user)
    res.redirect('/panel/login')
    else {
        res.redirect('/panel/find-trip')

    }
})
router.get('/login',function (req,res,next) {
    res.render("web/login",{layout:false});
})

router.get('/find-trip',function (req,res,next) {
    res.render("web/find-trip",{layout:'l2','user':req.session.user});
})

router.get('/signup',function (req,res,next) {
    res.render("web/signup",{layout:false});
})

router.get('/map',function (req,res,next) {
    res.render("web/map",{layout:false});
})
router.get('/offer-trip',function (req,res,next) {
    res.render("web/offer-trip",{layout:'l2','user':req.session.user});
})
router.post('/google-login',function (req,res,next) {
    var data=JSON.parse(req.body.User)

    var query="select * from Users where email='"+data.U3+"'";
    conn.query(query,function (err,result) {

        if(result.length>0){
            req.session.user=result[0]
            console.log(req.session.user)
            res.json({"status":true});
        }
        else {
            var insert="insert into Users (id,first_name,last_name,email,photo) values(null,'"+data.ofa+"','"+data.wea+"','"+data.U3+"','"+data.Paa+"')";
            conn.query(insert, function(err, results) {
                if (err) throw err
                console.log(results)
                req.session.user=results[0]
                console.log(req.session.user)
                res.json({"status":true});
            })

        }
    })

})

















module.exports = router;

