var express = require('express') ; 
var router = express.Router();
var ds = require('../service/depart_service');
// var mysql = require('promise-mysql');
// var dbConfig = require('../conf/dbconfig.js');
// var con = mysql.createConnection(dbConfig);

router.get('/', selectDepartList ); 
router.get('/:diNo', selectDepart) ;
router.post('/update' , updateDepart ) ;
router.delete('/:diNo' , deleteDepart ) ; 
router.post('/insert' , insertDepart ) ;

module.exports = router;

// var errorHandle = (err)=>{
//     console.log(err);
//     var result = {};

//     if(err.code) { 
//         result["error"] = {"code" : err.code,
//         "no" : err.errno,
//         "msg" : err.sqlMessage
//         };
//     } else { 
//         result["error"] = err ;
//     }

//     return result;
// }
// var rowsHandle = (rows)=>{
//     var result = {};
//     result["list"] = rows;
//     return result;
// }


function selectDepartList( req  , res, next )  {
    ds.selectDepartList(req)
    .then(result => {
        res.json(result);
    });
}
function selectDepart( req, res, next ) {
  ds.selectDepart(req)
  .then(result => {
      console.log("selectDepart result : " + result );
      res.json(result);
  });
}

function updateDepart(req, res, next) {
     ds.updateDepart(req)
     .then(result => {
         res.json(result);
     } );

}
function deleteDepart (req, res, next) {
  ds.deleteDepart(req)
  .then( result => {
      res.json(result);
  } );
}
function insertDepart(req, res, next) {
     
    ds.insertDepart(req)
    .then( result => {
        res.json(result);
    } );
}

// function selectDepartList( req  , res, next )  {
//     var sql = "select * from depart_info" ; 
//     con.then((con) => {
//         return con.query(sql) ;
//     }).then(rowsHandle).then( result => {

//         console.log(result);
//         console.log(result["list"]);
//         res.json(result) ; 
//     });
// }
// function selectDepart( req, res, next ) {
//     var sql = "select dino, diname, didesc , dicnt  from depart_info where diNo = ? " ; 
//     var diNo = req.params.diNo; 
//     con.then((con) => {
//         return con.query(sql,diNo) ;
//     }).then(rows => {
//         res.json(rows) ; 
//     });
    
// }

// function updateDepart(req, res, next) {
       
//     var obj = req.body ; 
//     var values = [obj.diname , obj.didesc  , obj.dicnt  , obj.dino]; 

//     var sql ="update depart_info set  diName =  ? , diDesc  = ? , diCnt = ? where dino = ? " ;
//     var result = {} ; 

//     con.then((con) => { 
//         return con.query(sql, values) ;
//     }).then(rows => {

//         console.log(rows);
//        result["succeed"] = "ok"; 


//         if(rows.affectedRows != 1) {
//             result["succeed"] ="no";
//         }

//        res.json(result);
//     }) ; 
// }
// function deleteDepart (req, res, next) {
//     console.log( "express => req dino : " +  req.params.diNo   ) ;
//     var diNo = req.params.diNo;   ;
//         var sql ="delete from depart_info where dino = ? " ;
//        var result = {} ; 
   
//        con.then((con) => { 
//            return con.query(sql, diNo) ;
//        }).then(rows => {
   
      
//           res.json(rows);
//        }).catch(errorHandle ).then((result)=> {
   
//            res.json(result);
//        });

// }
// function insertDepart(req, res, next) {
     
//     var obj = req.body ; 
//     var values = [obj.diname , obj.didesc  , obj.dicnt ]; 

//     var sql ="insert into depart_info (diname, didesc, dicnt ) values (? , ?, ? )" ;
//     var result = {} ; 


//     var dbCon ; 

//     con.then((con) => { 
//         dbCon = con ; 
//         return dbCon.query(sql, values) ;

//     }).then(rows => {

//         console.log(rows);
//        result["succeed"] = "no"; 


//         if(rows.affectedRows == 1) {
//             var diNo = rows.insertId;
//             sql = "select ? as dino , count(1) as dicnt from user_info where dino= ? " ;  
//             result["succeed"] ="ok";
//             return dbCon.query(sql, [diNo , diNo]) ;
//         } else { 
            
