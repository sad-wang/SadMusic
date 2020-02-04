{
    let view = {
        el:'.upload',
    }
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.initQiniu()
        },
        initQiniu(){
            $.ajax({url: "http://192.168.0.108:9000/uptoken", success: function(res){
                    var token = JSON.parse(res).uptoken
                    var domain = 'q4nj29ews.bkt.clouddn.com'
                    var url
                    var config = {
                        useCdnDomain: true,
                        disableStatisticsReport: false,
                        retryCount: 6,
                        region: null
                    };
                    var putExtra = {
                        fname: "",
                        params: {},
                        mimeType: null
                    };
                    console.log(JSON.parse(res).uptoken)
                    var uploadWithSDK = function (e) {

                        e.stopPropagation()
                        var subscription
                        var observable
                        var observer = {
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
                        var file = document.querySelector('#selected').files[0]
                        var key = file.name
                        observable = qiniu.upload(file, key, token, putExtra, config)
                        subscription = observable.subscribe(observer)
                    }
                    $('#upload').click(uploadWithSDK);

                }})
        }
    };
    controller.init(view,model)
}