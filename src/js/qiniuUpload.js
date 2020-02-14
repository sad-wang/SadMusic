window.qiniuUpload = {
    putExtra: {
        fname: "",
        params: {},
        mimeType: null
    },
    observer: {

        error(err){
            console.log('❌ 上传失败')
            console.log(err.message)
        },
        complete(res){
            console.log('✔ ' + res.key + ' 上传成功')
        }
    },
    config: {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6,
        region: null
    },
    init(port,domain,file,key){
        this.token = this.getToken(port)
        this.domain = domain
        this.file = file
        this.key = key
    },
    upload(){
        if (this.token){
            console.log('🚀 正在上传 ' + this.key)
            let file = JSON.parse(JSON.stringify(this.file))
            qiniu.upload(file, this.key, this.token, this.putExtra, this.config).subscribe(this.observer)
        }
    },
    getToken(port){
        let token
        console.log('🚀 正在获取 token')
        $.ajax({
            async: false,
            url: 'http://127.0.0.1:'+port+'/token',
            success: (res)=>{
                console.log('✔ 获取 token 成功')
                token = JSON.parse(res).token
            },
            error: ()=>{
                console.log('❌ 获取 token 失败')
                token = false
            }
        })
        return token
    }
}