//         }

    
//     }).then(rows => {
//         var result ;
        
//         rows.map(row => {
//             console.log("row : " + row ) ;
//             sql = "update depart_info set dicnt = ? where diNo = ? " ;
//             result = dbCon.query(sql , [row.dicnt , row.dino ]);
     
//         } );
//         return result; 
//     } ).then (rows => { 
//         if( rows.affectedRows == 1 ) {
//             result["succeed"] = "ok"; 
//             result["rows"] = rows ; 
//         }

//     }).catch( err => {

//         result["succeed"] = "no";
//     } ).then(data => {
//         res.json(result);
//     } );

    
// }
// app.post('/api/departs' , (req,res, next) => {
   
//     var obj = req.body ; 
//     var values = [obj.diname , obj.didesc  , obj.dicnt ]; 

//     var sql ="insert into depart_info (diname, didesc, dicnt ) values (? , ?, ? )" ;
//     var result = {} ; 


//     var dbCon ; 

//     con.then((con) => { 
//         dbCon = con ; 
//         return dbCon.query(sql, values) ;

//     }).then(rows => {

//         console.log(rows);
//        result["succeed"] = "no"; 


//         if(rows.affectedRows == 1) {
//             var diNo = rows.insertId;
//             sql = "select ? as dino , count(1) as dicnt from user_info where dino= ? " ;  
//             result["succeed"] ="ok";
//             return dbCon.query(sql, [diNo , diNo]) ;
//         } else { 
            
//         }

    
//     }).then(rows => {
//         var result ;
        
//         rows.map(row => {
//             console.log("row : " + row ) ;
//             sql = "update depart_info set dicnt = ? where diNo = ? " ;
//             result = dbCon.query(sql , [row.dicnt , row.dino ]);
     
//         } );
//         return result; 
//     } ).then (rows => { 
//         if( rows.affectedRows == 1 ) {
//             result["succeed"] = "ok"; 
//             result["rows"] = rows ; 
//         }
//     }).catch( err => {

//         result["succeed"] = "no";
//     } ).then(data => {
//         res.json(result);
//     } );

    
// } ) ;



// app.post('/api/departs/update' , (req,res, next) => {
   
//     var obj = req.body ; 
//     var values = [obj.diname , obj.didesc  , obj.dicnt  , obj.dino]; 

//     var sql ="update depart_info set  diName =  ? , diDesc  = ? , diCnt = ? where dino = ? " ;
//     var result = {} ; 

//     con.then((con) => { 
//         return con.query(sql, values) ;
//     }).then(rows => {

//         console.log(rows);
//        result["succeed"] = "ok"; 


//         if(rows.affectedRows != 1) {
//             result["succeed"] ="no";
//         }

//        res.json(result);
//     }) ; 
    
// } ) ;


// app.delete('/api/departs/:diNo' , (req,res, next) => {
   
// console.log( "express => req dino : " +  req.params.diNo   ) ;
//  var diNo = req.params.diNo;   ;
//      var sql ="delete from depart_info where dino = ? " ;
//     var result = {} ; 

//     con.then((con) => { 
//         return con.query(sql, diNo) ;
//     }).then(rows => {

   
//        res.json(rows);
//     }).catch(errorHandle ).then((result)=> {

//         res.json(result);
//     });
     
// } ) ;

// app.get('/api/departs' , (req,res, next) => {
   
//     var sql = "select * from depart_info" ; 
//     con.then((con) => {
//         return con.query(sql) ;
//     }).then(rowsHandle).then( result => {

//         console.log(result);
//         console.log(result["list"]);
//         res.json(result) ; 
//     });
    
// } ) ;

// app.get('/api/departs/:diNo' , (req,res, next) => {
   
//     var sql = "select dino, diname, didesc , dicnt  from depart_info where diNo = ? " ; 
//     var diNo = req.params.diNo; 
//     con.then((con) => {
//         return con.query(sql,diNo) ;
//     }).then(rows => {
//         res.json(rows) ; 
//     });
    
// } ) ;
