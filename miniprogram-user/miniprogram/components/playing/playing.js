Component({
  properties: {
    playingData:{
      type:Object
    }
  },
  attached: function() {
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
  }
})
