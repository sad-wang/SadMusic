{
    let view = {
        el:'.lists-tab',
        template:`
            <div class="library active" id="libraryTab" >音乐库</div>
            <div class="uploadable" id="uploadTab">上传列表</div>
               
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