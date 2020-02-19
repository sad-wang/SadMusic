//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    index:true,
    bottomBar:true,
    songLists:false,
    playing:false,

    avatarUrl:'../../images/user-unlogin.png',
    userInfo:{},
    logged:false,

    recommendLists:[],
    favoritesLists: [],

    songListsData:{
      title:'',
      subtitle:'',
      songLists:[],
      info:'',
    },

    playingData: {
      songLists: [],
      playingState: false,
      cycleWay: '',
      index: 0
    }
  },
  onLoad: function() {
    this.getKnownUserInfo()
    this.getRecommendLists()
    this.getUserFavoritesLists()
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
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  getUserFavoritesLists:function(){
    db.collection('user').where({_openid: app.globalData.openid}).get().then((res)=>{
      this.setData({
        favoritesLists: res.data[0].favorites
      })
    })
  },
  getRecommendLists:function(){
    db.collection('recommend').get().then((res)=>{
      let result = res.data
      result.map((item)=>{
        let date = item.date
        date = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + date.getDate()
        item.date = date
        Object.assign(item,{count:item.songs.length})
      })
      this.setData({
        recommendLists: result
      })
    })
  },
  showSongLists:function(){
    this.setData({
        bottomBar:true,
        songLists:true,
        playing:false,
        index:false,
    })
  },
  toFavorites:function() {
    this.setData({
      songListsData:{
        title:'Favorites',
        subtitle:this.data.userInfo.nickName,
        songLists:this.data.favoritesLists,
        info:'favorites',
      },
    })
    this.showSongLists()
  },
  toRecommend:function(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      songListsData:{
        title:this.data.recommendLists[index].date,
        subtitle:this.data.recommendLists[index].keywords,
        songLists:this.data.recommendLists[index].songs,
        info:'recommend',
      },
    })
    this.showSongLists()
  },
  updateListsAndPlayingIt:function (e) {
    this.setData({
      playingData: {
        songLists: e.detail.songLists,
        playingState: this.data.playingData.playingState,
        cycleWay: this.data.playingData.cycleWay,
        index: e.detail.index,
      }
    })
  }



})
