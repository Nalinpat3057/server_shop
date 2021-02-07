var express = require('express')
var mysql = require('mysql')
var app = express()
var fs = require('fs');

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
app.post('/login_shop',(req,res)=>{
    console.log("login event")

    var data = {
        email: req.body.email,
        password: req.body.password 
    }

    var sql_code = "SELECT Shop_ID , Email ,Password FROM shop_info WHERE Email = '"+data.email+"'AND Password='"+data.password+"';"
  
    connect_db.query(sql_code,function(err,result){
        if(err) console.log(err);        
        console.log(result)
        if (JSON.stringify(result) == "[]"){            
            var response = {
                ID : null,
                status : false
            }
            res.send(response)
        }else{
            var response = {
                ID : result[0]['Shop_ID'],
                status : true
            }
            res.send(response)
        }
    })

})


//register       (username , password,ชื่อร้าน,เบอร์โทร , email , ที่อยู่)

app.post('/register_shop',async (req,res)=>{
    console.log('register event')

    var data = {
        password : req.body.password,
        shop_name : req.body.shop_name,
        phone : req.body.phone,
        email : req.body.email,
        image : await req.body.image,
        address : req.body.address
    }
    // fs.writeFile('/image/')
    var imagedir = fs.readdirSync("./image").length
    fs.writeFileSync("./image/"+imagedir+".jpg",data.image,'base64',function(err){
        if (err) console.log(err)
    })
    var sql_code = "INSERT INTO shop_info (Password,Shop_name,Phone,Email,Address,Url) VALUES ("+data.password+",'"+data.shop_name+"',"+data.phone+",'"+data.email+"','"+data.address+"','image/"+imagedir+".jpg')"
    connect_db.query(sql_code,function(err,result){
        if (err){
            console.log(err);
            var response = {
                status:false
            }
            res.send(response)
        }else{
            //console.log(result)  //show data from client 
            var response = {
                status:true
            }
            res.send(response)
        }
        
    })

})


app.get('/get_profile_shop',(req,res)=>{
    var data = {
        shop_id : req.body.shop_id
    }

    var sql_code = "SELECT Shop_name,Phone, Url , Email,Address FROM shop_info WHERE Shop_ID = "+data.shop_id
    connect_db.query(sql_code,function(err,result){

        ///read file and convert image to base64 ;return base64 type string
        var imagetobase64 =  fs.readFileSync(result[0]['Url'],{encoding : 'base64'})

        //del path url from database  and set image into object
        delete result[0]['Url']
        result[0]["image"] = imagetobase64

        if (err){
            console.log(err);
            var response = {
                data: null,
                status:400
            }
            res.send(response)
        }else{
            var response = {
                data :result,
                status:200
            }
            res.send(response)
        }
    })
})


app.post('/add_product',(req,res)=>{
    var data = {
        shop_id:req.body.shop_id,
        product_name : req.body.product_name,
        image : req.body.image,
        description : req.body.description
    }

    // fs.writeFile('/image/')
    var imagedir = fs.readdirSync("./image").length
    fs.writeFileSync("./image/"+imagedir+".jpg",data.image,'base64',function(err){
        if (err) console.log(err)
    })


    var sql_code = "INSERT INTO products (shop_ID,Product_name,Url,Description) VALUES ("+data.shop_id+",'"+data.product_name+"','image/"+imagedir+".jpg','"+data.description+"')"
    connect_db.query(sql_code,function(err,result){
        if (err){
            console.log(err);
            var response = {
                status:false
            }
            res.send(response)
        }else{
            var response = {
                status:true
            }
            res.send(response)
        }
    })
})

app.get('/get_allproduct',(req,res)=>{
    var data = {
        shop_id : req.body.shop_id
    }
    var sql_code = "SELECT Product_ID, Product_name , Url ,	Description FROM products WHERE Shop_ID = "+data.shop_id  

    connect_db.query(sql_code,function(err,result){
        if (err){
            console.log(err);
            var response = {
                data: null,
                status:false
            }
            res.send(response)
        }else{

            
            for(var i = 0; i < result.length;i++){
                var imagetobase64 = fs.readFileSync(result[i]['Url'],{encoding : 'base64'})
                delete result[i]['Url']
                result[i]["image"] = imagetobase64
            }
                       

            var response = {
                data :result,
                status:true
            }
            res.send(response)
        }
    })
})

app.get('/get_product',(req,res)=>{
    var data = {
        product_id : req.body.product_id
    }
    var sql_code = "SELECT Shop_ID, Product_name , Url ,Description FROM products WHERE Product_ID = "+data.product_id 

    connect_db.query(sql_code,function(err,result){
        if (err){
            console.log(err);
            var response = {
                data: null,
                status:false
            }
            res.send(response)
        }else{
            for(var i = 0; i < result.length;i++){
                var imagetobase64 = fs.readFileSync(result[i]['Url'],{encoding : 'base64'})
                delete result[i]['Url']
                result[i]["image"] = imagetobase64
            }   
            var response = {
                data :result,
                status:true
            }
            res.send(response)
        }
    })
})
//feed

app.get('/image',async (req,res)=>{
    var data = {
        shop_id : await req.body.shop_id
    }

    var sql_code = "SELECT Url from shop_info WHERE Shop_ID = "+data.shop_id

    connect_db.query(sql_code,function(err,result){
        if(err) console.log(err)
        console.log(result[0]['Url'])
        var imagetobase64 =  fs.readFileSync(result[0]['Url'],{encoding : 'base64'})
        res.send({
            image : imagetobase64
        })
    })
})

app.post('/register_customer',async (req,res)=>{
    console.log('register event')

    var data = {
        password : req.body.password,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        phone : req.body.phone,
        email : req.body.email,
        image : await req.body.image,
        address : req.body.address
    }
    // fs.writeFile('/image/')
    var imagedir = fs.readdirSync("./image").length
    fs.writeFileSync("./image/"+imagedir+".jpg",data.image,'base64',function(err){
        if (err) console.log(err)
    })
    var sql_code = "INSERT INTO customer (Password,First_name,Last_name,Phone,Email,Address,Url) VALUES ("+data.password+",'"+data.first_name+"','"+data.last_name+"',"+data.phone+",'"+data.email+"','"+data.address+"','image/"+imagedir+".jpg')"
    connect_db.query(sql_code,function(err,result){
        if (err){
            console.log(err);
            var response = {
                status:false
            }
            res.send(response)
        }else{
            //console.log(result)  //show data from client 
            var response = {
                status:true
            }
            res.send(response)
        }
        
    })

})


app.post('/login_customer',(req,res)=>{
    console.log("login event")

    var data = {
        email: req.body.email,
        password: req.body.password 
    }

    var sql_code = "SELECT Customer_ID , Email ,Password FROM customer WHERE Email = '"+data.email+"'AND Password='"+data.password+"';"
  
    connect_db.query(sql_code,function(err,result){
        if(err) console.log(err);        
        console.log(result)
        if (JSON.stringify(result) == "[]"){            
            var response = {
                ID : null,
                status : false
            }
            res.send(response)
        }else{
            var response = {
                ID : result[0]['Customer_ID'],
                status : true
            }
            res.send(response)
        }
    })

})



const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port${port}...   http://localhost:${port}`) );