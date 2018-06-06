var express = require('express');
var app = express();
var port = process.env.PORT || 8045;
const portis = require('portis');
const web3 = require('web3');
const qs = require('querystring');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://jimmy:XCIdBNjMqct4hiWk@hive-ymdnx.mongodb.net/test?retryWrites=true";
var session = require('express-session');
var nodemailer = require('nodemailer');//to use in local
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

app.set('view engine', 'ejs' );//set ejs as view engine
app.use(express.static(__dirname + '/src'));//include css
app.use(express.static(__dirname + '/assets'));//include assets
//declare session variable
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))



/*
used in local
var transporter = nodemailer.createTransport({
  pool:true,
   host: 'https://intimetokentest.herokuapp.com/',
   port: 587,
   service: 'Outlook365',
   secure: false, 
  auth: {
    user: 'jimmyarona@hotmail.be',
    pass: "j'adore"
  }
});
*/
var sess;

/*********************************
	
        REGISTER PAGE

***********************************/

app.get('/', function(req,res){

  res.sendFile(__dirname + '/inTimeInscription.html');
});
// register page
app.post('/',function(req,res){
sess=req.session;
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
            var email = post['email'];
            var password = post['password'];
            var nom = post['nom'];
            var prenom = post['prenom'];
            var address = post['ethAddress'];
            var meetingList = [];
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("inTime");
              dbo.collection("user").findOne({email: email, password:password}, { _id: 0, name: 1 },function(err, result) {
                if (err) throw err;

                if(result != null){

                //envoyer qu'il y a une erreur
                    console.log("yop");

                    db.close();
                    res.redirect('/');
                }
                else{

                  //ajouter un utilisateur
                      MongoClient.connect(url, function(err, db) {
                      var dbo = db.db("inTime");
                      var meetingList = [];
                      var myobj = { name: nom, prenom: prenom, email: email, password: password, address: address, meetingList: meetingList };

                      dbo.collection("user").insertOne(myobj, function(err, res) {
                        if (err) throw err;
                        console.log(res);
                        sess._id = res._id;
                        db.close();
                      });
                    });

                      sess.mail= email;
                      sess.name = nom;

                    res.redirect('/home');
                }
  
              });

            });
    
        });
    }

});
/*********************************

             LOGIN

**********************************/  
//handle login   
app.post('/login',function(req,res){

sess= req.session;

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
            var email = post['email'];
            var password = post['password'];

            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("inTime");
              dbo.collection("user").findOne({email: email, password:password}, { _id: 0, name: 1 },function(err, result) {
                if (err) throw err;
    
                if(result == null){

                //envoyer qu'il y a une erreur
                res.redirect('/');
                    console.log("you are not a member");
                    db.close();
                }
                else{
                      //set les variable de session et renvoyer sur la home
                    sess.name = result.name;
                    sess.mail = result.email;
                    sess.id = result._id;

                    db.close();
                    res.redirect('/home');
                }
  
              });

            });





});

}
});
/******************************************

	           	PAGE HOME/PROFIL

*********************************************/


//faire apparaitre les rendez vous proposé,
//pour cela  il faut un booléen participe
app.get('/home', function(req,res){

console.log(sess);
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("inTime");
  //var queryObj = participants
  dbo.collection("inTime").find({}, { _id: 1, name: 1, meetTime:1, stake:1 }).toArray(function(err, result) {
    if (err) throw err;


     var newResult=[];

 //coder un filtre
   for (var i = result.length - 1; i >= 0; i--) {
        
        var a = result[i].participants.indexOf(sess.mail);
        


       if( a >= 0 ){ 

          newResult.push(result[i]);
       }

        
    }

    res.render('inTimeHome', {newResult});
    db.close();
  });
});

});


/******************************************

             MEETING PAGE

******************************************/ 
app.get(('/meeting'),function(req,res){
  

MongoClient.connect(url, function(err, db) {//connection et action DB
  if (err) throw err;
  var dbo = db.db("inTime");
  //renvoyer les différents user avec qui il est possible de prendre rendez-vous
  dbo.collection("user").find({}, { _id: 1, prenom: 1, email:1 }).toArray(function(err, result) {
    if (err) throw err;

    db.close();
    res.render('inTestMeeting', {result});

  });

  });


});

app.post('/meeting',function(req,res){

  if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
           console.log(body.length);
           if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
          var post = qs.parse(body);

          console.log("ok");
          var name = post['name'];
          var meetTime = post['meetTime'];
          var stake = post['stake'];
          //ajouter la liste des assistants
          var participants =post['participants[]'];
          console.log(post['participants[]']);

// si il y a un seul participant le front me renvoi une string donc utiliser ca comme une string
    if(Array.isArray(post['participants[]']) == false){
  

  /* en local
   var mailOptions = {
                  from: 'jimmyarona@hotmail.be',
                  to: participants,
                  subject: 'inTime',
                  text: 'You received an invatation to be intime at '+ post['name']+ ' the '+ post['meetTime']
                  //ajouter html
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                    transporter.close();
                  }
                });*/

                
//'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'
//sgMail.setApiKey('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');
const msg = { // mail à envoyer au travers de l'api
  to: participants,
  from: 'jimmy@hive.com',
  subject: 'inTime meeting',
  text:'You received an invatation to be intime for the '+ post['name']+ 'meeting at '+ post['meetTime'],
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

    }else {
      for (var i = 0; i < participants.length; i++) {

/* en local
          var mailOptions = {
                  from: 'jimmyarona@hotmail.be',
                  to: participants[i],
                  subject: 'inTime',
                  text: 'You received an invatation to be intime for the '+ post['name']+ 'meeting at '+ post['meetTime']
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                    
                  }
                });*/
          
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//'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'

const msg = {
  to: participants[i],
  from: 'jimmy@hive.com',
  subject: 'inTime meeting',
  text: 'You received an invatation to be intime for the '+ post['name']+ 'meeting at '+ post['meetTime'],
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);


      }
      //transporter.close(); 
    }


        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("inTime");
            //récupérer les checkbox pour les mettres dans la db
            var myobj = { name: name, meetTime: meetTime, stake:stake , participants:participants};

            dbo.collection("inTime").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              transporter.close();
              db.close();
            });


        });
 
        });

    }

        res.redirect('/home');

});

/*****************************************

             ADMIN PAGE

******************************************/ 
//la page sur laquelle apparaissent les différents meeting
app.get('/admin', function(req,res){
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("inTime");
  dbo.collection("inTime").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.render('inTimeBack', {result});
    console.log(result);
    db.close();
  });
});
});


//set si un user est à l'heure ou pas

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
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
      });
  }
  res.sendFile(__dirname + '/inTimeBack.html');

});

/*
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
*/



app.listen(port);


