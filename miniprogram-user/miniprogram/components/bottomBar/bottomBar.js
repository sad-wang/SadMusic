// components/bottomBar.js
Component({
  properties: {
    playingData:{
      type: Object
    },
  },
  data: {
  },
  lifetimes: {
    created: function(){
    },
    attached: function () {
    },
  },
  pageLifetimes: {
    show: function () { },
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
    toPlaying(){
      this.triggerEvent('toPlaying',{}, {capturePhase:true,bubbles: true, composed: true})
    }
  },
})
