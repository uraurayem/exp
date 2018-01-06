var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
const con = mysql.createConnection(dbConfig);

var rowsHandle = require('../conf/rowsHandle');
var errorHandle = require('../conf/errorHandle');

var departService = { 
    selectDepartList: selectDepartList ,
    selectDepart : selectDepart ,
    insertDepart : insertDepart , 
    updateDepart :  updateDepart ,
    deleteDepart : deleteDepart 
}

module.exports = departService ;

function selectDepartList (req) {
    var sql = "select * from depart_info" ; 
    return con.then((con) => {
        return con.query(sql) ;
    })
    .then(rowsHandle)
    .catch(errorHandle);
    
}
function selectDepart(req) { 
   
    var sql = "select dino, diname, didesc , dicnt  from depart_info where diNo = ? " ; 
    var diNo = req.params.diNo; 
    return con.then((con) => {
        return con.query(sql,diNo) ;
    })
    .then(rowsHandle)
    .catch(errorHandle);
    
}
function insertDepart(req) { 
    var obj = req.body ; 
    var values = [obj.diname , obj.didesc  , obj.dicnt ]; 

    var sql ="insert into depart_info (diname, didesc, dicnt ) values (? , ?, ? )" ;
    var result = {} ; 


    var dbCon ; 

    con.then((con) => { 
        dbCon = con ; 
        return dbCon.query(sql, values) ;

    }).then(rows => {

        console.log(rows);
       result["succeed"] = "no"; 


        if(rows.affectedRows == 1) {
            var diNo = rows.insertId;
            sql = "select ? as dino , count(1) as dicnt from user_info where dino= ? " ;  
            result["succeed"] ="ok";
            return dbCon.query(sql, [diNo , diNo]) ;
        } else { 
            
        }

    
    }).then(rows => {
        var result ;
        
        rows.map(row => {
            console.log("row : " + row ) ;
            sql = "update depart_info set dicnt = ? where diNo = ? " ;
            result = dbCon.query(sql , [row.dicnt , row.dino ]);
     
        } );
        return result; 
    } ).then (rows => { 
        if( rows.affectedRows == 1 ) {
            result["succeed"] = "ok"; 
            result["rows"] = rows ; 
        }

    }).catch( err => {

        result["succeed"] = "no";
    } ).then(data => {
        res.json(result);
    } );
}
function updateDepart(req) {
    var obj = req.body ; 
    var values = [obj.diname , obj.didesc  , obj.dicnt  , obj.dino]; 

    var sql ="update depart_info set  diName =  ? , diDesc  = ? , diCnt = ? where dino = ? " ;
    var result = {} ; 

    return con.then((con) => { 
        return con.query(sql, values) ;
    }).then(rows => {

        console.log(rows);
       result["succeed"] = "ok"; 


        if(rows.affectedRows != 1) {
            result["succeed"] ="no";
        }

       res.json(result);
    }) ; 
}
function deleteDepart(req) {
    console.log( "express => req dino : " +  req.params.diNo   ) ;
    var diNo = req.params.diNo;   ;
        var sql ="delete from depart_info where dino = ? " ;
       var result = {} ; 
   
       con.then((con) => { 
           return con.query(sql, diNo) ;
       }).then(rows => {
   
      
          res.json(rows);
       }).catch(errorHandle ).then((result)=> {
   
           res.json(result);
       });
}