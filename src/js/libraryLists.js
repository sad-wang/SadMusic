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
        itemTemplate: `
            <li class="item">
                <div class="item-song_name">Dear God Remix</div>
                <div class="item-singer">Buzzy</div>
                <div class="item-album">Dear God Remix</div>
                <div class="item-url">03:10</div>
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
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}