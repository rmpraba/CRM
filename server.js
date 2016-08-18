 var express    = require("express");
 var mysql      = require('mysql');
 var email   = require("emailjs/email");
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'admin',
   database : 'scorecarddb'
 });
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('app'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
   res.sendFile("app/index.html" );
})


function setvalue(){
  console.log("calling setvalue.....");
}
var server = app.listen(8086, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});