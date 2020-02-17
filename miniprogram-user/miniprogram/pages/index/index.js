//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    recommendLists:[],
    count:''
  },
  navTo(url){
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function() {
    this.getKnownUserInfo()
    this.getRecommendLists()
    this.getUserFavoritesCount()
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
  // aa:function(){
  //   db.collection('user').add({
  //     data: {
  //       favorites:["a8bafbad-5f36-442c-b7ec-d22f73ef8f9a"]
  //     },
  //     success: function(res) {
  //       console.log(res)
  //     }
  //   })
  // },
  getUserFavoritesCount:function(){
    db.collection('user').where({_openid: app.globalData.openid}).get().then(function(res){
      this.setData({
        count: res.data[0].favorites.length
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
