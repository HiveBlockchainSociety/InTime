var express = require('express');
var app = express();
var port = process.env.PORT || 8045;
const portis = require('portis');
const web3 = require('web3');
const qs = require('querystring');
var mysql = require('mysql');
var ejs = require('ejs');
var mongo = require('mongodb');
var url = 'mongodb://https://intimetokentest.herokuapp.com/'


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.set('view engine', 'ejs' );
app.use(express.static('src'));
/*********************************
	
        REGISTER PAGE

***********************************/

app.get('/', function(req,res){

  res.sendFile(__dirname + '/inTimeInscription.html');
});

app.post('/',function(req,res){

	if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            var email = [[post['email']]];
            var password = [[post['password']]];

             var sqlCheck = "SELECT * FROM user WHERE email = ? AND password= ?";
             con.query(sqlCheck,[email, password], function (err, result) {
              if (err) throw err;
              console.log(result);

              if(result.length != 0){

                console.log("you are already a member");

              }
              else{

                var sql = "INSERT INTO user (nom, prenom, email, password, address) VALUES ?";

                var values = [[post['nom'], post['prenom'], post['email'],post['password'], post['ethAddress']]];

                con.query(sql, [values],function (err, res) {
                  if (err) throw err;
                  console.log("Result: " + res);
                });


                res.redirect('/home');
              }
            
            });	
        });
    }

});
/******************************************

	           MEETING PAGE

******************************************/	
app.get(('/meeting'),function(req,res){
	  res.sendFile(__dirname + '/inTime.html');





    

});
app.post('/meeting',function(req,res){

	if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);

    		var sql = "INSERT INTO meeting (name, time, stake) VALUES ?";

    		var values = [[post['name'], post['meetTime'], post['stake']]];


			con.query(sql, [values],function (err, result) {
				if (err) throw err;
				console.log("Result: " + result);
			});

        });
    }

    	  res.redirect('/home');

});
/*****************************************

	           ADMIN PAGE

******************************************/	
app.get('/admin', function(req,res){

	//var renderedHtml = ejs.render(content, {rows:rows});

	var sql = "SELECT * FROM user";

			con.query(sql,function (err, result, fields) {
				if (err) throw err;
				console.log("Result: " + result);
				res.render('inTimeBack', {result});
			});

  //res.sendFile(__dirname + '/inTimeBack.html');
});

app.post('/admin',function(req,res){

	if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);

    		var sql = "SELECT * FROM user";

			con.query(sql,function (err, result, fields) {
				if (err) throw err;
				console.log("Result: " + result);
			});

        });
    }
     res.sendFile(__dirname + '/inTimeBack.html');

});

/******************************************

	           	PAGE HOME/PROFIL

*********************************************/
app.get('/home', function(req,res){

	//var renderedHtml = ejs.render(content, {rows:rows});

//sql of join
//var sql = "SELECT meeting.date, meeting.nom, meeting, user.nom FROM meeting INNER JOIN user ON meeting.userID=user.userID";
 

//select all from meeting where userID= validation join from user where meeting ==  ce meeting

/*
SELECT meeting.ID, user.userName
FROM meeting
INNER JOIN matchingTable ON Orders.CustomerID = Customers.CustomerID;*/
  var sql = "SELECT * FROM meeting";
      con.query(sql,function (err, result, fields) {
        if (err) throw err;
        console.log("Result: " + result);
        res.render('inTimeHome', {result});
      });

		/*var sqlUser = "SELECT * FROM user";
		var resultat;
		con.query(sql,function (err, result, fields) {
			if (err) throw err;
			console.log("Result: " + result);
			var resultat = result;
			//the page in the views folder + the data
		});*/

});

/*********************************

             LOGIN

**********************************/  
var sess;    
app.post('/login',function(req,res){


  if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);

            var email = [[post['email']]];
            var password = [[post['password']]];

  var sql = "SELECT * FROM user WHERE email = ? AND password= ?";
  con.query(sql,[email, password], function (err, result) {
      if (err) throw err;
      console.log(result);
      if(result.length == 1){

        sess= req.session;
        sess.userID= result.ID;

        res.redirect('/home');
      }
      else{
        console.log("you are not a member");
      }
    
    });


  //set les cookies comme veariable de session et renvoyer sur la home
  //coockies = result.ID


});

}
});


app.listen(8045);


