{
    let view = {
        el:'.top',
        template:`
            <h1>SAD MUSIC &nbsp&nbsp</h1>
            <div class="upload" id="upload1" >
                <svg class="icon" aria-hidden="true" >
                    <use xlink:href="#icon-shangchuan"></use>
                </svg>
                上传音乐
            </div>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {};
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.uploadSong()
        },
        uploadSong(){
            document.querySelector('.upload').onclick=()=>{
                window.eventHub.emit('displayUploadLists',{})
                window.eventHub.emit('uploadSong', {})
            }
        },
    };
    controller.init(view,model)
}