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
//console.log('hi');

  connection.query('SELECT (select short_name from md_school where id=e.school_id) as shortname,(select name from md_school where id=e.school_id) as schoolname,e.school_id,e.employee_id, e.employee_name,e.role_id, r.role_name, a.rt_dashboard, a.rt_enquiry,a.rt_admission_form,a.rt_adm_approval, a.rt_followup, a.rt_collectionentry FROM md_employee as e JOIN md_role as r JOIN md_access_rights as a on r.role_id=e.role_id and a.role_id=e.role_id where ? and ?',[user,pass],

        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
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


app.post('/fetchgrade-service',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    connection.query('SELECT * FROM grade_master',
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
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


app.post('/generatefeecode-service',  urlencodedParser,function (req, res){
    var schoolid=req.query.schoolid;
    var prefixid=req.query.prefixid;
    var response={"prefixname":""};
    connection.query("SELECT * FROM prefix_master WHERE prefix_id='"+prefixid+"'",function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      response.prefixname=rows[0].prefix_name;
      connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
        if(rows.length>0){
          var feecode=response.prefixname+rows[0].fee_sequence;
          var new_seq=parseInt(rows[0].fee_sequence)+1;
          connection.query("UPDATE fee_code_sequence SET fee_sequence='"+new_seq+"' WHERE school_id='"+schoolid+"'",function(err, rows){
          if(!err)
          res.status(200).json({'returnval': feecode});
          });
        }
        else{
          res.status(200).json({'returnval': 'seqfail'});
        }
      });
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'prefixfail'});
    }
  }
  else{
     console.log(err);
  }
});
});


app.post('/createfeecode-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade_id:req.query.grade,
      fee_code:req.query.feecode,
      fee_name:req.query.feename
    };
    connection.query('INSERT INTO fee_master SET ?',[response],
    function(err, rows)
    {
    if(!err)
    {
      res.status(200).json({'returnval': 'Fee code generated'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Problem in generating feecode'});
    }
    });
});


app.post('/feecodesplitup-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      fee_code:req.query.feecode,
      fee_type:req.query.feetype,
      fee_type_code:req.query.feetypecode,
      total_fee:req.query.totalfees,
      no_of_installment:req.query.installment
    };
    connection.query('INSERT INTO fee_splitup SET ?',[response],
    function(err, rows)
    {
    if(!err)
    {
      res.status(200).json({'returnval': 'succ'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'fail'});
    }
    });
});


app.post('/createinstallment-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      fee_code:req.query.feecode,
      fee_type:req.query.feetype,
      fee_type_code:req.query.feetypecode,
      no_of_installment:req.query.installment,
      installment_name:req.query.installmentname,
      installment_amount:req.query.installmentamount,
      installment_date:req.query.installmentdate
    };
    connection.query('INSERT INTO installment_master SET ?',[response],
    function(err, rows)
    {
    if(!err)
    {
      res.status(200).json({'returnval': 'succ'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'fail'});
    }
    });
});


