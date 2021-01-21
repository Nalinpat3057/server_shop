var express = require('express')
var mysql = require('mysql')
var app = express()


//start connect database

var connect_db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '12345678',
    database : 'shop'
})

connect_db.connect(function(err){
    if (err) console.log(err);
    console.log('Connected  database!')
})

//stop connect database






app.use(express.json())
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
    return next()
})
app.use(express.static('public'))

//login
app.post('/login')


//register

app.post('/register',(req,res)=>{
    console.log('register event')

    var data = {
        username : req.body.username,
        password : req.body.password
    }
    var sql_code = "INSERT INTO shop_info (User_name,Password) VALUES ('"+data.username+"',"+data.password+")"
    connect_db.query(sql_code,function(err,result){
        if (err) console.log(err);
        console.log(result)
    })
    res.send(data)

})

//app.


//feed







app.listen(3000)