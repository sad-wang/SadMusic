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
            <input class="file-input" style="display: none" name="selected" type="file" id="selected" data-index="__index__"/>
        `,
        itemTemplate:`            
            <li class="item" data-index="__index__">
                <input class="item-file" value="__name__">
                <input class="item-name" value="">
                <input class="item-singer" value="">
                <input class="item-album" value="">
                <div class="item-action">
                    <svg class="icon upload-icon" aria-hidden="true" >
                        <use xlink:href="#icon-shangchuan"></use>
                    </svg>
                    <svg class="icon delete-icon" aria-hidden="true">
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
        createFileInput(view) {//view.fileinputTemplate.replace(/[^0-9]/g,'')
            let index =$('.file-input:last').attr('data-index')===undefined ? 0 : $('.file-input:last').attr('data-index')-0+1
            $(view.el).append(view.fileinputTemplate.replace(`__index__`,index)).children('.file-input[data-index='+index+']').click().change(()=>{
                this.createListsItem(view,index)
            })
        },
        createListsItem(view,index){
            $(view.el).append(view.itemTemplate.replace(`__name__`,$('.file-input[data-index='+index+']')[0].files[0].name).replace(`__index__`,index))
            this.uploadIcon(index)
            this.deleteIcon(index)
        },
        uploadIcon(index){
            $('.item[data-index='+index+']').children('.item-action').children('.upload-icon')[0].onclick=()=>{
                this.uploadSong('9000','q4nj29ews.bkt.clouddn.com',$('.file-input[data-index='+index+']')[0].files[0])
            }
        },
        deleteIcon(index){
            $('.item[data-index='+index+']').children('.item-action').children('.delete-icon')[0].onclick=()=>{
                this.deleteSong(index)
            }
        },
        deleteSong(index){
            $('.item[data-index='+index+']').remove()
            $('.file-input[data-index='+index+']').remove()
        },
        uploadSong(port,domain,file){
            this.qiniuConfig(port,domain,file)
            qiniu.upload(this.file, this.key, this.token, this.putExtra, this.config).subscribe(this.observer)
        },
        qiniuConfig(port,domain,file){
            this.token = this.getToken(port)
            this.domain = domain
            this.file = file
            this.config = {
                useCdnDomain: true,
                disableStatisticsReport: false,
                retryCount: 6,
                region: null
            }
            this.putExtra = {
                fname: "",
                params: {},
                mimeType: null
            }
            this.key = this.file.name
            this.observer = {
                next(res){
                    console.log(this.key+'uploading~')
                },
                error(err){
                    console.log(this.key+'upload failed!')
                },
                complete(res){
                    let fileUrl = 'http://' + domain + '/' + encodeURI(res.key)
                    console.log(fileUrl)
                    console.log(this.key+'upload completed!')
                }
            }
        },
        getToken(port){
            let token
            $.ajax({
                async :false,
                url: 'http://127.0.0.1:'+port+'/token',
                success: function(res){
                    token = JSON.parse(res).token
                }
            })
            return token
        },
    }
    controller.init(view,model)
}