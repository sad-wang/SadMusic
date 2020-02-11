{
    let view = {
        el:'#uploadLists',
        template:`
            <li class="item item-title">
                <div class="item-file">文件</div>
                <div class="item-song_name">歌名</div>
                <div class="item-singer">歌手</div>
                <div class="item-album">专辑</div>
                <div class="item-action">
                   操作
                </div>
            </li>
             <input style="display: none"  type="file"/>
        `,
        songTemplate:`            
            <li class="item">
                <input class="item-file" value="__file_name__">
                <input class="item-song_name" value="__song_name__">
                <input class="item-singer" value="__singer__">
                <input class="item-album" value="__album__">
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
            let html = this.template
            let placeholders = ['file_name', 'song_name', 'singer', 'album']
            for(let index in data.songLists){
                html += this.songTemplate
                placeholders.map((string)=>{
                    html = html.replace(`__${string}__`,data.songLists[index][string])
                })
            }
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            songLists: []
        },
        createSong(file){
            this.data.songLists.push({
                    file: file,
                    file_name: file.name,
                    song_name: '',
                    singer: '',
                    album: '',
                    url: 'http://q4nj29ews.bkt.clouddn.com/' + encodeURI(file.name)
            })
        },
        setSong(index,attr,value){
            this.data.songLists[index][attr] = value
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data);
            window.eventHub.on('uploadSong',()=>{
                this.createSong()
            });
        },
        createSong(){
            $('input[type="file"]').click().change((e)=>{
                let file = e.target.files[0]
                if (file.name){
                    this.model.createSong(file)
                }
                this.view.render(this.model.data)
                this.bindEvent()
            })
        },
        bindEvent(){
            for (let index in this.model.data.songLists){
                this.bindInputEvent(['song_name','singer','album'],index)
                this.bindUpload(index)
                this.bindDelete(index)
           }
        },
        bindUpload(index){
            $('.upload-icon')[index].onclick=()=>{
                let song = this.model.data.songLists[index]
                let songWithoutFileAndFile_name = JSON.parse(JSON.stringify(song));
                delete songWithoutFileAndFile_name.file
                delete songWithoutFileAndFile_name.file_name
                this.uploadSong(
                    '9000','q4nj29ews.bkt.clouddn.com',song.file,
                    'song_list',Object.assign({},songWithoutFileAndFile_name)
                )
            }
        },
        bindDelete(index){
            $('.delete-icon')[index].onclick=()=>{
                this.model.data.songLists = this.model.data.songLists.filter(function(){
                    let i = arguments[1]
                    return i != index ;
                });
                this.view.render(this.model.data)
                this.bindEvent()
            }
        },
        bindInputEvent(data,index){
            data.map((string)=>{
                $('input.item-'+string)[index].onchange=(e)=>{
                    this.model.setSong(index,string,e.target.value)
                }
            })
        },
        uploadSong(port,domain,file,table_name,data){
            this.qiniuUpload(port,domain,file)
            this.leancloudUpload(table_name,data)
        },
        qiniuUpload(port,domain,file){
            this.qiniuInit(port,domain,file)
            qiniu.upload(this.file, this.key, this.token, this.putExtra, this.config).subscribe(this.observer)
        },
        leancloudUpload(table_name,data){
            this.leancloudInit()
            this.leancloudInsert(table_name,data)
        },
        leancloudInsert(table_name,data){
            let tableClass = AV.Object.extend(table_name)
            let tableObject = new tableClass()
            tableObject.set(data)
            tableObject.save()
        },
        leancloudInit(){
            if(!AV.applicationId){
                AV.init({
                    appId: "NfptNwamDHA9VDTGMiSaSAFy-gzGzoHsz",
                    appKey: "KA6pShPTmYEhxNWRulVHYcrF",
                    serverURLs: "https://nfptnwam.lc-cn-n1-shared.com"
                })
            }
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
                async: false,
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