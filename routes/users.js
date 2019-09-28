var express = require('express');
var router = express.Router();

var msg91 = require("msg91")("150002AZFP9V8Yh58fcf044", "TRIP POOL", "4" );


const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const db=require('../config/db');
const conn=db.db;

/* GET users listing. */
router.get("/",function (req,res) {
    res.redirect("/admin/login");
})
router.get('/login',function (req,res) {
    if(req.session.loggedIn==true){
        res.redirect("/admin/cities");
    }
    res.render("login",{layout:false})

})
router.post('/do-login',function (req,res) {

    var data=req.body;
    console.log(data)
    var query="select * from Admin where username='"+data.username+"' && password='"+data.password+"'";
    conn.query(query,function (err,result) {
        if(!err){
            console.log(result);
            if(result.length>0){
                req.session.loggedIn=true;
                res.redirect("/admin/cities");
            }
            else {
                res.render("login",{layout:false,"msg":"Username or Password wrong"})
            }
        }
        else{
            res.render("login",{layout:false,"msg":"Username or Password wrong"});
        }
    })
})
router.get('/cities', function(req, res, next) {

    conn.query('SELECT * FROM Cities', function(err, results) {
        if (err) throw err
        console.log(results)
        res.render('cities',{'Cities':results});

    })



});
router.get('/add-city',function (req,res,next) {
    res.render("add-city");
})
router.post('/doAddCity',function (req,res,next) {
    if(req.body){
        query="INSERT INTO `Trip_Pool`.`Cities` (`city_name`) VALUES ('"+req.body.CityName+"')";
        conn.query(query,function (err, result) {
            if (err) throw err
            //console.log(result)
            console.log(result)
            res.redirect("/admin/cities");

        })
    }
})
router.get('/colleges',function (req,res,next) {
    query="SELECT Colleges.college_id,Colleges.college_name,Colleges.college_address,Cities.city_name FROM Colleges,Cities WHERE Colleges.town=Cities.city_id;";
    conn.query(query, function(err, results) {
        if (err) throw err
        console.log(results)
        res.render('colleges',{'Colleges':results});

    })
})
router.get('/add-college',function (req,res,next) {
    conn.query('SELECT * FROM Cities', function(err, results) {
        if (err) throw err
        console.log(results)
        res.render('add-college',{'Cities':results});

    })

})
router.post('/doAddCollege',function (req,res,next) {
    if(req.body){
        var name=req.body.Name;
        var adds=req.body.Address;
        var city=req.body.City;
        query="INSERT INTO `Trip_Pool`.`Colleges` (`college_name`, `college_address`, `town`) VALUES ('"+name+"', '"+adds+"', '"+city+"');"
        conn.query(query,function (err, result) {
            if (err) throw err
            //console.log(result)
            console.log(result)
            res.redirect("/admin/colleges");

        })
    }
})
router.get("/users",function (req,res,next) {
    var query="select u.user_id,u.first_name,u.last_name,u.email,u.mobile,u.user_type,u.gender,c.college_name,c.college_address,t.city_name " +
        "from Users u,Colleges c,Cities t where u.city=t.city_id && u.college=c.college_id";
    conn.query(query,function (err,result) {
        console.log(result);
        res.render("users",{"Users":result})
    })
})
router.get("/view-trips",function (req,res) {
    var query="select * from Trips";
    conn.query(query,function (err,trips) {
        trips=Object.values(JSON.parse(JSON.stringify(trips)))
        console.log(trips)
        res.render("view-trips",{"Trips":trips})
    })
})
router.get("/delete-college/:id",function (req,res) {
    var id=req.params.id;
    console.log(id)
    var query="delete from Colleges where college_id='"+id+"'";
    conn.query(query,function (err,done) {
        if (err) throw err
        console.log(done)
        res.redirect("/admin/colleges");
    })
})
router.get("/delete-city/:id",function (req,res) {
    var id=req.params.id;
    console.log(id)
    var query="delete from Cities where city_id='"+id+"'";
    conn.query(query,function (err,done) {
        if (err) throw err
        console.log(done)
        res.redirect("/admin/cities");
    })
})
router.get("/delete-user/:id",function (req,res) {
    var id=req.params.id;
    console.log(id)
    var query="delete from Users where user_id='"+id+"'";
    conn.query(query,function (err,done) {
        if (err) throw err
        console.log(done)
        res.redirect("/admin/users");
    })
})
router.get("/delete-trip/:id",function (req,res) {
    var id=req.params.id;
    console.log(id)
    var query="delete from Users where trip_id='"+id+"'";
    conn.query(query,function (err,done) {
        if (err) throw err
        console.log(done)
        res.redirect("/admin/trips");
    })
})
router.get("/delete-request/:id",function (req,res) {
    var id=req.params.id;
    console.log(id)
    var query="delete from Users where req_id='"+id+"'";
    conn.query(query,function (err,done) {
        if (err) throw err
        console.log(done)
        res.redirect("/admin/requests");
    })
})
module.exports = router;
