//app.js
App({
  eventHub:{
    events:{},
    emit(eventName,data){
      for (let key in this.events){
        if (key === eventName){
          let fnList = this.events[key];
          fnList.map((fn)=>{
            fn.call(undefined,data)
          })
        }
      }
    },
    on(eventName,fn){
      if (this.events[eventName] === undefined)
        this.events[eventName] = []
      this.events[eventName].push(fn)
    },
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
      traceUser: true,
      })
    }
    this.globalData = {}
    this.onGetOpenid()
  },
  onGetOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})
