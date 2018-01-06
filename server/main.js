const express = require('express');
const morgan = require('morgan');  // log 
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const header  = require('./conf/header');
// const dbConfig   = require('./conf/dbconfig.js');
// const mysql = require('mysql');
// const mysql2 = require('promise-mysql');
const menuController = require('./controller/menu_controller');
const departController = require('./controller/depart_controller');
const userController = require('./controller/user-controller');
// var connection = mysql.createConnection(dbConfig);
// var connection2 = mysql2.createConnection;
// const con = mysql2.createConnection(dbConfig);


app.set('port', (process.env.PORT || 3000));

//app.use('/', express.static(__dirname + '/../dist'));
app.use('/scripts', express.static(__dirname + '/../node_modules'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));


// var generateWhere = function(paramObj){
//     var whereStr = '';
//     Object.keys(paramObj).forEach((key)=>{
//         whereStr += ' and ' + key + '=? ';
//     });
//     return whereStr;
// }

// var generateWhereValue = function(paramObj){
//     var whereValue = [];
//     Object.keys(paramObj).forEach((key)=>{
//         whereValue.push(paramObj[key]);
//     });
//     return whereValue;
// }


/*   중요 ..! */
// var errorHandle = (err)=>{
//     var result = {};
//     result["error"] = {"code" : err.code,
//     "no" : err.errno,
//     "msg" : err.sqlMessage
//     };
//     return result;
// }
// var rowsHandle = (rows)=>{
//     var result = {};
//     result["list"] = rows;
//     return result;
// }
/*            */

/*    ---------------------------------------------------------------------------------------------      */


app.use(header);
app.use('/api/userdeparts' , userController ) ;
app.use('/api/menus', menuController ) ;
app.use('/api/departs' , departController ) ;

/*    ---------------------------------------------------------------------------------------------      */


app.get('/api/users2',(req, res, next)=>{
    var paramObj = JSON.parse(req.query.user);
    var sql = 'SELECT userNo, userName, userId, userPwd from user_info where 1=1 '
    sql += generateWhere(paramObj);
    var values = generateWhereValue(paramObj);
    connection2(dbConfig).then((conn)=>{
        return conn.query(sql, values);
    })
    .then(rowsHandle)
    .catch(errorHandle)
    .then((result)=>{
        res.json(result);
        next();
    });
});

app.get('/api/users2',(req, res, next)=>{
})

app.get('/api/userhis/:userNo',(req, res, next)=>{
    var values = [req.params.userNo];
    var sql = "select userNo, userData from user_his where userNo=?";
    connection2(dbConfig).then((conn)=>{
        return conn.query(sql, values);
    })
    .then(rowsHandle)
    .catch(errorHandle)
    .then((result)=>{
        res.json(result);
    });
})

app.post('/api/users',(req,res,next)=>{
    var sql = "select 1 from user_info where userId=?";
    var values = [req.body.userId];
    connection2(dbConfig)
    .then((con)=>{
        return con.query(sql,values);
    })
    .then((result)=>{
        if(result.length>0){
            throw {"code":"중복에러","errno":1,"sqlMessage":req.body.userId+"이거 있어! 에러야임마!!"};
        }
        return true;
    }).then(()=>{
        sql = "insert into user_info(";
        sql += "userId, userName, userPwd,userAge)";
        sql += "values(?,?,?,?)";
        var pm = req.body;
        var values = [pm.userId, pm.userName, pm.userPwd , pm.userAge];
        var result = {};
        return connection2(dbConfig).then((con)=>{
            return con.query(sql,values);
        })
    }).then((result)=>{
        if(result.affectedRows==1){
            var sql = "select userNo, userName,userId,userPwd from user_info";
            return connection2(dbConfig).then((conn)=>{
                return conn.query(sql);
            })
            .then(rowsHandle);
        }else{
            throw {"code":"몰름","errno":2,"sqlMessage":"이유는 모르겠고 안드갔는데?"};
        }
    })
    .catch(errorHandle)
    .then((result)=>{
        res.json(result);
    });
   
})
app.post('/api/users',(req, res, next)=>{
    var sql = "insert into user_info("
    var valueSql = "values("
    var values = [];
    for(var key in req.body){
        sql += key+",";
        valueSql += "?,";
        values.push(req.body[key]);
    }
    sql = sql.substr(0, sql.length-1) + ")";
    valueSql = valueSql.substr(0, valueSql.length-1) + ")";
    sql += valueSql;
    connection2(dbConfig).then((conn)=>{
        return conn.query(sql, values);
    })
    .then(rowsHandle)
    .catch(errorHandle)
    .then((result)=>{
    });
})

