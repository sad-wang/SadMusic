{
    let view = {
        el:'#libraryLists',
        template:`
            <li class="item item-title">
                <div class="item-song_name">歌名</div>
                <div class="item-singer">歌手</div>
                <div class="item-album">专辑</div>
                <div class="item-url">链接</div>
                <div class="item-action">
                    操作
                </div>
            </li>
        `,
        songTemplate: `
            <li class="item">
                <div class="item-song_name">__song_name__</div>
                <div class="item-singer">__singer__</div>
                <div class="item-album">__album__</div>
                <div class="item-url">__url__</div>
                <div class="item-action">
                <!--编辑功能来日方长-->
                    <svg class="icon edit-icon" aria-hidden="true" display="none">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                    <svg class="icon delete-icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </div>
            </li>
        `,
        emptyTemplate:`
            <div class="listsIsNull">
                <svg class="icon edit-icon" aria-hidden="true">
                    <use xlink:href="#icon-tuya-"></use>
                </svg>
                音乐库空啦！
            </div>
        `,
        render(data){
            let html = this.template
            let placeholders = ['song_name','singer','album','url']
            if(!data.songLists.length){
                html += this.emptyTemplate
            }
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
        init(){
            let query = new AV.Query('song_list')
            let querySelect = ['objectId','song_name', 'singer','album','url',]
            query.select(querySelect)
            return query.find().then(function(results) {
                this.data.songLists = results.map((obj) => {
                    return Object.assign(obj.attributes,{objectId:obj.id})
                })
            }.bind(this), function(error) {
                console.log('查询 songLists 失败: ' + error)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.leancloudInit()
            this.getLeanCloudLists()
            window.eventHub.on('getLeanCloudLists',()=>{
                this.getLeanCloudLists()
            })
        },
        getLeanCloudLists() {
            this.model.init().then(()=>{
                this.view.render(this.model.data)
                this.bindEvent()
            })
        },
        bindEvent() {
            for (let index in this.model.data.songLists){
                this.bindEdit(index)
                this.bindDelete(index)
            }
        },
        bindEdit(index) {},
        bindDelete(index) {
            $(this.view.el + ' .delete-icon')[index].onclick=()=>{
                this.qiniuDelete(this.model.data.songLists[index].song_name)
                this.leancloudDelete('song_list',this.model.data.songLists[index].objectId)
                this.model.data.songLists = this.model.data.songLists.filter(function(){
                    let i = arguments[1]
                    return i != index
                })
                this.view.render(this.model.data)
                this.bindEvent(/*此功能来日方长*/)
            }
        },
        qiniuDelete(key){
            $.ajax({
                url: 'http://127.0.0.1:9000/delete',
                type: 'post',
                data:{
                  key:key
                },
            })
        },
        leancloudDelete(table_name,objectId){
            let tableObject = AV.Object.createWithoutData(table_name, objectId)
            tableObject.destroy()
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
    }
    controller.init(view,model)
}