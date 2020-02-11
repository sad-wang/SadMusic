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
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu"></use>
                    </svg>
                </div>
            </li>
        `,
        render(data){
            let html = this.template
            let placeholders = ['song_name','singer','album','url']
            for(let index in data.libraryLists){
                html += this.songTemplate
                placeholders.map((string)=>{
                    html = html.replace(`__${string}__`,data.libraryLists[index][string])
                })
            }
            $(this.el).html(html)
        }
    }
    let model = {
        data: {
            libraryLists: [
                // {
                //     song_name: 1,
                //     singer: 2,
                //     album: 3,
                //     url: 4,
                // },
            ]
        },
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getLibraryLists()
        },
        getLibraryLists(){
            this.leancloudInit()
            let query = new AV.Query('song_list')
            let querySelect = ['song_name', 'singer','album','url',]
            query.select(querySelect)
            query.find().then(function(results) {

                let queryResult = results.map((obj) => {
                    return obj.attributes
                })
                console.log(this.model.data.libraryLists)
                this.model.data.libraryLists = queryResult
                this.view.render(this.model.data)
            }.bind(this), function(error) {
                console.log('error: '+error)
            });

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