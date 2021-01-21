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

//login   use post method   by into username and password
app.post('/login',(req,res)=>{
    console.log("login event")

    var data = {
        username: req.body.username,
        password: req.body.password 
    }

    var sql_code = "SELECT User_name ,Password FROM shop_info WHERE User_name = '"+data.username+"'AND Password='"+data.password+"';"

    connect_db.query(sql_code,function(err,result){
        if(err) console.log(err);        
        console.log()
        if (JSON.stringify(result) == "[]"){
            res.send('true')
        }else{
            res.send('false')
        }
    })

})


//register       (username , password,ชื่อร้าน,เบอร์โทร , email , ที่อยู่)

app.post('/register',(req,res)=>{
    console.log('register event')

    var data = {
        username : req.body.username,
        password : req.body.password,
        shop_name : req.body.shop_name,
        phone : req.body.phone,
        email : req.body.email,
        address : req.body.address
    }
    var sql_code = "INSERT INTO shop_info (User_name,Password,Shop_name,Phone,Email,Address) VALUES ('"+data.username+"',"+data.password+",'"+data.shop_name+"',"+data.phone+",'"+data.email+"','"+data.address+"')"
    connect_db.query(sql_code,function(err,result){
        if (err){
            console.log(err);
            res.send('false')
        }else{
            //console.log(result)  //show data from client 
            res.send('true')
        }
        
    })

})

//app.


//feed







const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port${port}...   http://localhost:${port}`) );