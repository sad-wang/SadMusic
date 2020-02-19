// components/playing/playing.js
const audio = wx.getBackgroundAudioManager()
Component({
  properties: {
    playingData:{
      type:Object
    }
  },
  attached: function() {
  },
  data: {
    songLists:[],
    index:'',
    name:'',
    singer:'',
    way:'',
  },
  methods: {
    playingInit:function (){
      this.setData({
        ...this.data.playingData
      })
      this.getAlbumUrl()
    },
    getAlbumUrl(){
      wx.cloud.getTempFileURL({fileList:[{fileID:this.data.songLists[this.data.index].album.url}]}).then((res)=>{
        this.setData({
          albumUrl:encodeURI(res.fileList[0].tempFileURL)
        })
      })
    },
    getSongUrl(){
      wx.cloud.getTempFileURL({fileList:[{fileID:this.data.songLists[this.data.index].url}]}).then((res)=>{
        audio.src = encodeURI(res.fileList[0].tempFileURL)
      })
    },
    backToIndex:function () {
      this.triggerEvent('back', {}, {capturePhase:true,bubbles: true, composed: true})
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
      this.setData({
        index:((this.data.index-1)+this.data.songLists.length)%this.data.songLists.length,
        state:1
      })
      this.getAlbumUrl()
      this.getSongUrl()
    },
    next(){
      this.setData({
        index:(this.data.index+1)%this.data.songLists.length,
        state:1
      })
      this.getAlbumUrl()
      this.getSongUrl()
    },
  }
})
