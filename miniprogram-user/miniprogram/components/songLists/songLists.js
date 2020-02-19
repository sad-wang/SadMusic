// components/songLists.js
const db = wx.cloud.database()
Component({
  properties: {
    songListsData:{
      type:Object
    }
  },
  data: {
    title: '',
    subtitle: '',
    songLists: [],
    info: '',

    songsData: []
  },
  attached: function() {
    console.log(1)
    this.setData({
      ...this.data.songListsData
    })
    this.initSongsData()
  },
  methods:{
    initSongsData:function(){
      this.data.songLists.map((song)=>{
        db.collection('song_list').where({_id:song}).get().then((res)=>{
          let songsData = this.data.songsData
          songsData.push(res.data[0])
          this.setData({
            songsData: songsData
          })
          console.log(this.data.songsData)
        })
      })
    },
    playingSongs:function(e){
      let detail={
        index:e.currentTarget.dataset.index,
        songLists:this.data.songLists,
      }
      this.triggerEvent('updateListsAndPlayingIt', detail, {capturePhase:true,bubbles: true, composed: true})
    },

  }
})
