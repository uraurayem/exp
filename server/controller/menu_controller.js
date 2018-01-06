var express = require('express') ; 
var router = express.Router();

var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
var con = mysql.createConnection(dbConfig);


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

router.get('/', selectMenu ); 
module.exports = router;

function selectMenu(req, res, next) {

    var sql = "select * from menu order by sort" ;
    con.then((con) => {
        return con.query(sql) ;
    } )
    // .then(rows => {
    //     console.log(rows);
    //     res.json(rows);
    // });
    .then(rowsHandle)
    .catch(errorHandle)
    .then(result => {
        res.json(result);
    } ) ;

} ;