// app.get('/api/userdeparts' , (req , res , next ) => {

//  var sql = "    select userno as userNo  , ";
//            sql +="     username as userName, ";                 
//            sql +="     userage as userAge ,";
//            sql +="     userid as userId , ";
//            sql +="     userpwd as userPwd , ";
//            sql +="     useraddress as userAddress ,";
//            sql +="     ui.dino as diNo            ";
//            sql +="     from user_info ui , depart_info di ";
//            sql +="     where ui.dino = di.dino " ;

//  con.then((con) => { 
//      return  con.query(sql ) ;
//  })
//  .catch(errorHandle)
//  .then(rowsHandle)
//  .then(result => {

//     res.json( result );
//  }) ; 



// } );


// app.post('/api/userdeparts/update' , (req , res , next ) => {
//     var usr = req.body;
//     var sql ="update user_info set username = ? , userid = ? , dino = ? , userPwd = ? where userno = ? " ;

//     var result = {} ; 
        
//     con.then((con) => { 
//         return  con.query(sql , [usr.userName , usr.userId, usr.diNo, usr.userPwd , usr.userNo] ) ;
//     }).catch(errorHandle).then( datas => {

//         result["succeed"] = "no" ; 
//         if( datas.affectedRows == 1 ) { 
        
//             result["succeed"] ="ok";
//             res.json(result) ; 
//         }
        
//         }
//     ); 
// } );

// app.post('/api/userdeparts/insert' , (req , res , next ) => {

//     var sql = "select 1 from user_info where userId=?";
//     var values = [req.body.userId];
//     con
//     .then((con)=>{
//         return con.query(sql,values);
//     })
//     .then((result)=>{
//         console.log(result.length);
//         if(result.length>0){
//             throw {"code":"중복에러","errno":1,"sqlMessage":req.body.userId+" 중복된 아이디"};
//         }
//         return true;
//     }).then(()=>{
//         sql = "insert into user_info (";
//         sql += "userId, userName, userPwd , userAge , dino )";
//         sql += "values(?,?,?,?,?)";
//         var pm = req.body;
//         var values = [pm.userId, pm.userName, pm.userPwd ,"11" ,  pm.diNo ];
//         console.log("body : " + values) ;
//         return con.then((con) =>  {return con.query(sql,values) }) ;
//     }).catch(errorHandle).then(result =>{
//         console.log(result);
//         if(result.affectedRows==1){
//             // 정상
//             // depart update 
//          //   let insertedUserNo = result.insertId ; 


//             sql = "" ;

//             result["succeed"] = "ok" ;
//         }else{
//             throw {"code":"몰름","errno":2,"sqlMessage":"error"};
//         }

//         res.json(result);
//     }) ;
 
    
   
// } );

// app.delete('/api/userdeparts/:userno' , (req , res , next ) => {
//      console.log("req.params.userno : "  + req.params.userno ) ;
//     var sql = "delete from user_info where userno = ? " ; 
//     var userNo =  req.params.userno  ;
//     var result = {} ; 
//     con.then(con => { 
//         return con.query(sql,userNo  ) ; 
//     } ).catch(errorHandle).then(datas => {

//         result["succeed"] = "no" ; 
//         if( datas.affectedRows == 1 ) { 
        
//             result["succeed"] ="ok";
//             res.json(result) ; 
//         }
        

//     } ) ;
// } );

/* menu */
// app.get('/api/menus' , (req, res, next) => {

//     var sql = "select * from menu order by sort" ;
//     con.then((con) => {
//         return con.query(sql) ;
//     } ).then(rows => {
//         console.log(rows);
//         res.json(rows);
//     });

// } ) ;


app.get('/api/users',(req, res, next)=>{
    var result = {};
    var paramObj = JSON.parse(req.query.user);
    var sql = 'SELECT userNo, userName, userId, userPwd from user_info where 1=1 '
    sql += generateWhere(paramObj);
    var values = generateWhereValue(paramObj);
    connection.query(sql, values, (err, rows)=>{
        if(err) throw err;
        result["list"] = rows;
        res.json(result); // json 구조로 변경
        next();
    });
})
app.get('/api/users',(req,res,next)=>{
});


app.listen(app.get('port'), function() {
    console.log("run");
});