//index.js
const app = getApp()
const db = wx.cloud.database()
const audio = wx.getBackgroundAudioManager()
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
      songsData: [],
      playingState: false,
      cycleWay: 'recyclePlay',
      index: 0,
      albumUrl:'',
      songUrl:'',
      liked:false,
    }
  },
  onLoad: function() {
    this.getKnownUserInfo()
    this.getRecommendLists()
    this.getUserFavoritesLists()
    audio.onEnded(()=>{
      let way = {
        'recyclePlay':1,
        'singlePlay': 0,
        'randomPlay':Math.round(Math.random()*this.data.playingData.songsData.length)
      }
      let cycleWay = this.data.playingData.cycleWay
      this.setData({
        playingData: {
          songsData:this.data.playingData.songsData,
          playingState: this.data.playingData.playingState,
          cycleWay: this.data.playingData.cycleWay,
          index: (this.data.playingData.index+way[cycleWay])%this.data.playingData.songsData.length,
          albumUrl:this.data.playingData.albumUrl,
          songUrl:this.data.playingData.songUrl,
          liked:this.data.playingData.liked
        }
      })
      this.playing()
    })
    audio.onError(()=>{
      this.next()
    })
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
      if(res.data==false){
        db.collection('user').add({
          data: {
            favorites:[]
          },
          success: function(res) {
            console.log(res)
          }
        })
        this.setData({
          favoritesLists: []
        })
      }else {
        this.setData({
          favoritesLists: res.data[0].favorites
        })
      }
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
        songsData: e.detail.songsData,
        playingState: this.data.playingData.playingState,
        cycleWay: this.data.playingData.cycleWay,
        index: e.detail.index,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:this.data.playingData.liked
      }
    })
    this.playing()
  },
  backToIndex(){
    this.setData({
      bottomBar:true,
      songLists:false,
      playing:false,
      index:true,
    })
  },
  playing(){
    let song_id = this.data.playingData.songsData[this.data.playingData.index]._id
    let favoritesLists = this.data.favoritesLists
    let liked
    if(favoritesLists.includes(song_id)){
      liked = true
    }else {
      liked = false
    }
    this.setData({
      playingData: {
        songsData:this.data.playingData.songsData,
        playingState: this.data.playingData.playingState,
        cycleWay: this.data.playingData.cycleWay,
        index: this.data.playingData.index,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:liked
      }
    })
    let song = this.data.playingData.songsData[this.data.playingData.index]
    audio.title = song.song_name
    audio.epname = song.album.name
    audio.singer = song.singer
    wx.cloud.getTempFileURL({fileList:[{fileID: song.url},{fileID: song.album.url}]}).then((res)=>{
      this.setData({
        playingData: {
          songsData:this.data.playingData.songsData,
          playingState: true,
          cycleWay: this.data.playingData.cycleWay,
          index: this.data.playingData.index,
          albumUrl: encodeURI(res.fileList[1].tempFileURL),
          songUrl: encodeURI(res.fileList[0].tempFileURL),
          liked:this.data.playingData.liked
        }
      })
      audio.coverImgUrl = encodeURI(res.fileList[1].tempFileURL)
      audio.src = encodeURI(res.fileList[0].tempFileURL)
    })
  },
  pause(){
    audio.pause()
    this.setData({
      playingData: {
        songsData:this.data.playingData.songsData,
        playingState: false,
        cycleWay: this.data.playingData.cycleWay,
        index: this.data.playingData.index,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:this.data.playingData.liked
      }
    })
  },
  next(){
    this.setData({
      playingData: {
        songsData:this.data.playingData.songsData,
        playingState: this.data.playingData.playingState,
        cycleWay: this.data.playingData.cycleWay,
        index: (this.data.playingData.index+1)%this.data.playingData.songsData.length,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:this.data.playingData.liked
      }
    })
    this.playing()
  },
  previous(){
    this.setData({
      playingData: {
        songsData:this.data.playingData.songsData,
        playingState: this.data.playingData.playingState,
        cycleWay: this.data.playingData.cycleWay,
        index: (this.data.playingData.index - 1 + this.data.playingData.songsData.length) % this.data.playingData.songsData.length,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:this.data.playingData.liked
      }
    })
    this.playing()
  },
  PlayOrPause(){
    if (this.data.playingData.playingState){
      this.pause()
    }else {
      this.playing()
    }
  },
  toPlaying(){
    this.setData({
      bottomBar:false,
      songLists:false,
      playing:true,
      index:false,
    })
  },
  changeCycleWay(){
    let way = {
      'recyclePlay':'singlePlay',
      'singlePlay': 'randomPlay',
      'randomPlay':'recyclePlay'
    }
    this.setData({
      playingData: {
        songsData:this.data.playingData.songsData,
        playingState: this.data.playingData.playingState,
        cycleWay: way[this.data.playingData.cycleWay],
        index: this.data.playingData.index,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:this.data.playingData.liked
      }
    })
  },
  updateFavorites(){
    let song_id = this.data.playingData.songsData[this.data.playingData.index]._id
    let favoritesLists = this.data.favoritesLists
    let liked
    if(favoritesLists.includes(song_id)){
      favoritesLists.splice(favoritesLists.indexOf(song_id),1)
      liked = false
    }else {
      favoritesLists.push(song_id)
      liked = true
    }
    this.setData({
      favoritesLists: favoritesLists,
      playingData: {
        songsData:this.data.playingData.songsData,
        playingState: this.data.playingData.playingState,
        cycleWay: this.data.playingData.cycleWay,
        index: this.data.playingData.index,
        albumUrl:this.data.playingData.albumUrl,
        songUrl:this.data.playingData.songUrl,
        liked:liked
      }
    })
    db.collection('user').where({_openid: app.globalData.openid}).get().then(res=>{
      db.collection('user').doc(res.data[0]._id).update({
        data: {
          favorites: this.data.favoritesLists
        },
      }).then((res)=>{
        console.log(res)
      },error=>{
        console.log(error)
      })
    })
  }
})
