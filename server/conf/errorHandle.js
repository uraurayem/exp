module.exports=(err) =>{
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