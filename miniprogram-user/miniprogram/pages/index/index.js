//index.js
const app = getApp()
Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    recommendLists:[],
  },
  navTo(url){
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function() {
    this.getKnownUserInfo()
    this.getRecommendLists()
  },
  getKnownUserInfo:function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getRecommendLists:function(){
    const db = wx.cloud.database()
    db.collection('recommend').get().then(function(res) {
      this.setData({
        recommendLists: res.data
      })
    }.bind(this))
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
})
