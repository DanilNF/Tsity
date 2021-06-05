const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');
const hbs = require("express-handlebars");
const objectId = require("mongodb").ObjectID;
const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
const urlencodedParser = bodyParser.urlencoded({extended: false});


let dbClient;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "hbs");
app.engine("hbs",hbs(
    {
        layoutsDir: "build", 
        defaultLayout: null,
        extname: "hbs"
    }
)); 

app.use(express.static(__dirname + "/src"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("usersdb").collection("users");
	//app.locals.collection.find({}).toArray(function(err, users){
        //console.log(users);
    //});
    app.listen(9000, function(){
        console.log("Сервер ожидает подключения на 9000...");
    });
});


app.post("/auth", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    const db = mongoClient.db("usersdb");
    const collection = db.collection("users");
    collection.findOne({name: request.body.userName, password: request.body.userPassword}, function(err, results){

        console.log("Результаты: " + results); 
        if(results != null){
            response.render(__dirname+"/src/lk-hbs.hbs", {
                name: request.body.userName,
                password: request.body.userPassword,
				email:	results.email,
				number: results.number
				
            });
        }
        else{
            response.sendFile(__dirname+"/src/lk-hbs.hbs");
        }
    });
});
app.post("/register", urlencodedParser, function (request, response) {
	const userName = request.body.name;
    const userPassword = request.body.password;
	const userEmail = request.body.email;
	const userNumber = request.body.number;
	
	

    const user = {name: userName, password: userPassword, email: userEmail , number:userNumber};
    const collection = request.app.locals.collection;
    collection.insertOne(user, function(err, result){
        if(err) return //console.log(err);
      response.send(user);
		response.render(__dirname+"/src/lk-hbs.hbs",{
			name: user.name,
			email: user.email,
			number: user.number
			
		});
    });
});
app.get("/", function(request, response){
    const db = mongoClient.db("tovarsDB");
	const collection = db.collection("tovars");
	collection.find({}).toArray(function(err, tovars){
          response.render(__dirname+"/src/main.hbs", {
                tovar:tovars
          })
    });	
 });

 app.get("/women", function(request, response){
    const db = mongoClient.db("tovarsDB");
	const collection = db.collection("women");
	collection.find({}).toArray(function(err, tovars){
          response.render(__dirname+"/src/women.hbs", {
                tovar:tovars
          })
    });	
 }); 

 app.get("/men", function(request, response){
    const db = mongoClient.db("tovarsDB");
	const collection = db.collection("men");
	collection.find({}).toArray(function(err, tovars){
          response.render(__dirname+"/src/men.hbs", {
                tovar:tovars
          })
    });	
 });

 app.get("/kid", function(request, response){
    const db = mongoClient.db("tovarsDB");
	const collection = db.collection("kid");
	collection.find({}).toArray(function(err, tovars){
          response.render(__dirname+"/src/kid.hbs", {
                tovar:tovars
          })
    });	
 }); 

 app.get("/index-tovar", function(request, response){
    response.render(__dirname+"/src/index-tovar.hbs", {
    });
 });

app.get("/kid", function(request, response){
    response.render(__dirname+"/src/kid.hbs", {
    });
 });

app.get("/about", function(request, response){
    response.render(__dirname+"/src/about.hbs", {
    });
 });
 
app.get("/index", function(request, response){
    response.render(__dirname+"/src/index.hbs", {
    });
 });

app.use('/assets', express.static('build/assets'));

app.get("/reg", function(request, response){
    response.render(__dirname+"/src/register.hbs", {
        name: "",
        password: ""
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
	const userEmail = req.body.email;
    const user = {name: userName, password: userPassword, email: userEmail};
       
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
    const userEmail = req.body.email;
    const userNumber = req.body.number;
	
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {password: userPassword, name: userName, email: userEmail, number:userNumber}},
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

app.post("/index-tovar", urlencodedParser, function (request, response) {
	const userPhoto = request.body.photo;
	const userText = request.body.text;
	const userPrice = request.body.price;
	console.log( request.body.photo);

	  const user = {photo:userPhoto, text:userText, price:userPrice};
	  const db = mongoClient.db("tovarsDB");
	  const collection = db.collection("tovars");
	  collection.find({}).toArray(function(err, tovars){
		  console.log(tovars);
	});
	  collection.insertOne(user, function(err, result){
		  if(err) return console.log(err);
		  response.render(__dirname+"/src/index-tovar.hbs", {
		  });
	  });
  });

  app.get("/tovars/:tovarId", function(request, response){
    const db = mongoClient.db("tovarsDB");
    const collection = db.collection("tovars");
    collection.findOne({photo: request.params["tovarId"]}, function(err, result){
               if(err) return console.log(err);
               if(result != null)
                       response.render(__dirname+"/src/tov.hbs", {
                        photo: result.photo,
                        text: result.text,
                        price: result.price
                       })
                       else
                       {
                           response.render(__dirname+"/src/tov.hbs", {
                           })
                       }
           });
});
