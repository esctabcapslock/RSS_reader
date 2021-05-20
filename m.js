const fs=require("fs");
const port = 1234;
var http = require("http");
const https = require('https');

function is(xx,path){
    function ok(xx){
    var a = `:"'<>|`;
    for (var i=0; i<a.length; i++){
        if (xx.includes(a[i])) return 0;
    }
    if (xx.includes("..")) return 0;
    return 1;
    }
    if (!xx.includes(path)) return 0;
    var yy = xx.substr(path.length);
    if (!ok(yy)) return 0;
    return 'https://'+yy;
}
/*
function 네이버주석(x){
    return x.replace(/(<!\[CDATA\[)/g,"").replace(/\]\]>/g,"");
}
*/
var app = http.createServer(function(요청, 응답){   
    var _url = 요청.url;
    var _method = 요청.method;
    var allow=['/main','/list','/show.js'];
    var U_to=['index.html','list.json','show.js'];
    console.log(요청.connection.remoteAddress,decodeURIComponent(_url),_method);
    
    if (allow.includes(_url) && _method == "GET") {
        fs.readFile(U_to[allow.indexOf(_url)], 'utf-8', (E, 파일) => {
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {
                'Content-Type': 확장자
            });
            응답.end(파일);
        })
    }else if(is(_url,'/rss/')){
        var s_url = decodeURIComponent(is(_url,'/rss/'));
        //console.log("좀",s_url);
        let data = '';
       if (!s_url.includes("naver")) {
           https.get(s_url, (_응답) => {    
               _응답.on('error',()=>{
                   console.log("요류남")
               });
            _응답.on('data',(chunk)=>{data += chunk;});
            _응답.on('end', () => {
                console.log('go',typeof(data))
                응답.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                응답.end(data.replace(//g,''));
            });                   
            });      
        }
        else{
            //console.log("네이버",s_url.replace("https://","http://"));
             http.get(s_url.replace("https://","http://"), (_응답) => {
           _응답.on('data',(chunk)=>{data += chunk;});
            _응답.on('end', () => {
                응답.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                
                응답.end(data);
                });                   
             });
        }
    
    }else{
        응답.writeHead(404);
        응답.end(".");
    }
});
app.listen(port);
console.log(`${port}번 포트에서 실행`)