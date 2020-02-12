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
                    <svg class="icon edit-icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                    <svg class="icon delete-icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </div>
            </li>
        `,
        render(data){
            let html = this.template
            let placeholders = ['song_name','singer','album','url']
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
            songLists: [
                // {
                //     song_name: 1,
                //     singer: 2,
                //     album: 3,
                //     url: 4,
                // },
            ]
        },
        getSongLists(){
            let query = new AV.Query('song_list')
            let querySelect = ['song_name', 'singer','album','url',]
            query.select(querySelect)
            return query.find().then(function(results) {
                this.data.songLists = results.map((obj) => {
                    return obj.attributes
                })
            }.bind(this), function(error) {
                console.log('查询 songLists 失败: ' + error)
            });
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.leancloudInit()
            this.getSongLists()
        },
        getSongLists() {
            this.model.getSongLists().then(()=>{
                this.view.render(this.model.data)
                this.bindEvent()
            })
        },
        bindEvent() {
            for (let index in this.model.data.songLists){
                this.bindEdit(index)
                console.log('for')
                this.bindDelete(index)
            }
        },
        bindEdit(index) {

        },
        bindDelete(index) {
            console.log(this.view.el + ' > .delete-icon')
            $(this.view.el + ' .delete-icon')[index].onclick=()=>{
                console.log(index)
                this.model.data.songLists = this.model.data.songLists.filter(function(){
                    let i = arguments[1]
                    return i != index ;
                });
                this.view.render(this.model.data)
                this.bindEvent()
            }
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