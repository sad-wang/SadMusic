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
        render(data){
            $(this.el).html(this.template)
        },
    }
    let model = {
        data: {
            displayingList: 'libraryLists'
        },
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvent()
        },
        bindEvent(){
            $(this.view.el + ' .tab').map((index)=>{
                $(this.view.el + ' .tab')[index].onclick = (e)=>{
                    $(this.view.el +  ' .tab').removeClass('active')
                    $(this.view.el +' .tab')[index].classList.add('active')
                    $(this.view.el + ' .lists-items').addClass('none')
                    $(this.view.el + ' .lists-items')[index].classList.remove("none")
                }
            })
        }
    }
    controller.init(view,model)
}