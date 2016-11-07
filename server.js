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

app.post('/fetchacademicyear-service',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    connection.query('SELECT * FROM md_academic_year',
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

app.post('/fetchadmissionyear-service',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    connection.query('SELECT * FROM md_admission_year',
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


app.post('/fetchfeetype-service',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    connection.query('SELECT * FROM md_fee_type',
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


app.post('/fetchdiscounttype-service',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    connection.query('SELECT * FROM md_discount_type',
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
      res.status(200).json({'returnval': 'no type'});
    }
    }
    else{
     console.log(err);
    }
    });
});

app.post('/fetchfeecomponenttype-service',  urlencodedParser,function (req, res){
    var qur={"school_id":req.query.schol};
    connection.query('SELECT * FROM md_fee_component',
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
      res.status(200).json({'returnval': 'no type'});
    }
    }
    else{
     console.log(err);
    }
    });
});


app.post('/fetchfeecomponentinfo-service',  urlencodedParser,function (req, res){

var feequr="SELECT * FROM fee_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade_id='"+req.query.grade+"'";

var discountqur="SELECT * FROM md_discount_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade_id='"+req.query.grade+"'";

var feeres={
"feecode":"",
"discountcode":""
};

connection.query(feequr,function(err, rows){
if(rows.length>0){
feeres.feecode=rows[0].fee_code;
if(req.query.discountstatus=="Yes")
{
  connection.query(discountqur,function(err, rows){
    if(rows.length>0){
      feeres.discountcode=rows[0].discount_code;
    }
  });
}
else{

}
}
else
res.status(200).json({'returnval': 'Fee Code Not Available!!'});
});
});



app.post('/generatefeecode-service',  urlencodedParser,function (req, res){
    var schoolid=req.query.schoolid;
    var prefixid=req.query.prefixid;
    var response={"prefixname":""};
    var qur="SELECT * FROM fee_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade_id='"+req.query.grade+"'";
    connection.query(qur,function(err, rows){
    if(rows.length==0){
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
          console.log(err);
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
  }
  else
  {
    res.status(200).json({'returnval': rows[0].fee_code});
    // connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
    //     if(rows.length>0){
    //       var feecode=response.prefixname+rows[0].fee_sequence;
    //       res.status(200).json({'returnval': feecode});
    //     }
    // });
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
      fee_name:req.query.feename,
      fees:req.query.totalfees,
      created_by:req.query.createdby
    };

    var splitup={
      school_id:req.query.schoolid,
      fee_code:req.query.feecode,
      fee_type:req.query.feetype,
      fee_type_code:req.query.feetype,
      total_fee:req.query.totalfees,
      created_by:req.query.createdby
    };
    var splitcheck="SELECT * FROM fee_splitup WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"' and fee_type='"+req.query.feetype+"'";
    var feemastercheck="SELECT * FROM fee_master WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"'";

    connection.query(splitcheck,function(err, rows){
    if(rows.length==0){
    connection.query('INSERT INTO fee_splitup SET ?',[splitup],function(err, rows){
      connection.query(feemastercheck,function(err, rows){
        if(rows.length==0){
          connection.query('INSERT INTO fee_master SET ?',[response],function(err, rows){
            res.status(200).json({'returnval': 'created'});
          });
        }
        else{
            var fees = rows[0].fees;
            var newfees=parseInt(fees)+parseInt(req.query.totalfees);
            connection.query("UPDATE fee_master SET fees='"+newfees+"' WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"'",function(err, result){
            if(result.affectedRows==1)
            res.status(200).json({'returnval': 'updated'});
            else
            res.status(200).json({'returnval': 'not updated'});
            });
        }
      });
    });
    }
    else{
      var fee=rows[0].total_fee;
      // if(parseInt(fee)>=parseInt(req.query.totalfees))
      // var diff_fee=parseInt(fee)-parseInt(req.query.totalfees);
      // else
      var diff_fee=parseInt(req.query.totalfees)-parseInt(fee);
      connection.query("UPDATE fee_splitup SET total_fee='"+req.query.totalfees+"' WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"' and fee_type='"+req.query.feetype+"'",function(err, result){
        if(result.affectedRows==1){
      connection.query(feemastercheck,function(err, rows){
        if(rows.length==0){
          connection.query('INSERT INTO fee_master SET ?',[response],function(err, rows){
            res.status(200).json({'returnval': 'created'});
          });
        }
        else{
            var fees = rows[0].fees;
            console.log('.....................................');
            console.log(fees);
            console.log('.....................................');
            console.log(diff_fee);
            // if(parseInt(diff_fee)>0)
            var newfees=parseInt(fees)+parseInt(diff_fee);
            // else
            // var newfees=parseInt(fees)-parseInt(diff_fee);
            console.log('.....................................');
            console.log(newfees);
            connection.query("UPDATE fee_master SET fees='"+newfees+"' WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"'",function(err, result){
            if(result.affectedRows==1)
            res.status(200).json({'returnval': 'updated'});
            else
            res.status(200).json({'returnval': 'not updated'});
            });
        }
      });
        }
      });
    }
    });

});


