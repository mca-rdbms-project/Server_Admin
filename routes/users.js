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
module.exports = router;
