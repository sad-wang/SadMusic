// components/bottomBar.js
let audio = wx.createInnerAudioContext()
Component({
  properties: {
    detail:{
      type:Object
    }
  },
  data: {
    songLists:[],
    index:null,
    way:'',
    state:null
  },
  lifetimes: {
    attached: function () {},
  },
  pageLifetimes: {
    show: function () { },
  },
  methods: {
    updatePlaying(){
      console.log(1)
    },
    pause(){
      if(this.data.state){
        audio.pause()
        this.setData({
          state:0
        })
      } else {
        audio.play()
        this.setData({
          state:1
        })
      }
    },
    previous(){
      audio.destroy()
      audio = wx.createInnerAudioContext()
      this.setData({
        index:((this.data.index-1)+this.data.songLists.length)%this.data.songLists.length
      })
      audio.src=this.data.songLists[this.data.index].url
      audio.play()
    },
    next(){
      audio.destroy()
      audio = wx.createInnerAudioContext()
      this.setData({
        index:(this.data.index+1)%this.data.songLists.length
      })
      audio.src=this.data.songLists[this.data.index].url
      audio.play()
    }
  },
  observers: {
    'detail': function() {
      this.setData({
        ...this.data.detail,
        state:1
      })
      audio.destroy()
      audio = wx.createInnerAudioContext()
      audio.src = this.data.songLists[this.data.index]?this.data.songLists[this.data.index].url:null
      audio.play()
    }
  }
})