app.post('/generatediscountcode-service',  urlencodedParser,function (req, res){
    var schoolid=req.query.schoolid;
    var prefixid=req.query.prefixid;
    var response={"prefixname":""};
    var qur="SELECT * FROM md_discount_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade='"+req.query.grade+"' ";
    console.log(qur);
    connection.query(qur,function(err, rows){
    if(rows.length==0){
    connection.query("SELECT * FROM prefix_master WHERE prefix_id='"+prefixid+"'",function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      response.prefixname=rows[0].prefix_name;
      connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
        if(rows.length>0){
          var discountcode=response.prefixname+rows[0].discount_sequence;
          var new_seq=parseInt(rows[0].discount_sequence)+1;
          connection.query("UPDATE fee_code_sequence SET discount_sequence='"+new_seq+"' WHERE school_id='"+schoolid+"'",function(err, rows){
          if(!err)
          res.status(200).json({'returnval': discountcode});
          });
        }
        else{
          console.log(err);
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
  }
  else
  {
    res.status(200).json({'returnval': rows[0].discount_code});
    // connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
    //     if(rows.length>0){
    //       var feecode=response.prefixname+rows[0].fee_sequence;
    //       res.status(200).json({'returnval': feecode});
    //     }
    // });
  }
  });
});


app.post('/creatediscountcode-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade,
      discount_code:req.query.discountcode,
      fee_type:req.query.feetype,
      discount_type:req.query.discounttype,
      from_date:req.query.fromdate,
      to_date:req.query.todate,
      created_by:req.query.createdby,
      amount:req.query.amount
    };

    console.log(response);

    var qur="SELECT * FROM md_discount_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade='"+req.query.grade+"' and discount_type='"+req.query.discounttype+"' "+
    " and fee_type='"+req.query.feetype+"' and from_date='"+req.query.fromdate+"' and to_date='"+req.query.todate+"'";

    var updatequr="UPDATE md_discount_master SET amount='"+req.query.amount+"' WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade='"+req.query.grade+"' and discount_type='"+req.query.discounttype+"' "+
    " and fee_type='"+req.query.feetype+"' and from_date='"+req.query.fromdate+"' and to_date='"+req.query.todate+"'";

    connection.query(qur,function(err, rows){
      if(!err){
    if(rows.length==0){
    connection.query('INSERT INTO md_discount_master SET ?',[response],function(err, rows){
      if(!err)
     res.status(200).json({'returnval': 'created'});
    else{
      console.log(err);
      res.status(200).json({'returnval': 'not created'});
    }
    });
    }
    else{
    connection.query(updatequr,function(err, result){
     if(result.affectedRows>0)
     res.status(200).json({'returnval': 'updated'});
    else{
      console.log(err);
      res.status(200).json({'returnval': 'not updated'});
    }
    });
    }
  }
  else
    console.log(err);
    });

});



app.post('/generateinstallmentcode-service',  urlencodedParser,function (req, res){
    var schoolid=req.query.schoolid;
    var prefixid=req.query.prefixid;
    var response={"prefixname":""};
    var qur="SELECT * FROM installment_schedule_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade='"+req.query.grade+"' ";
    connection.query(qur,function(err, rows){
    if(rows.length==0){
    connection.query("SELECT * FROM prefix_master WHERE prefix_id='"+prefixid+"'",function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      response.prefixname=rows[0].prefix_name;
      connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
        if(rows.length>0){
          var installmentcode=response.prefixname+rows[0].installment_seq;
          var new_seq=parseInt(rows[0].installment_seq)+1;
          connection.query("UPDATE fee_code_sequence SET installment_seq='"+new_seq+"' WHERE school_id='"+schoolid+"'",function(err, rows){
          if(!err)
          res.status(200).json({'returnval': installmentcode});
          });
        }
        else{
          console.log(err);
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
  }
  else
  {
    res.status(200).json({'returnval': rows[0].installment_code});
    // connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
    //     if(rows.length>0){
    //       var feecode=response.prefixname+rows[0].fee_sequence;
    //       res.status(200).json({'returnval': feecode});
    //     }
    // });
  }
  });
});


app.post('/createinstallment-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade,
      insschedule_code:req.query.installmentcode,
      no_of_installment:req.query.noofinstallment,
      installment:req.query.installment,
      installment_type:req.query.installmenttype,
      total_amount:req.query.actualamount,
      discount:req.query.discount,
      payable_amount:req.query.payableamount,
      installment_date:req.query.installmentdate,
      created_by:req.query.createdby
    };

    // console.log(response);/

    connection.query('INSERT INTO installment_schedule_master SET ?',[response],function(err, rows){
      if(!err)
      res.status(200).json({'returnval': 'created'});
      else{
      console.log(err);
      res.status(200).json({'returnval': 'not created'});
    }
    });

});


app.post('/createinstallmentsplitup-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade,
      no_of_installment:req.query.noofinstallment,
      installment_code:req.query.installmentcode,
      installment:req.query.installment,
      installment_type:req.query.installmenttype,
      fee_type:req.query.feetype,
      total_amount:req.query.actualamount,
      discount:req.query.discount,
      payable_amount:req.query.payableamount,
      // installment_date:req.query.installmentdate,
      created_by:req.query.createdby
    };

    connection.query('INSERT INTO installment_splitup SET ?',[response],function(err, rows){
      if(!err)
      res.status(200).json({'returnval': 'created'});
      else{
      console.log(err);
      res.status(200).json({'returnval': 'not created'});
    }
    });

});


app.post('/fetchinstallmentpattern-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade
    };
    var qur="SELECT * FROM installmenttype_master WHERE school_id='"+req.query.schoolid+"' AND academic_year='"+req.query.academicyear+"' AND admission_year='"+req.query.admissionyear+"'";
    connection.query(qur,function(err, rows){
      if(!err)
      res.status(200).json({'returnval': rows});
      else{
      console.log(err);
      res.status(200).json({'returnval': 'no rows'});
    }
    });
});


app.post('/fetchinstallmentfeecode-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade,
      fee_type:req.query.feetype
    };
    var qur="SELECT * FROM fee_master WHERE school_id='"+req.query.schoolid+"' AND academic_year='"+req.query.academicyear+"' AND admission_year='"+req.query.admissionyear+"'";
    // var qur1="SELECT * FROM fee_splitup WHERE fee_code='"++"'";
    connection.query(qur,function(err, rows){
      if(rows.length>0){
      connection.query("SELECT * FROM fee_splitup WHERE fee_code='"+rows[0].fee_code+"' and fee_type='"+req.query.feetype+"'",function(err, rows){
      if(!err)
      res.status(200).json({'returnval': rows});
      else{
      console.log(err);
      res.status(200).json({'returnval': '0'});
      }
    });
    }
    });
});


app.post('/fetchinstallmentdiscountcode-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade,
      fee_type:req.query.feetype
    };
    var qur="SELECT * FROM md_discount_master WHERE school_id='"+req.query.schoolid+"' AND academic_year='"+req.query.academicyear+"' AND admission_year='"+req.query.admissionyear+"' AND fee_type='"+req.query.feetype+"'";
    connection.query(qur,function(err, rows){
      if(!err)
      res.status(200).json({'returnval': rows});
      else{
      console.log(err);
      res.status(200).json({'returnval': '0'});
    }
    });
});


