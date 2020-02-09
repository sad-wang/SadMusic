{
    let view = {
            el:'#uploadLists',
        template:`
            <li class="item item-title">
                <div class="item-file">文件</div>
                <div class="item-name">歌名</div>
                <div class="item-singer">歌手</div>
                <div class="item-album">专辑</div>
                <div class="item-action">
                   操作
                </div>
            </li>
        `,
        fileinputTemplate:` 
            <input class="file-input" style="display: none" name="selected" type="file" id="selected"/>
        `,
        itemTemplate:`            
            <li class="item">
                <input class="item-file" value="__name__">
                <input class="item-name" value="">
                <input class="item-singer" value="">
                <input class="item-album" value="">
                <div class="item-action">
                    <svg class="icon upload-icon" aria-hidden="true" >
                        <use xlink:href="#icon-shangchuan"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </div>
            </li> 
           
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            view.render(model.data);
            window.eventHub.on('fileUpdate',()=>{
                this.createFileInput(view)
            });
        },
        createFileInput(view) {
            $(view.el).append(view.fileinputTemplate).children('.file-input:last-child').click().change(()=>{
                this.createListsItem(view)
            })
        },
        createListsItem(view){
            $(view.el).append(view.itemTemplate.replace(`__name__`,$('.file-input:last')[0].files[0].name))
            let index = $('.file-input').length-1
            $('.upload-icon:last')[0].onclick=()=>{
                this.initQiniu($('.file-input')[index].files[0])
            }
        },
        initQiniu(file){
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
                    // console.log(JSON.parse(res).uptoken)
                    let uploadWithSDK = function () {

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
                            }
                        }
                        let key = file.name
                        observable = qiniu.upload(file, key, token, putExtra, config)
                        observable.subscribe(observer)
                    }()
                    // $('#upload').click(uploadWithSDK);
                }})
        },

    }
    controller.init(view,model)
}