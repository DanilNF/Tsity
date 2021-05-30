
const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');
const handlebars    = require('express-handlebars');
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
let dbClient;
 
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/src"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("usersdb").collection("users");
    app.listen(9000, function(){
        console.log("Сервер ожидает подключения на 9000...");
    });
});

app.get("/auth", urlencodedParser, function (request, response) {
    response.sendFile(__dirname+"/src/auth.html");
});

app.post("/auth", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    // console.log("Поступила информация");
    // console.log(request.body);
    // response.send(`${request.body.userName} - ${request.body.userAge}`);
    const db = mongoClient.db("usersdb");
    const collection = db.collection("users");
    collection.findOne({name: request.body.userName, password: request.body.userPassword}, function(err, results){
        // console.log("Ура!");
        // console.log(request.body.userName); 
        console.log("Результаты: " + results); 
        if(results != null){
            response.render(__dirname+"/src/cabinet.hbs", {
                name: request.body.userName,
                password: request.body.userPassword
            });
        }
        else{
            response.sendFile(__dirname+"/src/auth.html");
        }
    });
});
 
app.get("/api/users", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        res.send(users)
    });
     
});
app.get("/api/users/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, user){
               
        if(err) return console.log(err);
        res.send(user);
    });
});
   
app.post("/api/users", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const userName = req.body.name;
    const userPassword = req.body.password;
    const user = {name: userName, password: userPassword};
       
    const collection = req.app.locals.collection;
    collection.insertOne(user, function(err, result){
               
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.delete("/api/users/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let user = result.value;
        res.send(user);
    });
});
   
app.put("/api/users", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const userName = req.body.name;
    const userPassword = req.body.password;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {password: userPassword, name: userName}},
         {returnOriginal: false },function(err, result){
               
        if(err) return console.log(err);     
        const user = result.value;
        res.send(user);
    });
});
 
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
}); 
