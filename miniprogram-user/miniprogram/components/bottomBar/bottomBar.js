// components/bottomBar.js
const audio = wx.getBackgroundAudioManager()
Component({
  properties: {
    detail:{
      type: Object
    },
    playingShow:{
      type: Boolean
    },
  },
  data: {
    songLists:[],
    index:null,
    way:'',
    state:null,
  },
  lifetimes: {
    created: function(){
    },
    attached: function () {
      this.setData({
        playingShow:true
      })
      audio.onEnded(()=>{
            this.setData({
              index:(this.data.index+1)%this.data.songLists.length,
              state:1
            })
            wx.cloud.getTempFileURL({fileList:[{fileID:this.data.songLists[this.data.index].url}]}).then((res)=>{
              audio.src = encodeURI(res.fileList[0].tempFileURL)
            })
      }
      )
    },
  },
  pageLifetimes: {
    show: function () { },
  },
  methods: {
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
      this.setData({
        index:((this.data.index-1)+this.data.songLists.length)%this.data.songLists.length,
        state:1
      })
      wx.cloud.getTempFileURL({fileList:[{fileID:this.data.songLists[this.data.index].url}]}).then((res)=>{
        audio.src = encodeURI(res.fileList[0].tempFileURL)
      })
    },
    next(){
      this.setData({
        index:(this.data.index+1)%this.data.songLists.length,
        state:1
      })
      wx.cloud.getTempFileURL({fileList:[{fileID:this.data.songLists[this.data.index].url}]}).then((res)=>{
        audio.src = encodeURI(res.fileList[0].tempFileURL)
      })
    },
    toPlaying(){
      this.setData({
        toPlaying: true
      })
      this.triggerEvent('showPlaying', {
        songLists:this.data.songLists,
        index:this.data.index,
        way:this.data.way,
        state:this.data.state,
      }, {capturePhase:true,bubbles: true, composed: true})
    }
  },
  observers: {
    'detail': function() {
      if (this.data.playingShow){
        this.setData({
          ...this.data.detail,
          state:1
        })
        wx.cloud.getTempFileURL({fileList:[{fileID:this.data.songLists[this.data.index].url}]}).then((res)=>{
          audio.title = '此时此刻'
          audio.epname = '此时此刻'
          audio.singer = '许巍'
          audio.coverImgUrl = ''
          audio.src = encodeURI(res.fileList[0].tempFileURL)
        })
      }
    },
  }
})
