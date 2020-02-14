let port = process.argv[2]
if(!port){
    console.log('请指定端口号\n比如 node server.js 8888')
    process.exit(1)
}
let http = require('http')
let url = require('url')
let querystring = require('querystring')
let fs = require('fs')
let qiniu = require('qiniu')
/* init qiniu and return mac */
let getMac = ()=>{
    let config  = fs.readFileSync('./qiniu_key.json')
    config = JSON.parse(config)
    let {accessKey, secretKey} = config
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    return mac
}
/* get qiniu token */
let getToken = (bucket)=>{
    let options = {
        scope: bucket,
    }
    let mac = getMac()
    let putPolicy = new qiniu.rs.PutPolicy(options)
    return putPolicy.uploadToken(mac)
}
/* create qiniu bucket manager object */
let initBucketManager = ()=>{
    let mac = getMac()
    let config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0
    let bucketManager = new qiniu.rs.BucketManager(mac, config)
    return bucketManager
}
/* delete the file in bucket whose filename is key */
let deleteFile = (bucket,key)=>{
    let bucketManager = initBucketManager()
    return bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
        if (err) {
            console.log(err)
            return err
        } else {
            console.log(respInfo.statusCode)
            return respInfo
        }
    })
}
http.createServer(function(request, response){
    let parsedUrl = url.parse(request.url,true)
    let path = parsedUrl.pathname
    let method = request.method
    if(path == "/token"){
        console.log('✔ 成功请求 http://localhost:' + port + path)
        response.setHeader('Access-Control-Allow-Origin','*')
        let uploadToken = getToken('sadmusic')
        response.write(`{"token": "${uploadToken}"}`)
        response.end()
    }else if(path == "/delete" && method =="POST"){
        console.log('✔ 成功请求 http://localhost:' + port + path)
        response.setHeader('Access-Control-Allow-Origin','*')
        let data = ''
        request.on('data', function (chunk) {
            data += chunk
        })
        request.on('end', function () {
            data = querystring.parse(data)
            response.write(console.log('⏳ 正在删除'))
            response.write(console.log('删除状态： '+deleteFile('sadmusic',data.key)))
        })
    }else{
        console.log('❌ 无法请求 http://localhost:' + port + path)
        response.statusCode = 404
        response.end()
    }
}).listen(port)
console.log('💻 监听' + 'http://localhost:' + port + ' 成功 ✔')
