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
            this.bindUploadIcon(index)
            this.bindDeleteIcon(index)
        },
        bindUploadIcon(index){
            $('.item[data-index='+index+']').children('.item-action').children('.upload-icon')[0].onclick=()=>{
                let file = $('.file-input[data-index='+index+']')[0].files[0]
                let song = $('.item[data-index='+index+']')
                this.uploadSong('9000','q4nj29ews.bkt.clouddn.com',file,
                    'song_list',{
                        song_name: song.children('.item-name')[0].value,
                        song_singer:song.children('.item-singer')[0].value,
                        song_album:song.children('.item-album')[0].value,
                        song_url:'http://q4nj29ews.bkt.clouddn.com/' + encodeURI(file.name),
                    })
            }
        },
        bindDeleteIcon(index){
            $('.item[data-index='+index+']').children('.item-action').children('.delete-icon')[0].onclick=()=>{
                this.deleteSong(index)
            }
        },
        deleteSong(index){
            $('.item[data-index='+index+']').remove()
            $('.file-input[data-index='+index+']').remove()
        },
        uploadSong(port,domain,file,table,data){
            this.qiniuUpload(port,domain,file)
            this.leancloudUpload(table,data)
        },
        qiniuUpload(port,domain,file){
            this.qiniuInit(port,domain,file)
            qiniu.upload(this.file, this.key, this.token, this.putExtra, this.config).subscribe(this.observer)
        },
        leancloudUpload(table,data){
            this.leancloudInit()
            this.leancloudInsert(table,data)
        },
        leancloudInsert(table,data){
            let tableClass = AV.Object.extend(table)
            let tableObject = new tableClass()
            tableObject.set(data)
            tableObject.save()
        },
        leancloudInit(){
            AV.init({
                appId: "NfptNwamDHA9VDTGMiSaSAFy-gzGzoHsz",
                appKey: "KA6pShPTmYEhxNWRulVHYcrF",
                serverURLs: "https://nfptnwam.lc-cn-n1-shared.com"
            });
        },
        qiniuInit(port,domain,file){
            this.token = this.getToken(port)
            this.domain = domain
            this.file = file
            this.key = file.name
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
            this.observer = {
                next(res){
                    console.log(file.name +' is uploading~')
                },
                error(err){
                    console.log(file.name + ' upload failed!')
                    console.log(err.message)
                },
                complete(res){
                    let fileUrl = 'http://' + domain + '/' + encodeURI(res.key)
                    console.log(file.name + 'was upload completed!')
                    console.log(file.name + ' url: '+  fileUrl)
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