app.post('/generateinstallmentschedulecode-service',  urlencodedParser,function (req, res){
    var schoolid=req.query.schoolid;
    var prefixid=req.query.prefixid;
    var response={"prefixname":""};
    var qur="SELECT * FROM installment_schedule_master WHERE school_id='"+req.query.schoolid+"' and academic_year='"+req.query.academicyear+"' "+
    " and admission_year='"+req.query.admissionyear+"' and grade='"+req.query.grade+"' ";
    connection.query(qur,function(err, rows){
    if(rows.length==0){
    connection.query("SELECT * FROM prefix_master WHERE prefix_id='"+prefixid+"'",function(err, rows)
    {
    if(!err)
    {
    if(rows.length>0)
    {
      response.prefixname=rows[0].prefix_name;
      connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
        if(rows.length>0){
          var insschedulecode=response.prefixname+rows[0].insschedule_code;
          var new_seq=parseInt(rows[0].insschedule_code)+1;
          connection.query("UPDATE fee_code_sequence SET insschedule_code='"+new_seq+"' WHERE school_id='"+schoolid+"'",function(err, rows){
          if(!err)
          res.status(200).json({'returnval': insschedulecode});
          });
        }
        else{
          console.log(err);
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
  }
  else
  {
    res.status(200).json({'returnval': rows[0].installment_code});
    // connection.query("SELECT * FROM fee_code_sequence WHERE school_id='"+schoolid+"'",function(err, rows){
    //     if(rows.length>0){
    //       var feecode=response.prefixname+rows[0].fee_sequence;
    //       res.status(200).json({'returnval': feecode});
    //     }
    // });
  }
  });
});


app.post('/createinstallmentschedule-service',  urlencodedParser,function (req, res){
    var response={
      school_id:req.query.schoolid,
      academic_year:req.query.academicyear,
      admission_year:req.query.admissionyear,
      grade:req.query.grade,
      installment_code:req.query.installmentcode,
      fee_code:req.query.feecode,
      discount_code:req.query.discountcode,
      installment:req.query.installment,
      installment_type:req.query.installmenttype,
      fee_type:req.query.feetype,
      total_amount:req.query.totalamount,
      discount:req.query.discount,
      payable_amount:req.query.payableamount,
      installment_date:req.query.installmentdate,
      insschedule_code:req.query.insschedulecode,
      created_by:req.query.createdby
    };

    connection.query('INSERT INTO installment_schedule_master SET ?',[response],function(err, rows){
      if(!err)
      res.status(200).json({'returnval': 'created'});
      else{
      console.log(err);
      res.status(200).json({'returnval': 'not created'});
    }
    });

});



/*This function is used to submit the simple enquiry details of the student for the first time*/
app.post('/submitenquiry',  urlencodedParser,function (req, res)
{
  var collection={"enquiry_no":req.query.id,"school_id":req.query.schol,"academic_year":req.query.acadeyr,
  "class":req.query.grade,"father_mob":req.query.contact,"gender":req.query.gender,
  "first_name":req.query.firstname,"middle_name":req.query.middlename,"last_name":req.query.lastname,
  "dob":req.query.dobs,"father_name":req.query.father,"locality":req.query.location,"mother_name":req.query.mother,
  "father_email":req.query.email,"created_by":req.query.createdby,"created_on":req.query.createdate,
  "enquiry_name":req.query.givenname,"gemail":req.query.gemail,"gmob":req.query.gmob,"parent_or_guardian":req.query.paga,"Guardianname":req.query.Guardianname,"status":"Enquired","rte_student":req.query.rtestudent,"year_type":req.query.adtype};
       console.log(collection);
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
   var collection={"first_name":req.query.firstname,"middle_name":req.query.middlename,"last_name":req.query.lastname,"gender":req.query.gender,"class":req.query.grade,"dob":req.query.dob,"old_class":req.query.oldclass,"old_school":req.query.oldschool,"mother_tongue":req.query.mothertongue,"father_name":req.query.fathername,"mother_name":req.query.mothername,"father_qualification":req.query.fatheredu,"mother_qualification":req.query.motheredu,"father_mob":req.query.fathermob,"mother_mob":req.query.mothermob,"father_email":req.query.fathermail,"mother_email":req.query.mothermail,"father_company":req.query.fathercompany,"mother_company":req.query.mothercompany,"father_occupation":req.query.fatherjob,"mother_occupation":req.query.motherjobfn,"flat_no":req.query.flatno,"address1":req.query.address1,"address2":req.query.address2,"address3":req.query.address3,"city":req.query.city,"pincode":req.query.pincode,"state":req.query.statename,"enquiry_source":req.query.enquiysource,"sibiling_name":req.query.siblingname,"sibling_detail":req.query.siblingdetails,"transport_requirment":req.query.transportreq,"canteen_requirment":req.query.canteenreq,"second_language":req.query.secondlanguage,"third_language":req.query.thirdlanguage,"updated_by":req.query.modified,"prospectus_sold":req.query.prospectstatus,"father_designation":req.query.daddesignation,"mother_designation":req.query.momdesignation,"father_income":req.query.dadincome,"mother_income":req.query.momincome,"prospectus_no":req.query.prospectusno,"admission_test":req.query.admissiontest1,"admission_date":req.query.admissiondate1,'admission_test_english':req.query.admissiontestenglish1,"admission_test_maths":req.query.admissiontestmaths,"admission_test_evs":req.query.admissiontestevs1,"Guardianname":req.query.guardianname1,"gmob":req.query.guardianmobile1,"gemail":req.query.guardianemail1,"guardian_company":req.query.guardiancompany1,"guardian_job":req.query.guardianjob1,"guardian_occup":req.query.guardianoccup1,"guardian_income":req.query.guardianincome1,"locality":req.query.location1,"mother_occupation_other":req.query.motherother,"father_occupation_other":req.query.motherother1,"guardian_occupation_other":req.query.guardianother1,"country_name":req.query.country_name1};


    var school={"school_id":req.query.schol};
    var enquiry={"enquiry_no":req.query.enq};

  console.log(req.query.momincome+" "+req.query.enq+" "+req.query.schol);
  console.log(collection);
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
   var collection={"school_id":req.query.schol,"enquiry_no":req.query.enq,"first_name":req.query.firstname,"middle_name":req.query.middlename,"last_name":req.query.lastname,"gender":req.query.gender,"class":req.query.grade,"dob":req.query.dob,"old_class":req.query.oldclass,"old_school":req.query.oldschool,"mother_tongue":req.query.mothertongue,"father_name":req.query.fathername,"mother_name":req.query.mothername,"father_qualification":req.query.fatheredu,"mother_qualification":req.query.motheredu,"father_mob":req.query.fathermob,"mother_mob":req.query.mothermob,"father_email":req.query.fathermail,"mother_email":req.query.mothermail,"father_company":req.query.fathercompany,"mother_company":req.query.mothercompany,"father_occupation":req.query.fatherjob,"mother_occupation":req.query.motherjobfn,"flat_no":req.query.flatno,"address1":req.query.address1,"address2":req.query.address2,"address3":req.query.address3,"city":req.query.city,"pincode":req.query.pincode,"state":req.query.statename,"enquiry_source":req.query.enquiysource,"sibiling_name":req.query.siblingname,"sibling_detail":req.query.siblingdetails,"transport_requirment":req.query.transportreq,"canteen_requirment":req.query.canteenreq,"second_language":req.query.secondlanguage,"third_language":req.query.thirdlanguage,"updated_by":req.query.modified,"prospectus_sold":req.query.prospectstatus,"father_designation":req.query.daddesignation,"mother_designation":req.query.momdesignation,"father_income":req.query.dadincome,"mother_income":req.query.momincome,"prospectus_no":req.query.prospectusno,"academic_year":req.query.academicyear,"enquiry_name":req.query.givenname,"status":req.query.status,"admission_test":req.query.admissiontest,"admission_date":req.query.admissiondate,'admission_test_english':req.query.admissiontestenglish,"admission_test_maths":req.query.admissiontestmaths,"admission_test_evs":req.query.admissiontestevs,"Guardianname":req.query.guardianname,"gmob":req.query.guardianmobile,"gemail":req.query.guardianemail,"guardian_company":req.query.guardiancompany,"guardian_job":req.query.guardianjob,"guardian_occup":req.query.guardianoccup,"guardian_income":req.query.guardianincome,"locality":req.query.location,"mother_occupation_other":req.query.motherother,"father_occupation_other":req.query.fatherother,"year_type":req.query.enrolltype,"country_name":req.query.country_name};
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

app.post('/updateenquirynum',  urlencodedParser,function (req, res)
{

  var school={"school_id":req.query.schol};
  var enquiry={"enquiry_no":req.query.id};

       connection.query('update sequence set ? where ? and ?',[enquiry,school],
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
app.post('/getenqirydetails',  urlencodedParser,function (req, res){
  var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schol+"' and enquiry_no like '%"+req.query.enqno+"%' or enquiry_name like '%"+req.query.enqno+"%'";
  connection.query(qur,

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

       connection.query("SELECT * from student_enquiry_details where school_id='"+req.query.schol+"' and (father_mob='"+req.query.mobileno+"' or mother_mob='"+req.query.mobileno+"' or gmob='"+req.query.mobileno+"') ",
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

    var checkqur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and (enquiry_no like '%"+req.query.enquiryno+"%' or enquiry_name like '%"+req.query.enquiryno+"%') and status='Admitted'";
    console.log(qur);
    console.log(checkqur);
    connection.query(qur,function(err, rows){
      if(rows.length==0){
    connection.query(checkqur,function(err, rows)
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
      res.status(200).json({'returnval': 'no enquiry'});
    }
     console.log(err);
    }
    });
      }
    else
    {
      res.status(200).json({'returnval': rows});
    }
    });
    // connection.query(checkqur,function(err, rows){
    //   if(rows.length==0){
    // connection.query(qur,function(err, rows)
    // {
    // if(!err)
    // {
    // if(rows.length>0)
    // {
    //   res.status(200).json({'returnval': rows});
    // }
    // else
    // {
    //   console.log(err);
    //   res.status(200).json({'returnval': 'no enquiry'});
    // }
    // }
    // else{
    //  console.log(err);
    // }
    // });
    //   }
    // else
    // {
    //   res.status(200).json({'returnval': 'exist'});
    // }
    // });
});


// Searching admission no of existing admission
app.post('/searchexistingadmission',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_admission WHERE school_id='"+req.query.schoolid+"' and admission_no like '%"+req.query.admissionno+"%' or student_name like '%"+req.query.admissionno+"%' or enquiry_no like '%"+req.query.admissionno+"%'";
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
      res.status(200).json({'returnval': 'no enquiry'});
    }
  }
  else{
     console.log(err);
  }
});
});


// Fetching enquiry no for admission
app.post('/fetchenquiryinfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.enquiryno+"' and status='Enquired' and admission_status='Pass'";
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
      res.status(200).json({'returnval': 'no rows'});
    }
  }
  else{
     console.log(err);
  }
});
});


