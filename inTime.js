var express = require('express');
var app = express();
var port = process.env.PORT || 8045;
//const portis = require('portis');
//const web3 = require('web3');
const qs = require('querystring');
var mysql = require('mysql');
var ejs = require('ejs');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Marley9637",
  database: "mydb"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.set('view engine', 'ejs' );

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
            // use post['blah'], etc.
                console.log(post['time']);
    			console.log(post['stake']);

    		var sql = "INSERT INTO user (nom, prenom, address) VALUES ?";

    		var values = [[post['nom'], post['prenom'], post['ethAddress']]];

			con.query(sql, [values],function (err, result) {
				if (err) throw err;
				console.log("Result: " + result);
			});

        });
    }
      res.sendFile(__dirname + '/inTimeInscription.html');
    

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
    	  res.sendFile(__dirname + '/inTime.html');

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
            // use post['blah'], etc.
                console.log(post['time']);
    			console.log(post['stake']);

    		var sql = "SELECT * FROM user";

			con.query(sql,function (err, result, fields) {
				if (err) throw err;
				console.log("Result: " + result);
			});

        });
    }
     res.sendFile(__dirname + '/inTimeBack.html');

});

   /*if(typeof web3 != 'undefined'){
      console.log("Using web3 detected from external source like Metamask")
      	    this.web3 = new web3(web3.currentProvider);

   }else{
         this.web3 = new web3(new portis.Provider({ network: 'ropsten' }))
         console.log(web3.currentProvider.isPortis);
   }
this.web3.version.getNetwork((err, netId) => {
  switch (netId) {
    case "1":
      console.log('This is mainnet')
      break
    case "2":
      console.log('This is the deprecated Morden test network.')
      break
    case "3":
      console.log('This is the ropsten test network.')
      break
    case "4":
      console.log('This is the Rinkeby test network.')
      break
    case "42":
      console.log('This is the Kovan test network.')
      break
    default:
      console.log('This is an unknown network.')
  }
})
//var account = this.web3.eth.accounts[0];
var accountInterval = setInterval(function() {
  if (this.web3.eth.accounts[0] !== account) {
    account = this.web3.eth.accounts[0];
    //updateInterface();
  }
}, 100);

var cryptopokerContract = this.web3.eth.contract([
  {
    "constant": false,
    "inputs": [],
    "name": "setId",
    "outputs": [
      {
        "name": "res",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
]);
// here goes a bit of code that you copy from your remix compiler like benetth wuth the uge string of hexadecimal
var cryptopoker = cryptopokerContract.new(
   
   {
          from: this.web3.eth.accounts[0], 
               data: '0x60606040523415600e57600080fd5b60ab8061001c6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063087e926c146044575b600080fd5b3415604e57600080fd5b6054606e565b604051808215151515815260200191505060405180910390f35b6000600160008190555060019050905600a165627a7a723058209c4ed99693f2597cd898d6940945c17adb8162d2caf7c7547a554bacbb1fc3ba0029', 
     gas: '4700000'
   
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })

    // the address of the contract you are interracting with
var pokerContract = cryptopokerContract.at('0x692a70d2e424a56d2c6c27aa97d1a86395877b3a');


$("#submit").click(function(){

    pokerContract.setId(function(error, result){
        if(!error)
            console.log(JSON.stringify(result));
        else
            console.error(error);
        });
});

// a good practice is to always try to put the smart contract's function requirement as beneeth
//require more than 5 players/ player not busted / player stillIn

/*$('#busted').click(function(){

    var r = confirm("voulez vous vraiment busted le joueur à l'id"+0);
    if (r == true) {
        //when you call a function of the contract you always need to put a calbak function as in the exemple
         pokerContract.playerBusted( 0, function(error, result){
        if(!error)
            console.log(JSON.stringify(result));
        else
            console.error(error);
        });
    } 

});*/

app.listen(8045);