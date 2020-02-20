Component({
  properties: {
    playingData:{
      type:Object
    }
  },
  attached: function () {
  },
  data: {
  },
  methods: {
    previous(){
      this.triggerEvent('previous',{}, {capturePhase:true,bubbles: true, composed: true})
    },
    next(){
      this.triggerEvent('next',{}, {capturePhase:true,bubbles: true, composed: true})
    },
    pause(){
      this.triggerEvent('PlayOrPause',{}, {capturePhase:true,bubbles: true, composed: true})
    },
    backToIndex(){
      this.triggerEvent('backToIndex', {}, {capturePhase:true,bubbles: true, composed: true})
    },
    changeCycleWay(){
      this.triggerEvent('changeCycleWay', {}, {capturePhase:true,bubbles: true, composed: true})
    },
    addToFavorites(){
      this.triggerEvent('updateFavorites', {}, {capturePhase:true,bubbles: true, composed: true})
    }
  },
})