// Fetching admission info
app.post('/fetchexistingadmissioninfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_admission WHERE school_id='"+req.query.schoolid+"' and (admission_no = '"+req.query.admissionno+"' or enquiry_no='"+req.query.admissionno+"')";
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
      res.status(200).json({'returnval': 'no rows'});
    }
  }
  else{
     console.log(err);
  }
});
});

// Fetching admission stud info
app.post('/fetchexistingadmissionstudinfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_student WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.admissionno+"'";
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
      res.status(200).json({'returnval': 'no rows'});
    }
  }
  else{
     console.log(err);
  }
});
});

// Fetching admission acheivement info
app.post('/fetchexistingadmissioncoinfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_student_cocurricular_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.admissionno+"'";
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
      res.status(200).json({'returnval': 'no rows'});
    }
  }
  else{
     console.log(err);
  }
});
});

// Fetching admission stud info
app.post('/fetchexistingadmissionphysicinfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_disability_student_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.admissionno+"'";
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
      res.status(200).json({'returnval': 'no rows'});
    }
  }
  else{
     console.log(err);
  }
});
});

// Fetching admission stud school history info
app.post('/fetchexistingadmissionhistoryinfo',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM md_student_school_history WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.admissionno+"'";
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
      res.status(200).json({'returnval': 'no rows'});
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
        academic_year:req.query.academicyear,
        first_name:req.query.firstname,
        middle_name:req.query.middlename,
        last_name:req.query.lastname,
        student_name:req.query.studentname,
        class_for_admission:req.query.gradeselection,
        dob:req.query.admissiondob,
        gender:req.query.admissiongender,
        disabled_student:req.query.admissiondisabled,
        academic_acheivement:req.query.acheivehandler,
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
      connection.query("SELECT * FROM md_admission WHERE enquiry_no='"+req.query.enquiryno+"'",function(err, rows){
        if(rows.length==0){
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
    else{
      connection.query("UPDATE md_admission SET ? WHERE enquiry_no='"+req.query.enquiryno+"'",[response],function(err, result){
        if(result.affectedRows>0)
        res.status(200).json({'returnval': 'Updated!'});
        else
        res.status(200).json({'returnval': 'Not Updated!'});
      });
    }
    });
    }
    else
      res.status(200).json({'returnval': 'noadmissionno'});
  }
  });
});

