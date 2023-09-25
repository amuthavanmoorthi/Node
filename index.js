//const variable = require ("package_name")
const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mysql = require("mysql");

//here we have converted the package to function coz sometimes i will use package and sometimes i will be use function.
var storeEx = express();

//I have connected the cors function and express function.
storeEx.use(cors())

//I have connected the bodyParser also and it has only data (data mean json only that's why we used .json) 
storeEx.use(bodyparser.json())

//I have used express data in express function.
storeEx.use(express.json())

//Encrypting to decrypting here will done.
storeEx.use(bodyparser.urlencoded({extended:true}))

//it will go to the folderName => node_module => public. for index.html
storeEx.use(express.static('public'))

//connecting mysql using createconnection predefined function.
let localdb = mysql.createConnection({
    //Connecting my local disk 
    host:"localhost",
    //mysql default port number.
    port:3306,
    //root is my mysql username
    user:"root",
    //my password for the mysql.
    password:"mysql@123!",
    //Databse name
    database:"kgm"
})

// its like try catch and connect is a predefined function and error also if I use someother thing it won't run.
localdb.connect((error)=>{
    if (error) {
        console.log(error)
    } else {
        console.log("db connected!")
    }
})

//Using express function going to do get operation.
//get is a default method like(get, post, put, delete)
storeEx.get("/getAll",(request,response)=>{
    var selectingQuery = "select * from jpa_details"
    //connect the DB and execute the query for that 
    localdb.query(selectingQuery,(error,result)=>{
        if (error) {
            response.send(error)
            console.log(error)
        } else {
            response.send(result)
        }
    })
})

//Inserting all all the details using registration form.
storeEx.post ("/Rgister", (requst, response) =>{
    let {first_name, last_name, email, phone_number, password, roll, address, landmark, city, state} = requst.body
    let selectingQuery = 'insert into register (first_name,last_name, email, phone_number, password, roll, address, landmark, city, state, username) values (?,?,?,?,?,?,?,?,?,?,?)'

    localdb.query(selectingQuery,[first_name, last_name, email,phone_number, password, roll, address,  landmark, city, state, email], (error, result) =>{
        if (error) {
            response.send({"status":"error"})
            console.log(error)
        } else {
            response.send({"status" : "success"})
        }
    } )
})

//Creating login backend here. Using what i have already have in the same DB
storeEx.post("/Login", (request, response)=>{
    let {username, password} = request.body
    var loginQuery = "select * from register where username=?"
    localdb.query(loginQuery,[username], (error, result)=>{
        if(error){
            response.send({"status":"error"})
        }
        else if(result.length>0){
            var dbusername = result[0].username
            var dbpassword = result[0].password
            var id = result[0].id   
            var roll = result[0].roll
            if(dbusername === username && dbpassword === password){
                response.send({"status":"success","id":id, "roll":roll})
            }
            else{
                response.send({"status":"invalid"})
            }
        }
        else{
            response.send({"status" : "empty_set"})
        }
    })
})

storeEx.get('/getone/:id', (request, response) =>{
    let {id} = request.params
    let getonequery = 'select * from register where id = ?'
    localdb.query(getonequery, [id], (error, result)=>{
        if(error){
            response.send({"status":"error"})
            console.log(error)
        }
        else{
            response.send(result)
            console.log(result)
        }
    })
})

//node don't have an default port number we can use any number in 4 digit, if the express function run it will show the output. Don't use someother dufault port number.
storeEx.listen(3020,()=>{
    console.log("Your port is running in 3020")
})

