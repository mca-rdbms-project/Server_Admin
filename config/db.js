var mysql = require('mysql')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
})

db.connect(function(err) {
    if (err) throw err
    console.log('Mysql connected...')
})

db.query('create database if not exists Trip_Pool', function(err, result) {
    if (err) throw err
    //console.log("database created");
})
db.query('use Trip_Pool',function (err,result) {
    if (err) throw err
});
var query='create table if not exists Cities(city_id int primary key,city_name varchar(255))';
db.query(query,function (err,result) {
    if (err) throw err
    //console.log(result)

})

query='create table if not exists Colleges(college_id int primary key,college_name varchar(255),college_address varchar(255),town varchar(255))'
db.query(query,function (err,result) {
    if (err) throw err
    //console.log(result)

})

query='create table if not exists Users(user_id int primary key,' +
    'first_name varchar(255),' +
    'last_name varchar(255),' +
    'email varchar(255),' +
    'mobile varchar(255),' +
    'city varchar(255),' +
    'college varchar(255),' +
    'user_type varchar(255),' +
    'gender varchar(255),' +
    'password varchar(255)) ';
db.query(query,function (err,result) {
    if (err) throw err
    //console.log(result)

})