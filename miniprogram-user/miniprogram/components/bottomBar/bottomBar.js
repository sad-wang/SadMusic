// components/bottomBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // let audio = wx.createInnerAudioContext()
      // audio.src='cloud://sad-music.7361-sad-music-1301301671/songs/朴树-她在睡梦中.mp3'
      // audio.play()
    },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
