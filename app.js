const exp = require('express'); // require  : javascript
const app = exp();
const mysql = require('mysql'); 
var dbconf = {

    host: 'localhost' , 
    user : 'root' , 
    password : '1234' , 
    port: '3306' ,
    database : 'ang2' 
};
var connection = mysql.createConnection(dbconf);
app.use('/' , (req, res,next) => {

    console.log(req.url);

    if( req.url.indexOf(".html") != -1 ) { 
        res.sendFile(req.url , {root:__dirname + "/views"});
    } else { 
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        next();
    }
});

app.get('/' , (req, res, next) =>  {

  
   res.write("요청 경로 : "  + req.url);

   res.write("<br>시작");
   res.write("<br> 시작2");
   res.write("<br> 시작3");
   next();
 
} );

app.get('/' , (req, res, next) => {

    res.write("<br><bt>두번째 시작");

    res.end();

} );

app.get('/test' , (req, res, next) => {

    res.write("요청 경로 : " + req.url);
    res.end();
} );


app.get('/join' , (req, res, next) => {


    var html = ""; 
 
    html +=  "<form method='get' action='/join2' >";
    html +=  "<table border='1'> ";
    html +=  "<tr> ";
    html +=  "<td colsapn='2'>회원가입</td> ";
    html +=  "</tr> ";
    
    html +=  "<tr> ";
    html +=  "<td>이름 : </td> ";
    html +=  "<td><input type='text' name ='username' id='name' /> </td> ";
    html +=  "</tr> ";
    html +=  "<tr> ";
    html +=  "<td>나이 : </td> ";
    html +=  "<td><input type='text' name ='userage' id='name' /> </td> ";
    html +=  "</tr> ";
    html +=  "<tr> ";
    html +=  "<td>아이디 : </td> ";
    html +=  "<td><input type='text' name ='userid' id='name' /> </td> ";
    html +=  "</tr> ";
    html +=  "<tr> ";
    html +=  "<td>비밀번호 : </td> ";
    html +=  "<td><input type='text' name ='userpwd' id='name' /> </td> ";
    html +=  "</tr> ";
    html +=  "<tr> ";
    html +=  "<td>주소 : </td> ";
    html +=  "<td><input type='text' name ='useraddress' id='name' /> </td> "
    html +=  "</tr> ";
    html +=  "<tr> ";
    html +=  "<td colsapn='2'><input type='submit' value='회원가입'> </td> ";
    html +=  "</tr> ";
    html +=  "</table> ";
    html +=  "</form> ";
    
    res.write(html);
   res.end();

} );

app.get('/join2' , (req, res , next) => {
    // express 지원 
    // param, body , query  
    var username = req.query.username ;
    var userage = req.query.userage; 
    var userid = req.query.userid ; 
    var userpwd = req.query.userpwd; 
    var useraddress = req.query.useraddress;

    if( username.trim() == "" ) {
        res.write("<script>alert('이름을 입력하세요'); location.href ='/join' </script>") ; 
      //  res.redirect("/join");
     //   res.end();
    } 
    if ( userage.trim() == "" ) {
        res.write("<script>alert('나이을 입력하세요');location.href ='/join' </script>") ; 
      //  res.redirect("/join");
      //  res.end();
    }
    var sql = "select count(1) a from user_info where userid = ? "
    var values = [userid];

    connection.query(sql , values , (err, rows)=>{
        if( err  )  {
            console.log(err ) ;
            throw err ; 
        }
            /*  */
         //console.log(rows.length ) ;

        //console.log("rows[0] :" + rows[0].a);
        
         if( rows[0].a == 0 ) {


  
            sql = " insert into user_info (username , userage, userid ,userpwd, useraddress ,dino  ) " ;
            sql +=    "  values (  ? ,? ,?, ?,? , 1 )  "  ;
            
            values = [username , userage, userid, userpwd, useraddress ] ;
        
        
            connection.query(sql, values ,( err, rows)  => {
                 if( err ) { 
                    console.log(err) ; 
                    res.write("회원가입에 실패하였습니다." );
                    res.end ();
                } else if(rows ) {
                    if(rows.affectedRows == 1 ) {
                        res.write(" 회원가입 완료");
                        res.end();
                    }
        
                }
        
            } ) ; 




         } else { 
            res.write("입력하신 아이디  " + userid + "  는 이미 존재합니다." ) ; 
            res.end();
         }


    });
  
    // console.log(req.query.username);// console.log : 서버용 콘솔
    // console.log(req.query.userage);
    // console.log(req.query.userid);
    // console.log(req.query.userpwd);
    // console.log(req.query.useraddress);
    // res.write("회원가입완료");
    // res.end();


} ) ;
app.get ('/list' , (req, res, next) => {

    var sql = 'select *  from user_info ' ;

    var values  = [] ; // 배열
    var result = {} ;  // 구조체 ,json 
    connection.query ( sql ,values , (err, rows) =>{

        if(err ) throw err  ;
        result["list"] = rows ; 
        res.json(result) ; 
        
    });



} ) ;

 
app.listen(3000 , function () {
    console.log("server 3000");
} ); 
