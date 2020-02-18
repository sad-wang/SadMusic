// components/bottomBar.js
Component({
  properties: {
    detail:{
      type:Object
    }
  },
  data: {
    songLists:[],
    index:'',
    way:'',
  },
  lifetimes: {
    attached: function () {
      let audio = wx.createInnerAudioContext()
      audio.src='cloud://sad-music.7361-sad-music-1301301671/songs/朴树-她在睡梦中.mp3'
      audio.play()
      audio.pause()
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  methods: {
    updatePlaying(){
      console.log(1)
    }
  },
  observers: {
    'detail': function() {
      this.setData({
        ...this.data.detail
      })
    }

  }
})
