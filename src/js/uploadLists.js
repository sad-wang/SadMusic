{
    let view = {
        el:'#uploadLists',
        template:`
            <li class="item item-title">
                    <div class="item-name">歌名</div>
                    <div class="item-singer">歌手</div>
                    <div class="item-album">专辑</div>
                    <div class="item-duration">时长</div>
                    <div class="item-action">
                       操作
                    </div>
                </li>
                <li class="item">
                    <input class="item-name" value="Dear God Remix">
                    <input class="item-singer" value="Buzzy">
                    <input class="item-album" value="Dear God Remix">
                    <input class="item-duration" value="3:10">
                    <div class="item-action">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bianji"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shangchuan"></use>
                        </svg>
                    </div>
                </li>                
                <li class="item">
                    <input class="item-name" value="Dear God Remix">
                    <input class="item-singer" value="Buzzy">
                    <input class="item-album" value="Dear God Remix">
                    <input class="item-duration" value="3:10">
                    <div class="item-action">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bianji"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-shangchuan"></use>
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
            window.eventHub.on('upload',(data)=>{
                console.log(data)
            })
            window.eventHub.on('fileUpdate',(data)=>{
                console.log(data.files[0].files[0])
            })
        }
    }
    controller.init(view,model)
}