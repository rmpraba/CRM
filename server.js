 var express    = require("express");
 var mysql      = require('mysql');
 var email   = require("emailjs/email");
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'admin',
   database : 'mlzscrm'
 });
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('app'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
   res.sendFile("app/index.html" );
});

app.post('/loginpage',  urlencodedParser,function (req, res)
{
  var user={"employee_id":req.query.username};
  var pass={"password":req.query.password};
console.log('hi');
       connection.query('SELECT (select name from md_school where id=e.school_id) as schoolname,e.school_id, e.employee_name,e.role_id, r.role_name, a.rt_dashboard, a.rt_enquiry,a.rt_admission_form,a.rt_adm_approval, a.rt_followup, a.rt_collectionentry FROM md_employee as e JOIN md_role as r JOIN md_access_rights as a on r.role_id=e.role_id and a.role_id=e.role_id where ? and ?',[user,pass],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': ''});
    }
  }
  else{
    console.log(err);
  }
});
  });


 app.post('/add-event',  urlencodedParser,function (req, res){
   var event = {
     "title": req.query.title,
     "description": req.query.description,
     "start_date": req.startdate,
     "end_date": req.query.enddate,
     "event_type":req.query.event_type,
     "occurrence_frequency": req.query.frequency,
     "is_recurrence": req.query.is_recurrence,
     "occurrences": req.query.occurrance,
     "event_location": req.query.event_location,
     "status": "1"
   };
   connection.query('insert into new_event set ?',[event],
     function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }
     });
 });
function setvalue(){
  console.log("calling setvalue.....");
}
var server = app.listen(8086, function () {
var host = server.address().address;
var port = server.address().port;
console.log("Example app listening at http://%s:%s", host, port);
});