app.post('/studentphysical_service',  urlencodedParser,function (req, res){
   var event = {

     "enquiry_no":req.query.enquiryno,
     "prospect_application_no":req.query.applicationno,
     "school_id":req.query.schoolid,
     "academic_year":req.query.academicyear,
     "first_name":req.query.firstname,
     "middle_name":req.query.middlename,
     "last_name":req.query.lastname,
     "student_name":req.query.studentname,
     "class_for_admission":req.query.gradeselection,
     "created_by":req.query.createdby,
     "physic_detail":req.query.physicdetail,
     "physic_status":req.query.physicstatus,
     "mental_detail":req.query.mentaldetail,
     "mental_status":req.query.mentalstatus,
     "illness_detail":req.query.illnessdetail,
     "illness_status":req.query.illnessstatus,
     "allergy_detail":req.query.allergydetail,
     "allergy_status":req.query.allergystatus,
     "chronic_detail":req.query.chronicdetail,
     "chronic_status":req.query.chronicstatus
   };
   connection.query("SELECT * FROM md_disability_student_details WHERE enquiry_no='"+req.query.enquiryno+"'",function(err, rows){
    if(rows.length==0){
   connection.query('insert into md_disability_student_details set ?',[event],
     function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'Inserted!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Inserted!'});
       }
     });
   }
   else{
    connection.query("UPDATE md_disability_student_details set ? WHERE enquiry_no='"+req.query.enquiryno+"'",[event],
     function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'Updated!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Updated!'});
       }
     });
   }
  });
 });


app.post('/studentfulldetails_service',  urlencodedParser,function (req, res){
   var event = {
   "enquiry_no":req.query.enquiryno,
   "prospect_application_no":req.query.applicationno,
   "school_id":req.query.schoolid,
   "academic_year":req.query.academicyear,
   "first_name":req.query.firstname,
   "middle_name":req.query.middlename,
   "last_name":req.query.lastname,
   "student_name":req.query.studentname,
   "class_for_admission":req.query.gradeselection,
   "dob":req.query.admissiondob,
   "gender":req.query.admissiongender,
   "age":req.query.age,
   "second_language":req.query.secondlanguage,
   "third_language":req.query.thirdlanguage,
   "created_by":req.query.createdby,
   "flat_no":req.query.flatno,
   "building_name":req.query.bulidingname,
   "street":req.query.street,
   "town":req.query.town,
   "city":req.query.city,
   "state":req.query.state,
   "pincode":req.query.pincode,
   "height":req.query.height,
   "weight":req.query.weight,
   "nationality":req.query.nationality,
   "mother_toungue":req.query.mothertongue,
   "sibling_name":req.query.siblingname,
   "sibling_class":req.query.siblingclass,
   "father_name":req.query.fathername,
   "mother_name":req.query.mothername,
   "father_dob":req.query.fatherdob,
   "mother_dob":req.query.motherdob,
   "father_profession":req.query.fatherqualification,
   "mother_profession":req.query.motherqualification,
   "father_occupation":req.query.fatheroccupation,
   "mother_occupation":req.query.motheroccupation,
   "father_income":req.query.fatherincome,
   "mother_income":req.query.motherincome,
   "father_tel":req.query.fathertelno,
   "mother_tel":req.query.mothertelno,
   "father_mobile":req.query.fathermobile,
   "mother_mobile":req.query.mothermobile,
   "father_email":req.query.fatheremail,
   "mother_email":req.query.motheremail,
   "permanent_pflatno":req.query.pflatno,
   "permanent_pbuildingname":req.query.pbuildingname,
   "permanent_pstreet":req.query.pstreet,
   "permanent_town":req.query.ptown,
   "permanent_district":req.query.pdistrict,
   "permanent_state":req.query.pstate,
   "permanent_pincode":req.query.ppincode,
   "guardian_relationship":req.query.relationship1,
   "guardian_name":req.query.guardianname1,
   "guard_flatno":req.query.gflatno,
   "guard_building":req.query.gbuildingname,
   "guard_street":req.query.gstreet,
   "guard_town":req.query.gtown,
   "guard_city":req.query.gcity,
   "guard_state":req.query.gstate,
   "guard_pincode":req.query.gpincode,
   "guard_res_contact":req.query.gresidentialcontact,
   "guard_office_contact":req.query.gofficecontact,
   "guard_mobile_no":req.query.gmobileno,
   "guard_fax":req.query.gfax,
   "caste":req.query.caste,
   "religion":req.query.religion
 };
   connection.query("SELECT * FROM md_student WHERE enquiry_no='"+req.query.enquiryno+"'",function(err, rows){
   if(rows.length==0){
   connection.query('insert into md_student set ?',[event],function(err, rows){
       if(!err)
       {
         res.status(200).json({'returnval': 'Inserted!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Inserted!'});
       }
    });
    }
    else{
      connection.query("UPDATE md_student set ? WHERE enquiry_no='"+req.query.enquiryno+"'",[event],function(err, rows){
       if(!err)
       {
         res.status(200).json({'returnval': 'Updated!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Updated!'});
       }
       });
    }
 });
 });



