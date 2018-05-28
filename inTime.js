var express = require('express');
var app = express();
var port = process.env.PORT || 8045;
const portis = require('portis');
const web3 = require('web3');
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

        res.redirect('/home');
      }
      else{
        console.log("you are not a member");
      }
    
    });


  //set les cookies comme veariable de session et renvoyer sur la home


});

}
});

/**********************************

             WEB3.JS

***********************************/
/*
   if(typeof web3 != 'undefined'){
      console.log("Using web3 detected from external source like Metamask")
      	    this.web3 = new web3(web3.currentProvider);

   }else{
         this.web3 = new web3(new portis.PortisProvider({ network: 'ropsten' }))
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
/*var accountInterval = setInterval(function() {
  if (this.web3.eth.accounts[0] !== account) {
    account = this.web3.eth.accounts[0];
    //updateInterface();
  }
}, 100);

// here goes a bit of code that you copy from your remix compiler like benetth wuth the uge string of hexadecimal
var intimeContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_amount","type":"uint256"}],"name":"ethWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_stake","type":"uint256"}],"name":"participate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newState","type":"bool"}],"name":"setPaused","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_stake","type":"uint256"}],"name":"setMeeting","outputs":[{"name":"res","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_stake","type":"uint256"}],"name":"refund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"totalMeetingStake","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pausedState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isPaused","outputs":[{"name":"isIndeed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"participantsIn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"redistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"}],"name":"late","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"newPausedState","type":"bool"}],"name":"LogPausedSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"LogOwnerSet","type":"event"}]);
var intime = intimeContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000f57600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008060146101000a81548160ff021916908315150217905550611213806100786000396000f3006060604052600436106100db576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630d0d6f4f146100e0578063129874aa1461010c57806313af40351461012d57806316c38b3c1461017e5780631aa3a008146101bb5780631e010439146101e45780633f8f35881461021b5780635af36e3e146102995780635e3b96d1146102ba578063893d20e8146102e3578063a2dab42c14610338578063b187bd2614610365578063c80a9d5414610392578063e37b346d146103bb578063e53e41a9146103d0575b600080fd5b34156100eb57600080fd5b61010a60048080359060200190919080359060200190919050506103f3565b005b61012b6004808035906020019091908035906020019091905050610523565b005b341561013857600080fd5b610164600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610608565b604051808215151515815260200191505060405180910390f35b341561018957600080fd5b6101a1600480803515159060200190919050506107a0565b604051808215151515815260200191505060405180910390f35b34156101c657600080fd5b6101ce610888565b6040518082815260200191505060405180910390f35b34156101ef57600080fd5b6102056004808035906020019091905050610a0b565b6040518082815260200191505060405180910390f35b341561022657600080fd5b61027f600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050610a91565b604051808215151515815260200191505060405180910390f35b6102b86004808035906020019091908035906020019091905050610bc2565b005b34156102c557600080fd5b6102cd610c78565b6040518082815260200191505060405180910390f35b34156102ee57600080fd5b6102f6610c7e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561034357600080fd5b61034b610ca7565b604051808215151515815260200191505060405180910390f35b341561037057600080fd5b610378610cba565b604051808215151515815260200191505060405180910390f35b341561039d57600080fd5b6103a5610cd0565b6040518082815260200191505060405180910390f35b34156103c657600080fd5b6103ce610cd6565b005b34156103db57600080fd5b6103f16004808035906020019091905050610e54565b005b60011515600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160149054906101000a900460ff16151514151561045557600080fd5b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101541115156104a557600080fd5b6004828154811015156104b457fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561051f57600080fd5b5050565b60011515600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160149054906101000a900460ff16151514151561058557600080fd5b803414151561059357600080fd5b600160026000828254019250508190555080600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160008282540392505081905550806001600082825401925050819055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561066557600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141515156106c157600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141515156106fd57600080fd5b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fa1d2149652d81eb35c360c115fc7ac594124cb1ea8a5a33e9a7f5768c62869fb60405160405180910390a360019050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107fd57600080fd5b600060149054906101000a900460ff1615158215151415151561081f57600080fd5b81600060146101000a81548160ff0219169083151502179055508115153373ffffffffffffffffffffffffffffffffffffffff167fae0f86d9801b0bd39a2ce25d9fd1f202f2fd22e80150be4a99adb0275a635d6c60405160405180910390a360019050919050565b6000801515600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160149054906101000a900460ff1615151415156108eb57600080fd5b6001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160146101000a81548160ff0219169083151502179055506001600260008282540192505081905550600254600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020181905550600480548060010182816109b49190610ee4565b9160005260206000209001600033909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050600254905090565b600060036000600484815481101515610a2057fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101549050919050565b60008082816002018190555082816003016000828254019250508190555083816000019080519060200190610ac7929190610f10565b50806004018054806001018281610ade9190610ee4565b9160005260206000209001600033909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060058054806001018281610b419190610f90565b9160005260206000209060050201600083909190915060008201816000019080546001816001161561010002031660029004610b7e929190610fc2565b506001820154816001015560028201548160020155600382015481600301556004820181600401908054610bb3929190611049565b50505050600191505092915050565b60011515600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160149054906101000a900460ff161515141515610c2457600080fd5b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101600082825401925050819055505050565b60015481565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600060149054906101000a900460ff1681565b60008060149054906101000a900460ff16905090565b60025481565b600080600254600154811515610ce857fe5b0491505b600254811015610e42576001151560036000600484815481101515610d0d57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160159054906101000a900460ff1615151415610e35578160036000600584815481101515610da057fe5b906000526020600020906005020160040184815481101515610dbe57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101600082825401925050819055505b8080600101915050610cec565b60056000610e50919061109b565b5050565b6000151560036000600484815481101515610e6b57fe5b906000526020600020900160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160159054906101000a9050505050565b815481835581811511610f0b57818360005260206000209182019101610f0a91906110bf565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610f5157805160ff1916838001178555610f7f565b82800160010185558215610f7f579182015b82811115610f7e578251825591602001919060010190610f63565b5b509050610f8c91906110bf565b5090565b815481835581811511610fbd57600502816005028360005260206000209182019101610fbc91906110e4565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610ffb5780548555611038565b8280016001018555821561103857600052602060002091601f016020900482015b8281111561103757825482559160010191906001019061101c565b5b50905061104591906110bf565b5090565b82805482825590600052602060002090810192821561108a5760005260206000209182015b8281111561108957825482559160010191906001019061106e565b5b509050611097919061113b565b5090565b50805460008255600502906000526020600020908101906110bc91906110e4565b50565b6110e191905b808211156110dd5760008160009055506001016110c5565b5090565b90565b61113891905b808211156111345760008082016000611103919061117e565b60018201600090556002820160009055600382016000905560048201600061112b91906111c6565b506005016110ea565b5090565b90565b61117b91905b8082111561117757600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101611141565b5090565b90565b50805460018160011615610100020316600290046000825580601f106111a457506111c3565b601f0160209004906000526020600020908101906111c291906110bf565b5b50565b50805460008255906000526020600020908101906111e491906110bf565b505600a165627a7a7230582094ddefcd10f4f2384bb1e9fe6c9e860bf7991322866ef6d990672fb1fefca0280029', 
 })
    gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 
    // the address of the contract you are interracting with
var inContract = intimeContract.at('0x6cfbb6a669e2b42a029083e2bceb364b93cdd351');


$("#submit").click(function(){

    (function(error, result){
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


