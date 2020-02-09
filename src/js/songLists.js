{
    let view = {
        el:'#libraryLists',
        template:`
        <li class="item item-title">
                    <div class="item-name">歌名</div>
                    <div class="item-singer">歌手</div>
                    <div class="item-album">专辑</div>
                    <div class="item-url">链接</div>
                    <div class="item-action">
                        操作
                    </div>
                </li>
                <li class="item">
                    <div class="item-name">Dear God Remix</div>
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
                <li class="item">
                    <div class="item-name">完美生活</div>
                    <div class="item-singer">许巍</div>
                    <div class="item-album">时光·漫步</div>
                    <div class="item-url">04:56</div>
                    <div class="item-action">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bianji"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </div>
                </li>
                <li class="item">
                    <div class="item-name">我爱你，再见</div>
                    <div class="item-singer">朴树</div>
                    <div class="item-album">生如夏花</div>
                    <div class="item-url">03:57</div>
                    <div class="item-action">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bianji"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </div>
                </li>
                <li class="item">
                    <div class="item-name">生如夏花</div>
                    <div class="item-singer">朴树</div>
                    <div class="item-album">生如夏花</div>
                    <div class="item-url">03:57</div>
                    <div class="item-action">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bianji"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </div>
                </li>
                <li class="item">
                    <div class="item-name">她在睡梦中</div>
                    <div class="item-singer">朴树</div>
                    <div class="item-album">生如夏花</div>
                    <div class="item-url">03:57</div>
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