app.post('/studentcocurricular_service',  urlencodedParser,function (req, res){
   var event = {
"enquiry_no":req.query.enquiryno,
"prospect_application_no":req.query.applicationno,
"school_id":req.query.schoolid,
"academic_year":req.query.admissionyear,
"first_name":req.query.firstname,
"middle_name":req.query.middlename,
"last_name":req.query.lastname,
"student_name":req.query.studentname,
"class_for_admission":req.query.gradeselection,
"created_by":req.query.createdby,
"field1":req.query.field1,
"year1":req.query.year1,
"event1":req.query.event1,
"prize1":req.query.prizedetail1,
"field2":req.query.field2,
"year2":req.query.year2,
"event2":req.query.event2,
"prize2":req.query.prizedetail2,
"field3":req.query.field3,
"year3":req.query.year3,
"event3":req.query.event3,
"prize3":req.query.prizedetail3
   };
   connection.query("SELECT * FROM md_student_cocurricular_details WHERE enquiry_no='"+req.query.enquiryno+"'",function(err, rows){
    if(rows.length==0){
   connection.query('insert into md_student_cocurricular_details set ?',[event],
     function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'Inserted!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Inserted!'});
       }
     });
      }
      else
      {
        connection.query("UPDATE md_student_cocurricular_details set ? WHERE enquiry_no='"+req.query.enquiryno+"'",[event],
     function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'Updated!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Updated!'});
       }
     });
      }
   });
 });


app.post('/studenthistory_service', urlencodedParser,function (req, res){
   var event = {
    "enquiry_no":req.query.enquiryno,
    "school_id":req.query.schoolid,
    "prospect_application_no":req.query.applicationno,
    "academic_year":req.query.admissionyear,
    "first_name":req.query.firstname,
    "middle_name":req.query.middlename,
    "last_name":req.query.lastname,
    "student_name":req.query.studentname,
    "class_for_admission":req.query.gradeselection,
    "created_by":req.query.createdby,
    "school_name":req.query.prevschoolname,
    // "prevschoolname":req.query.prevschoolname,
    "from_grade":req.query.classfrom,
    "to_grade":req.query.classto,
    "from_year":req.query.yearfrom,
    "to_year":req.query.yearto,
    "medium_of_ins":req.query.medium,
    "percentage":req.query.lastclassmark,
    "reason":req.query.reasonforleaving,
    "board":req.query.board

  };
  connection.query("SELECT * FROM md_student_school_history WHERE enquiry_no='"+req.query.enquiryno+"'",function(err, rows){
   if(rows.length==0){
   connection.query('insert into md_student_school_history set ?',[event],function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'Inserted!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Inserted!'});
       }
     });
   }
   else
   {
    connection.query("UPDATE md_student_school_history set ? WHERE enquiry_no='"+req.query.enquiryno+"'",[event],function(err, rows){

       if(!err)
       {
         res.status(200).json({'returnval': 'Updated!'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'Not Updated!'});
       }
    });
   }
 });
 });



// Fetching enquiry no for admission
app.post('/searchfeeenquiry',  urlencodedParser,function (req, res){
    var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no = '"+req.query.enquiryno+"' or first_name='"+req.query.firstname+"' and prospectus_sold='yes' and status in('Enquired','Admitted')";
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

    var qur="SELECT * FROM fee_master WHERE school_id='"+req.query.schoolid+"' and admission_year = '"+req.query.admissionyear+"' and academic_year='"+req.query.academicyear+"' and grade_id='"+req.query.grade+"'";
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
    var qur="SELECT * FROM fee_splitup WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"' and fee_type='"+req.query.feetype+"'";
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
    var qur="SELECT * FROM installment_master WHERE school_id='"+req.query.schoolid+"' and fee_code='"+req.query.feecode+"' and fee_type='"+req.query.feetype+"'";
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
        created_by:req.query.createdby,
        receipt_no:""
    };
    connection.query("SELECT * FROM receipt_sequence",function(err, rows){
    response.receipt_no="REC-"+response.academic_year+"-"+rows[0].receipt_seq;
    var new_receipt_no=parseInt(rows[0].receipt_seq)+1;
    connection.query(qur,[response],
    function(err, rows)
    {
    if(!err)
    {
      connection.query("UPDATE receipt_sequence SET receipt_seq='"+new_receipt_no+"'",function(err, result){
        if(result.affectedRows>0)
          res.status(200).json({'returnval': 'Fee paid!','info':response,'receiptno':response.receipt_no});
        else
          res.status(200).json({'returnval': 'Seq not updated!'});
      });

    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Fee not paid'});
    }
    });
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
        grade:req.query.grade,
        fee_type:req.query.feetype,
        fee_code:req.query.feecode,
        installment_type:req.query.installmenttype,
        installment:req.query.installment,
        installment_date:req.query.installmentdate,
        installment_amount:req.query.installmentamount,
        waiveoff_amount:req.query.waiveoffamount,

        mode_of_payment:req.query.modeofpayment,
        received_date:req.query.receiveddate,
        paid_status:req.query.paidstatus,
        cheque_status:req.query.chequestatus,
        created_by:req.query.createdby,

        cheque_no:req.query.chequeno,
        bank_name:req.query.bankname,
        cheque_date:req.query.chequedate,
        ack_no:""
    };
    connection.query("SELECT * FROM receipt_sequence",function(err, rows){
    response.ack_no="ACK-"+response.academic_year+"-"+rows[0].acknowledge_seq;
    var new_ack_no=parseInt(rows[0].acknowledge_seq)+1;
    connection.query(qur,[response],
    function(err, rows)
    {
    if(!err)
    {
      connection.query("UPDATE receipt_sequence SET acknowledge_seq='"+new_ack_no+"'",function(err, result){
        if(result.affectedRows>0)
          res.status(200).json({'returnval': 'Fee paid!','info':response,'receiptno':response.ack_no});
        else
          res.status(200).json({'returnval': 'Seq not updated!'});
      });
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Fee not paid'});
    }
    });
  });
});

