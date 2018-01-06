var express = require('express') ; 
var router = express.Router();

var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
var con = mysql.createConnection(dbConfig);

router.get('/', selectUserList ); 
router.get('/:userno', selectUser) ;
router.post('/update' , updateUser ) ;
router.delete('/:userno' , deleteUser ) ; 
router.post('/insert' , insertUser ) ;

module.exports = router;
var errorHandle = (err)=>{
    console.log(err);
    var result = {};

    if(err.code) { 
        result["error"] = {"code" : err.code,
        "no" : err.errno,
        "msg" : err.sqlMessage
        };
    } else { 
        result["error"] = err ;
    }

    return result;
}
var rowsHandle = (rows)=>{
    var result = {};
    result["list"] = rows;
    return result;
}



function selectUserList (req , res , next )  {

    var sql = "    select userno as userNo  , ";
              sql +="     username as userName, ";                 
              sql +="     userage as userAge ,";
              sql +="     userid as userId , ";
              sql +="     userpwd as userPwd , ";
              sql +="     useraddress as userAddress ,";
              sql +="     ui.dino as diNo            ";
              sql +="     from user_info ui , depart_info di ";
              sql +="     where ui.dino = di.dino " ;
   
    con.then((con) => { 
        return  con.query(sql ) ;
    })
    .catch(errorHandle)
    .then(rowsHandle)
    .then(result => {
   
       res.json( result );
    }) ; 
   
   
   
} 
   
   
  function updateUser (req , res , next )  {
       var usr = req.body;
       var sql ="update user_info set username = ? , userid = ? , dino = ? , userPwd = ? where userno = ? " ;
   
       var result = {} ; 
           
       con.then((con) => { 
           return  con.query(sql , [usr.userName , usr.userId, usr.diNo, usr.userPwd , usr.userNo] ) ;
       }).catch(errorHandle).then( datas => {
   
           result["succeed"] = "no" ; 
           if( datas.affectedRows == 1 ) { 
           
               result["succeed"] ="ok";
               res.json(result) ; 
           }
           
           }
       ); 
   } ;
   
   function insertUser (req , res , next )  {
   
       var sql = "select 1 from user_info where userId=?";
       var values = [req.body.userId];
       con
       .then((con)=>{
           return con.query(sql,values);
       })
       .then((result)=>{
           console.log(result.length);
           if(result.length>0){
               throw {"code":"중복에러","errno":1,"sqlMessage":req.body.userId+" 중복된 아이디"};
           }
           return true;
       }).then(()=>{
           sql = "insert into user_info (";
           sql += "userId, userName, userPwd , userAge , dino )";
           sql += "values(?,?,?,?,?)";
           var pm = req.body;
           var values = [pm.userId, pm.userName, pm.userPwd ,"11" ,  pm.diNo ];
           console.log("body : " + values) ;
           return con.then((con) =>  {return con.query(sql,values) }) ;
       }).catch(errorHandle).then(result =>{
           console.log(result);
           if(result.affectedRows==1){
               // 정상
               // depart update 
            //   let insertedUserNo = result.insertId ; 
   
   
               sql = "" ;
   
               result["succeed"] = "ok" ;
           }else{
               throw {"code":"몰름","errno":2,"sqlMessage":"error"};
           }
   
           res.json(result);
       }) ;
    
       
      
   } ;
   
function deleteUser  (req , res , next )  {
        console.log("req.params.userno : "  + req.params.userno ) ;
       var sql = "delete from user_info where userno = ? " ; 
       var userNo =  req.params.userno  ;
       var result = {} ; 
       con.then(con => { 
           return con.query(sql,userNo  ) ; 
       } ).catch(errorHandle).then(datas => {
   
           result["succeed"] = "no" ; 
           if( datas.affectedRows == 1 ) { 
           
               result["succeed"] ="ok";
               res.json(result) ; 
           }
           
   
       } ) ;
   } ;

   function selectUser (req, res, next)  {

   }