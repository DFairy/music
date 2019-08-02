<template>
  <transition appear name="slide">
    <music-list  :title="title" :bg-image="bgImage" :songs="songs" :rank='rank'></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
export default {
    components:{
        MusicList
    },
    data(){
        return{
            songs: [],
            rank:true
        }
    },
    computed:{
        title () {
            return this.topList.topTitle
        },
        bgImage () {
            if (this.songs.length) {
                return this.songs[0].image
            }
            return ''
        },
        ...mapGetters([
            'topList'
        ])
    },
    created(){
        this._getMusicList()
    },
    methods:{
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
}
</script>

<style lang='less' scoped>
.slide-enter-active,.slide-leave-active{
    transition: all 0.3s
}
.slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0)
}
</style>