// Fetching fees splitup
app.post('/inserttransferfees',  urlencodedParser,function (req, res){
    var qur="INSERT INTO tr_transfer_details SET ?";
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

        paid_date:req.query.paiddate,
        paid_status:req.query.paidstatus,
        reference_no:req.query.referenceno,
        bank_name:req.query.bankname,
        "receipt_no":""

    };
    connection.query("SELECT * FROM receipt_sequence",function(err, rows){
    response.receipt_no="REC-"+response.academic_year+"-"+rows[0].receipt_seq;
    var new_receipt_no=parseInt(rows[0].receipt_seq)+1;
    connection.query(qur,[response],
    function(err, rows)
    {
    if(!err)
    {
      connection.query("UPDATE receipt_sequence SET receipt_seq='"+new_receipt_no+"'",function(err, result){
        if(result.affectedRows>0)
          res.status(200).json({'returnval': 'Fee paid!','info':response,'receiptno':response.receipt_no});
        else
          res.status(200).json({'returnval': 'Seq not updated!'});
      });
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'Fee not paid'});
    }
  });
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

/*this function is to get the count of enquiry takes placed by grade wise*/
app.post('/getadmittedcount',  urlencodedParser,function (req, res){
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
    var qur={"s.school_id":req.query.schol};
    var state={"status":req.query.status};
    var classes={"class":req.query.grade};
    //console.log('qur');
    connection.query('SELECT f.current_confidence_level,f.enquiry_id,f.followup_flag,s.enquiry_name, s.enquiry_no,s.created_on FROM followupdetail f join student_enquiry_details s on f.enquiry_id=s.enquiry_no WHERE ? and ? and ?',[qur,state,classes],
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
app.post('/updatefollow',  urlencodedParser,function (req, res) {
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
   var collection={"school_id":req.query.schol,"followup_id":req.query.id,"enquiry_id":req.query.enquiryid,"followup_1":req.query.folowup1,"followup_2":req.query.folowup2,"followup_3":req.query.folowup3,"followup_4":req.query.folowup4,"followup_5":req.query.folowup5,"followup_flag":req.query.flag,"created_on":req.query.nextfolowup,"schedule":req.query.schedule,"followup_status":req.query.status};
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
    connection.query("SELECT d.followup_status, f.class, COUNT( * ) AS total FROM  `followupdetail` AS d, student_enquiry_details AS f WHERE d.`school_id` =  '"+req.query.schol+"' AND d.followup_status =  '"+req.query.status+"' AND f.enquiry_no = d.enquiry_id and f.status='Enquired' GROUP BY class ORDER BY (`class`)",
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
   var followupid={"followup_id":req.query.followupid};
   var collection = {"followup1_remarks":req.query.comments,"confidence_level_1":req.query.confidencelevel,"followup_1":req.query.followupdate1,"current_confidence_level":req.query.confidencelevel};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ? and ?',[collection,enquiry,school,followupid],
     function(err, rows){
       if(!err){
         console.log('inserted');
         res.status(200).json({'returnval': 'success'});
       } else {
         console.log(err);
         res.status(200).json({'returnval': 'invalid'});
       }
     });
 });
 app.post('/followup2',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var followupid={"followup_id":req.query.followupid};
   var collection = {"followup2_remarks":req.query.comments,"confidence_level_2":req.query.confidencelevel,"followup_2":req.query.followupdate2,"current_confidence_level":req.query.confidencelevel};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ? and ?',[collection,enquiry,school,followupid],
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
   var followupid={"followup_id":req.query.followupid};
   var collection = {"followup3_remarks":req.query.comments,"confidence_level_3":req.query.confidencelevel,"followup_3":req.query.followupdate3,"current_confidence_level":req.query.confidencelevel};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ? and ?',[collection,enquiry,school,followupid],
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
   var followupid={"followup_id":req.query.followupid};
   var collection = {"followup4_remarks":req.query.comments,"confidence_level_4":req.query.confidencelevel,"followup_4":req.query.followupdate4,"current_confidence_level":req.query.confidencelevel};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ? and ?',[collection,enquiry,school,followupid],
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
   var followupid={"followup_id":req.query.followupid};
   var collection = {"followup5_remarks":req.query.comments,"confidence_level_5":req.query.confidencelevel,"followup_5":req.query.followupdate5,"current_confidence_level":req.query.confidencelevel};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ? and ?',[collection,enquiry,school,followupid],
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
   var checkstatus=req.query.status;
   if((checkstatus=='Closed')||(checkstatus=='Exhausted')){
        var qur = "SELECT f.enquiry_id,f.followup_flag,s.enquiry_name,f.followup_status,f.followup_id,f.current_confidence_level FROM followupdetail f join student_enquiry_details s on f.enquiry_id=s.enquiry_no WHERE f.followup_status='"+req.query.status+"' and s.class='"+req.query.grade+"' and s.school_id = '"+req.query.schol+"' ORDER BY (next_followup_date) DESC";
   }
   else{
        var qur = "SELECT f.enquiry_id,f.followup_flag,s.enquiry_name,f.followup_status,f.followup_id,f.current_confidence_level FROM followupdetail f join student_enquiry_details s on f.enquiry_id=s.enquiry_no WHERE f.followup_status='"+req.query.status+"' and s.class='"+req.query.grade+"' and s.school_id = '"+req.query.schol+"' ORDER BY (next_followup_date)";
   }

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
   var qur = "SELECT s.enquiry_no, s.enquiry_name, s.class, s.created_on, s.father_name, s.father_mob,f.followup_id, f.followup_1, f.followup1_remarks, f.confidence_level_1, f.followup_2, f.followup2_remarks, f.confidence_level_2, f.followup_3, f.followup3_remarks, f.confidence_level_3, f.followup_4, f.followup4_remarks, f.confidence_level_4, f.followup_5, f.followup5_remarks, f.confidence_level_5,f.schedule FROM student_enquiry_details s JOIN followupdetail f on s.enquiry_no=f.enquiry_id WHERE f.enquiry_id='"+req.query.id+"' and f.school_id='"+req.query.schol+"' and f.followup_status='"+req.query.fstatus+"' and f.followup_id='"+req.query.fid+"'";
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
   /*console.log(status);
   console.log(school);
   console.log(enquiry);*/
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

/*this function is to change the current followup status in the followdetail table*/
app.post('/changestatus',  urlencodedParser,function (req, res)
{
  var school={"school_id":req.query.schol};
  var enquiry={"enquiry_id":req.query.id};
  var followupid={"followup_id":req.query.fid};
  var status={"followup_status":"Exhausted"};
       connection.query('update followupdetail set ? where ? and ? and ?',[status,followupid,enquiry,school],
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

/*this function is to update the new reschedule date and new folllowup id in the follow table*/
app.post('/updateschedule',  urlencodedParser,function (req, res)
{

  var school={"school_id":req.query.schol};
  var enquiry={"enquiry_id":req.query.id};
  var collection={"id":req.query.followid,"schedule_no":req.query.schedule,"rescheduled_on":req.query.rescheduledon};

       connection.query('update followup set ? where ? and ?',[collection,enquiry,school],
        function(err, rows)
        {
    if(!err)
    {
      console.log('updatedsche');
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }

});
  });

 app.post('/fetchdetailedenquiryinfo', urlencodedParser,function (req, res){

   //console.log('qur');
   connection.query("SELECT * from student_enquiry_details where school_id = '"+req.query.schoolid+"' and enquiry_no= '"+req.query.enquiryno+"'",
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


 app.post('/fetchadmissiontestinfo', urlencodedParser,function (req, res){

   //console.log('qur');
   var qur="SELECT * FROM student_enquiry_details WHERE school_id='"+req.query.schoolid+"' and enquiry_no='"+req.query.enquiryno+"' and status='Enquired' and admission_test='Yes'";
   console.log(qur);
   connection.query(qur,
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


  app.post('/updateteststatus', urlencodedParser,function (req, res){

   //console.log('qur');
   var qur="UPDATE student_enquiry_details SET admission_status='"+req.query.status+"' WHERE school_id='"+req.query.schoolid+"' and enquiry_no='"+req.query.enquiryno+"' and status='Enquired' and admission_test='Yes'";
   console.log(qur);
   connection.query(qur,
     function(err, result)
     {
       if(!err)
       {
         if(result.affectedRows>0)
         {
           //console.log(rows);
           res.status(200).json({'returnval': 'updated!'});
         }
         else
         {
           console.log(err);
           res.status(200).json({'returnval': 'not updated!'});
         }
       }
       else{
         console.log(err);
       }
     });
 });


  app.post('/insertcallhistory',  urlencodedParser,function (req, res){
    var response={
      "school_id":req.query.schol,
      "enquiry_id":req.query.enid,
      "followup_id":req.query.fid,
      "followup_no":req.query.fno,
      "follwup_date":req.query.fdate,
      "call_comments":req.query.callstatus,
      "schedule":req.query.schedule
    };
    connection.query('INSERT INTO call_history SET ?',[response],
    function(err, rows)
    {
    if(!err)
    {
      res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'no'});
    }
    });
});


 app.post('/discountenq',  urlencodedParser,function (req, res){
   var response={
     "school_id":req.query.schol,
     "enquiry_no":req.query.enq,
     "discount_code":req.query.discountid,
   };
   connection.query('INSERT INTO special_discounts SET ?',[response],
     function(err, rows)
     {
       if(!err)
       {
         res.status(200).json({'returnval': 'success'});
       }
       else
       {
         console.log(err);
         res.status(200).json({'returnval': 'no'});
       }
     });
 });


 app.post('/updatedate',  urlencodedParser,function (req, res)
 {
   var school={"school_id":req.query.schol};
   var enquiry={"enquiry_id":req.query.enqno};
   var followupid={"followup_id":req.query.fwupid};
   var collection = {"followup_flag":req.query.nextflag,"next_followup_date":req.query.nextdate};
   console.log(collection);
   connection.query('update followupdetail set ? where ? and ? and ?',[collection,enquiry,school,followupid],
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



app.post('/getconfidencecount',  urlencodedParser,function (req, res){

    //console.log('qur');
    connection.query("SELECT d.followup_status, f.class, COUNT( * ) AS total FROM  `followupdetail` AS d, student_enquiry_details AS f WHERE d.`school_id` =  '"+req.query.schol+"' AND d.current_confidence_level =  '"+req.query.status+"' AND f.enquiry_no = d.enquiry_id and f.status='Enquired' GROUP BY class ORDER BY (`class`)",
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



app.post('/verifyage',  urlencodedParser,function (req, res){

    //console.log('qur');
    var classes={"grade":req.query.grades};
    connection.query("SELECT * from md_age where ?",[classes],
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
      res.status(200).json({'returnval': 0});
    }
  }
  else{
     console.log(err);
  }
});
});

 app.post('/country',  urlencodedParser,function (req, res){
   connection.query("SELECT * from country_code",
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
           res.status(200).json({'returnval':null});
         }
       }
       else{
         console.log(err);
       }
     });
 });

 app.post('/discount',  urlencodedParser,function (req, res){
   connection.query("SELECT * from md_discounts",
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
           res.status(200).json({'returnval':null});
         }
       }
       else{
         console.log(err);
       }
     });
 });


 app.post('/rtenumber',  urlencodedParser,function (req, res){

   var collection = {"school_id":req.query.schol,"enquiry_no":req.query.enq,"rte_no":req.query.rte_num};
   console.log(collection);
   connection.query("INSERT into rte_students set ? ",[collection],
     function(err, rows)
     {
       if(!err)
       {
         if(rows.length>0)
         {
           //console.log(rows);
           res.status(200).json({'returnval': "success"});
         }
         else
         {
           console.log(err);
           res.status(200).json({'returnval':null});
         }
       }
       else{
         console.log(err);
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
