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
var url = "mongodb://localhost:27017/";
var session = require('express-session');
var nodemailer = require('nodemailer');
var BigNumber = require('bignumber.js');


var helper = require('sendgrid').mail;
var from_email = new helper.Email('jimmyarona@hotmail.be');



app.set('view engine', 'ejs' );
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/assets'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
var transporter = nodemailer.createTransport({
   host: 'localhost',
   port: 587,
   service: 'Outlook365',
   secure: false, 
  auth: {
    user: 'jimmyarona@hotmail.be',
    pass: "j'adore"
  }
});


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
            var email = post['email'];
            var password = post['password'];
            var nom = post['nom'];
            var prenom = post['prenom'];
            var address = post['ethAddress'];
            var meetingList = [];
            sess= req.session;
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("inTime");
              dbo.collection("user").findOne({email: email, password:password}, { _id: 0, name: 1 },function(err, result) {
                if (err) throw err;
                console.log(result);

                if(result != null){

                //envoyer qu'il y a une erreur
                    console.log("yop");
                    db.close();
                }
                else{

                  //ajouter un utilisateur
                      MongoClient.connect(url, function(err, db) {
                      var dbo = db.db("inTime");
                      var meetingList = [];
                      var myobj = { name: nom, prenom: prenom, email: email, password: password, address: address, meetingList: meetingList };

                      dbo.collection("user").insertOne(myobj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        db.close();
                         sess._id = res._id;
                         console.log(res);
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
var sess;    
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
                console.log(result);


                if(result == null){

                //envoyer qu'il y a une erreur

                    console.log("you are not a participant");
                    db.close();
                    res.redirect('/');
                }
                else{

                    sess.name = result.name;
                    sess.mail = result.email;
                    sess._id = result._id;
                    sess.addr = result.address;
                    console.log(JSON.stringify(sess.addr));
                    

                    db.close();
                    res.redirect('/home');
                }
  
              });

            });


  //set les cookies comme veariable de session et renvoyer sur la home


});

}
});
/******************************************

	           	PAGE HOME/PROFIL

*********************************************/
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
    socket.broadcast.emit('message', 'Un autre client vient de se connecter !');

    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
    }); 
});

//faire apparaitre les rendez vous proposé,
//pour cela  il faut un booléen participe
app.get('/home', function(req,res){

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("inTime");
  //var queryObj = participants
  dbo.collection("inTime").find({}, { _id: 1, name: 1, meetTime:1, stake:1,participants:1 }).toArray(function(err, result) {
    if (err) throw err;
    var newResult=[];

 //coder un filtre
   for (var i = result.length - 1; i >= 0; i--) {
        
        var a = result[i].participants.indexOf(sess.mail);
        
        console.log(a);


      if( a >= 0 ){ 

        newResult.push(result[i]);

        //compare date Time and sort in fonction of that from the more close from the present
      }
        
    }

// or var balance = web3.eth.getBalance(someAddress);

//adresse.plus(21).toString(16); // toString(10) converts it to a number string
// "131242344353464564564574574567477"

     
    //console.log(adresse);

    newResult.smartId = JSON.stringify(sess.addr);



console.log(newResult.smartId);

    res.render('inTimeHome', {newResult});
    db.close();
  });
});

});

/*MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection('inTime').aggregate([
    { $lookup:
       {
         from: 'usersMeeting',
         localField: 'product_id',
         foreignField: '_id',
         as: 'orderdetails'
       }
     }
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res));
    db.close();
  });
});*/


/******************************************

             MEETING PAGE

******************************************/ 
app.get(('/meeting'),function(req,res){
  
//il faut update les user meetingList => un tableau des rendez vous 
//avec le tableau des rendezvous : faire apparaitre les rendez-vous
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("inTime");
  dbo.collection("user").find({}, { _id: 1, name: 1 }).toArray(function(err, result) {
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
            
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
          var post = qs.parse(body);


          var name = post['name'];
          var meetTime = post['meetTime'];
          var stake = post['stake'];
          //ajouter la liste des assistants
          var participants =post['participants[]'];

   
    if(Array.isArray(post['participants[]']) == false){
      

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//'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'
//sgMail.setApiKey('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');
participants = [post['participants[]']];
const msg = {
  to: participants,
  from: 'jimmy@hive.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);



   /* var mailOptions = {
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

/*var to_email = new helper.Email(participants);
var subject = 'Hello World from the SendGrid Node.js Library!';
var content = new helper.Content('text/plain', 'Hello, Email!');
var mail = new helper.Mail(from_email, subject, to_email, content);

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: participants,
          },
        ],
        subject: 'Hello World from the SendGrid Node.js Library!',
      },
    ],
    from: {
      email: 'jimmyarona@hotmail.be',
    },
    content: [
      {
        type: 'text/plain',
        value: 'Hello, Email!',
      },
    ],
  },
});

//With promise
sg.API(request)
  .then(response => {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  })
  .catch(error => {
    //error is an instance of SendGridError
    //The full response is attached to error.response
    console.log(error.response.statusCode);
  });
*/

    }else {
    
      for (var i = 0; i < participants.length; i++) {

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
                    transporter.close();
                  }
                });


      }

    }

        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("inTime");
            //récupérer les checkbox pour les mettres dans la db
            var myobj = { name: name, meetTime: meetTime, stake:stake , participants:participants};
            console.log(participants);
            dbo.collection("inTime").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 meeting inserted");
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
app.get('/admin', function(req,res){
 var newResult = {}; 
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("inTime");
  dbo.collection("inTime").find({}).toArray(function(error, result) {
    if (error) throw error;
    newResult.meeting = result;
    console.log(newResult);
    db.close();
  });
});

 MongoClient.connect(url, function(error, db) {
  if (error) throw error;
  var dbo = db.db("inTime");
  dbo.collection("user").find({}).toArray(function(err, response) {
    if (err) throw err;
    newResult.user = response;
    res.render('inTimeBack', {newResult});

    db.close();
  });
});




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



app.listen(8045);