/*This function is used to submit the simple enquiry details of the student for the first time*/
app.post('/submitenquiry',  urlencodedParser,function (req, res)
{
  var collection={"enquiry_no":req.query.id,"school_id":req.query.schol,"academic_year":req.query.acadeyr,"class":req.query.grade,"father_mob":req.query.contact,"gender":req.query.gender,"first_name":req.query.firstname,"middle_name":req.query.middlename,"last_name":req.query.lastname,"dob":req.query.dobs,"father_name":req.query.father,"locality":req.query.location,"mother_name":req.query.mother,"father_email":req.query.email,"created_by":req.query.createdby,"created_on":req.query.createdate,"enquiry_name":req.query.givenname,"status":"Enquired"};
       connection.query('insert into student_enquiry_details set ? ',[collection],
        function(err, rows)
        {
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

/*It update the already entered student details with more information after the counselling using student name or enquiry number
*/
app.post('/updateenquiry',  urlencodedParser,function (req, res)
{
   var collection={"first_name":req.query.firstname,"middle_name":req.query.middlename,"last_name":req.query.lastname,"gender":req.query.gender,"class":req.query.grade,"dob":req.query.dob,"old_class":req.query.oldclass,"old_school":req.query.oldschool,"mother_tongue":req.query.mothertongue,"father_name":req.query.fathername,"mother_name":req.query.mothername,"father_qualification":req.query.fatheredu,"mother_qualification":req.query.motheredu,"father_mob":req.query.fathermob,"mother_mob":req.query.mothermob,"father_email":req.query.fathermail,"mother_email":req.query.mothermail,"father_company":req.query.fathercompany,"mother_company":req.query.mothercompany,"father_occupation":req.query.fatherjob,"mother_occupation":req.query.motherjob,"flat_no":req.query.flatno,"address1":req.query.address1,"address2":req.query.address2,"address3":req.query.address3,"city":req.query.city,"pincode":req.query.pincode,"state":req.query.statename,"enquiry_source":req.query.enquiysource,"sibiling_name":req.query.siblingname,"sibling_detail":req.query.siblingdetails,"transport_requirment":req.query.transportreq,"canteen_requirment":req.query.canteenreq,"second_language":req.query.secondlanguage,"third_language":req.query.thirdlanguage,"updated_by":req.query.modified,"prospectus_sold":req.query.prospectstatus,"father_designation":req.query.daddesignation,"mother_designation":req.query.momdesignation,"father_income":req.query.dadincome,"mother_income":req.query.momincome,"prospectus_no":req.query.prospectusno};
    var school={"school_id":req.query.schol};
    var enquiry={"enquiry_no":req.query.enq};

  console.log(req.query.momincome);
       connection.query('update student_enquiry_details set ? where ? and ?',[collection,enquiry,school],
    function(err, rows)
    {
    if(!err)
    {
        console.log('inserted');
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });

 app.post('/registerenquiryform',  urlencodedParser,function (req, res)
 {
   console.log('hello2');
   var collection={"school_id":req.query.schol,"enquiry_no":req.query.enq,"first_name":req.query.firstname,"middle_name":req.query.middlename,"last_name":req.query.lastname,"gender":req.query.gender,"class":req.query.grade,"dob":req.query.dob,"old_class":req.query.oldclass,"old_school":req.query.oldschool,"mother_tongue":req.query.mothertongue,"father_name":req.query.fathername,"mother_name":req.query.mothername,"father_qualification":req.query.fatheredu,"mother_qualification":req.query.motheredu,"father_mob":req.query.fathermob,"mother_mob":req.query.mothermob,"father_email":req.query.fathermail,"mother_email":req.query.mothermail,"father_company":req.query.fathercompany,"mother_company":req.query.mothercompany,"father_occupation":req.query.fatherjob,"mother_occupation":req.query.motherjob,"flat_no":req.query.flatno,"address1":req.query.address1,"address2":req.query.address2,"address3":req.query.address3,"city":req.query.city,"pincode":req.query.pincode,"state":req.query.statename,"enquiry_source":req.query.enquiysource,"sibiling_name":req.query.siblingname,"sibling_detail":req.query.siblingdetails,"transport_requirment":req.query.transportreq,"canteen_requirment":req.query.canteenreq,"second_language":req.query.secondlanguage,"third_language":req.query.thirdlanguage,"updated_by":req.query.modified,"prospectus_sold":req.query.prospectstatus,"father_designation":req.query.daddesignation,"mother_designation":req.query.momdesignation,"father_income":req.query.dadincome,"mother_income":req.query.momincome,"prospectus_no":req.query.prospectusno,"academic_year":req.query.academicyear,"enquiry_name":req.query.givenname,"status":req.query.status};
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_no":req.query.enq};
   connection.query('insert into student_enquiry_details set ?',[collection],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted2');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });
/*this function is to get the total sequence number that has been created depending on the enquiry*/
app.post('/getenquiryno',  urlencodedParser,function (req, res)
{
  var id={"school_id":req.query.schol};

       connection.query('SELECT enquiry_no from sequence where ? ',[id],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  }
});
  });
/*this function is to fetch the available classes with repect to the school*/
app.post('/getclasses',  urlencodedParser,function (req, res)
{
  var id={"school_id":req.query.schol};

       connection.query('SELECT distinct class from class_details where ? ',[id],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  }
    else{
     console.log(err);
  }
});
  });


/*this function is to fetch the list of locations available with respect to school*/
app.post('/getlocation',  urlencodedParser,function (req, res)
{
  var id={"school_id":req.query.schol};

       connection.query('SELECT * from md_habitat where ? ',[id],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  }
  else{
     console.log(err);
  }
});
  });


/*this function is to fetch the name of student those who filled simple enquiry form and ready to fill the detailed enquiry form after counselling*/
app.post('/getstudentname',  urlencodedParser,function (req, res)
{
  var id={"school_id":req.query.schol};

       connection.query("SELECT * from student_enquiry_details where ? and pincode!=''",[id],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  }
    else{
     console.log(err);
  }
});
  });


/*this func is to update the sequence number only when the enquiry form is submitted*/

app.post('/updateenquiry',  urlencodedParser,function (req, res)
{

  var school={"school_id":req.query.schol};
  var enquiry={"enquiry_no":req.query.id};

       connection.query('update student_enquiry_details set ? where ? and ?',[enquiry,school],
        function(err, rows)
        {
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

/*this function is used to update the sequence number only when the enquiry form is submitted*/
app.post('/updateseq',  urlencodedParser,function (req, res)
{
  var school={"school_id":req.query.schol};
  var enquiry={"enquiry_no":req.query.id};
       connection.query('update sequence set ? where ?',[enquiry,school],
        function(err, rows)
        {
    if(!err)
    {
      console.log('updated');
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
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

 /*this function is used to get the details of the particular enquiry using enquiry no*/
app.post('/getenqirydetails',  urlencodedParser,function (req, res)
{
  var id={"school_id":req.query.schol};
  var enqnum={"enquiry_no":req.query.enqno};

       connection.query('SELECT * from student_enquiry_details where ? and ?',[id,enqnum],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
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


/*this function is used to verify with the database whether the specific number is existing in database or not*/

app.post('/verifymobileno',  urlencodedParser,function (req, res)
{

       connection.query("SELECT * from student_enquiry_details where school_id='"+req.query.schol+"' and (father_mob='"+req.query.mobileno+"' or mother_mob='"+req.query.mobileno+"') ",
  function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0)
    {
//console.log(rows);
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

// Searching enquiry no for admission
app.post('/searchenquiry',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no like '%"+req.query.enquiryno+"%' or enquiry_name like '%"+req.query.enquiryno+"%' and status='Enquired'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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


// Fetching enquiry no for admission
app.post('/fetchenquiryinfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.enquiryno+"' and status='Enquired'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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

// Insert Admission
app.post('/insertadmission',  urlencodedParser,function (req, res){

    var response={
        enquiry_no: req.query.enquiryno,
        admission_no: "",
        prospect_application_no:req.query.applicationno,
        school_id:req.query.schoolid,
        school_name:req.query.schoolname,
        academic_year:req.query.admissionyear,
        first_name:req.query.firstname,
        middle_name:req.query.middlename,
        last_name:req.query.lastname,
        student_name:req.query.studentname,
        class_for_admission:req.query.admissiongrade,
        dob:req.query.admissiondob,
        gender:req.query.admissiongender,
        disabled_student:req.query.admissiondisabled,
        canteen_availed:req.query.admissioncanteen,
        transport_availed:req.query.admissiontransport,
        created_By:req.query.createdby,
        father_name:req.query.fathername,
        mother_name:req.query.mothername,
        admission_year:req.query.admissionyear
    }

    var qur="SELECT * FROM auto_admission_no";
    console.log(qur);
    connection.query(qur,function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      response.admission_no="ENR"+rows[0].Admission_No;
      new_admission_no=parseInt(rows[0].Admission_No)+1;
      connection.query("INSERT INTO md_admission SET ?",[response],function(err, rows){
       if(!err){
        connection.query("UPDATE auto_admission_no SET Admission_No='"+new_admission_no+"'",function(err, result){
          if(result.affectedRows>0){
            connection.query("UPDATE student_enquiry_details SET status='Admitted' where enquiry_no='"+req.query.enquiryno+"'",function(err, result){
              if(result.affectedRows>0){
              res.status(200).json({'returnval': response.admission_no});
              }
              else
              res.status(200).json({'returnval': 'admissionfail'});
            });
          }
        else
        res.status(200).json({'returnval': 'updatefail'});

      });
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'insertfail'});
    }

});
    }
    else
      res.status(200).json({'returnval': 'noadmissionno'});
  }
  });
});


// Fetching enquiry no for admission
app.post('/searchfeeenquiry',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.enquiryno+"' or first_name='"+req.query.firstname+"'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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



// Fetching enquiry no for admission
app.post('/searchadmnenquiry',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_admission WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.enquiryno+"' or first_name='"+req.query.firstname+"'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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


// Fetching enquiry no for admission
app.post('/searchadmission',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_admission WHERE school_id='"+req.query.schoolid+"' and admission_no = '"+req.query.admissionno+"' or first_name='"+req.query.firstname+"'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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


// Fetching fees for admission
app.post('/fetchfees',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM fee_master WHERE school_id='"+req.query.schoolid+"' and admission_year = '"+req.query.admissionyear+"' and academic_year='"+req.query.academicyear+"' and grade_id=(SELECT grade_id FROM grade_master WHERE grade_name='"+req.query.grade+"')";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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


// Fetching fees splitup
app.post('/fetchfeesplitup',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM fee_splitup WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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


// Fetching fees splitup
app.post('/fetchnoofinstallment',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM installment_master im join installment_percentage ip on(im.feetype_code=ip.feetype_code) WHERE im.school_id='"+req.query.schoolid+"'";
    console.log(qur);
    connection.query(qur,
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
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



// Fetching fees splitup
app.post('/insertcashfees',  urlencodedParser,function (req, res){
    var qur="INSERT INTO tr_student_fees SET ?";
    console.log(qur);

    var response={
       school_id:req.query.schoolid,
       academic_year:req.query.academicyear,

        enquiry_no:req.query.enquiryno,
        admission_no:req.query.admissionno,

        student_name:req.query.studentname,
        grade:req.query.garde,
        fee_type:req.query.feetype,
        fee_code:req.query.feecode,
        installment_type:req.query.installmenttype,
        installment:req.query.installment,
        installment_date:req.query.installmentdate,
        installment_amount:req.query.installmentamount,
        waiveoff_amount:req.query.waiveoffamount,
        mode_of_payment:req.query.modeofpayment,
        receipt_date:req.query.receiptdate,
        paid_date:req.query.paiddate,
        paid_status:req.query.paidstatus,
        created_by:req.query.createdby

    };
    connection.query(qur,[response],
    function(err, rows)
    {
    if(!err)
    {

      res.status(200).json({'returnval': 'Fee paid!'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Fee not paid'});
    }
});
});

// Fetching fees splitup
app.post('/insertchequefees',  urlencodedParser,function (req, res){
    var qur="INSERT INTO tr_cheque_details SET ?";
    console.log(qur);

    var response={
       school_id:req.query.schoolid,
       academic_year:req.query.academicyear,

        enquiry_no:req.query.enquiryno,
        admission_no:req.query.admissionno,

        student_name:req.query.studentname,
        grade:req.query.garde,
        fee_type:req.query.feetype,
        fee_code:req.query.feecode,
        installment_type:req.query.installmenttype,
        installment:req.query.installment,
        installment_date:req.query.installmentdate,
        installment_amount:req.query.installmentamount,
        waiveoff_amount:req.query.waiveoffamount,

        mode_of_payment:req.query.modeofpayment,
        received_date:req.query.receiveddate,
        // paid_date:req.query.paiddate,
        cheque_status:req.query.paidstatus,
        created_by:req.query.createdby,

        cheque_no:req.query.chequeno,
        bank_name:req.query.bankname,
        cheque_date:req.query.chequedate
    };
    connection.query(qur,[response],
    function(err, rows)
    {
    if(!err)

    {


      res.status(200).json({'returnval': 'Fee paid!'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Fee not paid'});
    }
});
});

// Fetching fees splitup
app.post('/inserttransferfees',  urlencodedParser,function (req, res){
    var qur="INSERT INTO tr_transfer_details SET ?";
    console.log(qur);

    var response={
       school_id:req.query.schoolid,
       academic_year:req.query.academicyear,
        // obj.enquiryno=schoolid;
        admission_no:req.query.admissionno,
        student_name:req.query.studentname,
        grade:req.query.garde,
        fee_type:req.query.feetype,
        fee_code:req.query.feecode,
        installment_type:req.query.installmenttype,
        installment:req.query.installment,
        installment_date:req.query.installmentdate,
        installment_amount:req.query.installmentamount,
        waiveoff_amount:req.query.waiveoffamount,

        mode_of_payment:req.query.modeofpayment,
        received_date:req.query.receiveddate,

        paid_date:req.query.paiddate,
        // paid_status:req.query.paidstatus,
        created_by:req.query.createdby,
        reference_no:req.query.referenceno,
        bank_name:req.query.bankname

    };
    connection.query(qur,[response],
    function(err, rows)
    {
    if(!err)
    {

      res.status(200).json({'returnval': 'Fee paid!'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Fee not paid'});
    }
});
});




/*this ajax is used to take the sequence number from the table for prospectus number*/
app.post('/getprospectno',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    //console.log('qur');
    connection.query('SELECT prospectus_no FROM sequence WHERE ?',[qur],
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
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

/*the below function is used to update the prospectus sequence number in the table*/
app.post('/updateprospectno',  urlencodedParser,function (req, res)
{
  var school={"school_id":req.query.schol};
  var enquiry={"prospectus_no":req.query.id};
       connection.query('update sequence set ? where ?',[enquiry,school],
        function(err, rows)
        {
    if(!err)
    {
      console.log('updated');
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });


/*this function is to get the count of enquiry takes placed by grade wise*/
app.post('/getenquirycount',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    var state={"status":req.query.status};
    //console.log('qur');
    connection.query('SELECT *,class,count(*) as total FROM `student_enquiry_details` WHERE ? and ? group by (class)',[qur,state],
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
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

/*this function takes the detail of student who have been enquired and from gradewise list */
app.post('/getlistdetails',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    var state={"status":req.query.status};
    var classes={"class":req.query.grade};
    //console.log('qur');
    connection.query('SELECT * FROM `student_enquiry_details` WHERE ? and ? and ?',[qur,state,classes],
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
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


/*this function insert the followup information in followup table*/
app.post('/updatefollow',  urlencodedParser,function (req, res)
{
  var collection={"school_id":req.query.schol,"id":req.query.id,"enquiry_id":req.query.enquiryno,"schedule_no":req.query.schedule,"created_by":req.query.createdby,"created_on":req.query.createdon};
       connection.query('insert into followup set ? ',[collection],
        function(err, rows)
        {
    if(!err)
    {
      //console.log('inserted');
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });

/*this below function is used to insert data in the follow up detail table */
app.post('/updatefollowdetail',  urlencodedParser,function (req, res)
{
   var collection={"school_id":req.query.schol,"followup_id":req.query.id,"enquiry_id":req.query.enquiryid,"followup_1":req.query.folowup1,"followup_2":req.query.folowup2,"followup_3":req.query.folowup3,"followup_4":req.query.folowup4,"followup_5":req.query.folowup5,"followup_flag":req.query.flag,"next_followup_date":req.query.nextfolowup,"schedule":req.query.schedule,"followup_status":req.query.status};
       connection.query('insert into followupdetail set ? ',[collection],
        function(err, rows)
        {
    if(!err)
    {
      //console.log('inserted');
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });

/*this function is used to get the referrer name from parent table*/
app.post('/getparentname',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    //console.log('qur');
    connection.query('SELECT parent_name FROM `parent` WHERE ?',[qur],
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
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


/*this function is used to get the referrer name from student detail table*/

app.post('/getstudentnamelist',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    console.log('qur');
    connection.query('SELECT student_name FROM `student_details` WHERE ?',[qur],
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': ''});
    }
  } else {
     console.log(err);
  }
});
  });


/*this function is used to fetch the detail of students, who have been enrolled for the enquiry*/


app.post('/getfollowupcount',  urlencodedParser,function (req, res){

    //console.log('qur');
    connection.query("SELECT d.followup_status, f.class, COUNT( * ) AS total FROM  `followupdetail` AS d, student_enquiry_details AS f WHERE d.`school_id` =  '"+req.query.schol+"' AND d.followup_status =  '"+req.query.status+"' AND f.enquiry_no = d.enquiry_id GROUP BY class ORDER BY (`class`)",
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
      res.status(200).json({'returnval': rows});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 0});
    }
  }
  else{
     console.log(err);
  }
});
});


 app.post('/followup1',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var collection = {"followup1_remarks":req.query.comments,"confidence_level_1":req.query.confidencelevel,"followup_1":req.query.followupdate1};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ?',[collection,enquiry,school],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });
 app.post('/followup2',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var collection = {"followup2_remarks":req.query.comments,"confidence_level_2":req.query.confidencelevel,"followup_2":req.query.followupdate2};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ?',[collection,enquiry,school],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });

 app.post('/followup3',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var collection = {"followup3_remarks":req.query.comments,"confidence_level_3":req.query.confidencelevel,"followup_3":req.query.followupdate3};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ?',[collection,enquiry,school],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });

 app.post('/followup4',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var collection = {"followup4_remarks":req.query.comments,"confidence_level_4":req.query.confidencelevel,"followup_4":req.query.followupdate4};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ?',[collection,enquiry,school],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });

 app.post('/followup5',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var collection = {"followup5_remarks":req.query.comments,"confidence_level_5":req.query.confidencelevel,"followup_5":req.query.followupdate5};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ?',[collection,enquiry,school],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });


 app.post('/followup1',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var collection = {"followup1_remarks":req.query.comments,"confidence_level_1":req.query.confidencelevel,"followup_1":req.query.followupdate1};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ?',[collection,enquiry,school],
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });
 app.post('/getfollowupstudents',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var grade={"class":req.query.grade};
   var status={"status":req.query.status};
   var qur = "SELECT DISTINCT f.enquiry_id,f.followup_flag,s.enquiry_name FROM followupdetail f join student_enquiry_details s on f.enquiry_id=s.enquiry_no WHERE f.followup_status='"+req.query.status+"' and s.class='"+req.query.grade+"' and s.school_id = '"+req.query.schol+"'";
   connection.query(qur,
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': rows});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });
 app.post('/viewdetail',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var id={"enquiry_no":req.query.id};
   var qur = "SELECT s.enquiry_no, s.enquiry_name, s.class, s.created_on, s.father_name, s.father_mob, f.followup_1, f.followup1_remarks, f.confidence_level_1, f.followup_2, f.followup2_remarks, f.confidence_level_2, f.followup_3, f.followup3_remarks, f.confidence_level_3, f.followup_4, f.followup4_remarks, f.confidence_level_4, f.followup_5, f.followup5_remarks, f.confidence_level_5 FROM student_enquiry_details s JOIN followupdetail f on s.enquiry_no=f.enquiry_id WHERE f.enquiry_id='"+req.query.id+"' and f.school_id='"+req.query.schol+"'"
   connection.query(qur,
     function(err, rows)
     {
       if(!err)
       {
         console.log('inserted');
         res.status(200).json({'returnval': rows});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }

     });
 });

/*this function is to get the count of admission takes placed by grade wise*/
app.post('/getadmissioncount',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    var state={"status":req.query.status};
    //console.log('qur');
    connection.query('SELECT *,class,count(*) as total FROM `student_enquiry_details` WHERE ? and ? group by (class)',[qur,state],
    function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      //console.log(rows);
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
 app.post('/submitstatus',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.id};
   var status = {"followup_status":req.query.status};
   console.log(status);
   console.log(school);
   console.log(enquiry);
   connection.query('update followupdetail set ? where ? and ?',[status,enquiry,school],
     function(err, rows)
     {
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
