{
    let view = {
        el:'.lists',
        template:`
                <div class="lists-tab">
                    <div class="tab library active" id="libraryTab" >音乐库</div>
                    <div class="tab uploadable" id="uploadTab">上传列表</div>
                </div>
                <ol class="lists-items" id="libraryLists" ></ol>
                <ol class="lists-items none" id="uploadLists"></ol>
        `,
        render(){
            $(this.el).html(this.template)
        },
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvent()
            window.eventHub.on('displayUploadLists',()=>{
                this.displayWhich('upload')
            })
        },
        bindEvent(){
            $('#libraryTab')[0].onclick = ()=>{
                this.displayWhich('library')
                window.eventHub.emit('getLeanCloudLists',{})
            }
            $('#uploadTab')[0].onclick = ()=>{
                this.displayWhich('upload')
            }
        },
        displayWhich(id){
            $(this.view.el +  ' .tab').removeClass('active')
            $(this.view.el + ' .lists-items').addClass('none')
            $(this.view.el +' #'+ id +'Tab').addClass('active')
            $(this.view.el + ' #'+ id +'Lists').removeClass("none")
        },
    }
    controller.init(view,model)
}