{
    let view = {
        el:'.fileLists',

    }
    let model = {};
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.createFileInput(view)
        },
        createFileInput(view){
            document.querySelector('.upload').onclick=()=>{
                    window.eventHub.emit('fileUpdate', {})
            }
        },

    };
    controller.init(view,model)
}