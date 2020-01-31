var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if(!port){
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function(request, response){
    var parsedUrl = url.parse(request.url, true)
    var path = request.url
    var query = ''
    if(path.indexOf('?') >= 0){ query = path.substring(path.indexOf('?')) }
    var pathNoQuery = parsedUrl.pathname
    var queryObject = parsedUrl.query
    var method = request.method
    /******** 从这里开始看，上面不要看 ************/
    console.log('得到 HTTP 路径\n' + path)
    if(path == "/uptoken"){
        response.setHeader('Content-Type','text/css; charset=utf-8')
        response.setHeader('Access-Control-Allow-Origin','*')

        var config  = fs.readFileSync('./qiniu_key.json')
        config = JSON.parse(config)

        let {accessKey, secretKey} = config;
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

        var options = {
            scope: 'sadmusic',
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken=putPolicy.uploadToken(mac);

        response.write(`{"uptoken": "${uploadToken}"}`)
        response.end()
    }else{
        response.statusCode = 404
        response.end()
    }
    /******** 代码结束，下面不要看 ************/
})
server.listen(port)
console.log('监听 ' + port + ' 成功\nhttp://localhost:' + port)