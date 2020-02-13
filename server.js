let http = require('http')
let url = require('url')
let fs = require('fs')
let querystring = require('querystring')
let util = require('util')
let qiniu = require('qiniu')

let port = process.argv[2]

if(!port){
    console.log('请指定端口号\n比如 node server.js 8888')
    process.exit(1)
}

let server = http.createServer(function(request, response){
    let parsedUrl = url.parse(request.url,true)
    let path = parsedUrl.pathname
    let method = request.method
    /* init qiniu and return mac */
    let getMac = ()=>{
        let config  = fs.readFileSync('./qiniu_key.json')
        config = JSON.parse(config)
        let {accessKey, secretKey} = config
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        return mac
    }
    let getToken = (bucket)=>{
        let options = {
            scope: bucket,
        }
        let mac = getMac()
        let putPolicy = new qiniu.rs.PutPolicy(options)
        return putPolicy.uploadToken(mac)
    }
    let initBucketManager = ()=>{
        let mac = getMac()
        let config = new qiniu.conf.Config()
        config.zone = qiniu.zone.Zone_z0
        let bucketManager = new qiniu.rs.BucketManager(mac, config)
        return bucketManager
    }
    let deleteFile = (bucket,key)=>{
        let bucketManager = initBucketManager()
        bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
            if (err) {
                console.log(err)
                //throw err
            } else {
                console.log(respInfo.statusCode)
                console.log(respBody)
                response.end()
            }
        })
    }
    if(path == "/token"){
        console.log('✔ 成功请求 http://localhost:' + port + path)
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
            deleteFile('sadmusic',data.key)
        })
    }else{
        console.log('❌ 无法请求 http://localhost:' + port + path)
        response.statusCode = 404
        response.end()
    }
})
server.listen(port)
console.log('💻 监听' + 'http://localhost:' + port + ' 成功 ✔')
