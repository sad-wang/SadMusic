{
    let view = {
        el:'.fileLists',
        template:`<input class="file-input" style="display: none" name="selected" type="file" id="selected"/>`,
    }
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.initQiniu()
            this.createFileInput(view)
        },
        createFileInput(view){
            document.querySelector('.upload').onclick=()=>{
                $(view.el).append(view.template).children('.file-input:last-child').click().change(()=>{
                    window.eventHub.emit('fileUpdate', {files:$(view.el).children('.file-input')})
                })
            }
        },
        initQiniu(){
            $.ajax({url: "http://192.168.0.108:9000/uptoken", success: function(res){
                    let token = JSON.parse(res).uptoken
                    let domain = 'q4nj29ews.bkt.clouddn.com'
                    let url
                    let config = {
                        useCdnDomain: true,
                        disableStatisticsReport: false,
                        retryCount: 6,
                        region: null
                    };
                    let putExtra = {
                        fname: "",
                        params: {},
                        mimeType: null
                    };
                    console.log(JSON.parse(res).uptoken)
                    let uploadWithSDK = function (e) {
                        e.stopPropagation()
                        let subscription
                        let observable
                        let observer = {
                            next(res){
                                // ...
                                console.log('ing')
                            },
                            error(err){
                                // ...
                            },
                            complete(res){
                                // ...
                                url='http://'+domain+'/'+encodeURI(res.key)
                                console.log('upload complete')
                               window.eventHub.emit('upload',{url:url})
                            }
                        }
                        let file = document.querySelector('#selected').files[0]
                        let key = file.name
                        observable = qiniu.upload(file, key, token, putExtra, config)
                        subscription = observable.subscribe(observer)
                    }
                    $('#upload').click(uploadWithSDK);

                }})
        }
    };
    controller.init(view,model)
}