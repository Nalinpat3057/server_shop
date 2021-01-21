how use :
    1 import sql from file shop.sql into phpmysql on device
    2run file server.js    ,command : node server.js



method 
    1 register 
        post method ,url = "http://localhost:3000/register"
        data = {
            username : value(type String),
            password : value(type int),
            shop_name : value(type String),
            phone : value (type int),
            email : value(type String),
            address : value(typeString)
        }

        server response :  true=register success , false = register false

    2login
        post method ,url = "http://localhost:3000/login"
        data = {
            username : value(type String),
            password : value(type int),
        }

        server response :  true=login success , false = login false