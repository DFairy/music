<template>
<transition appear name="slide">
    <MusicList :title="title" :bgImage='bgImage' :songs='songs'></MusicList>
</transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import { getSingerDetail } from 'api/singer'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import { ERR_OK } from 'api/config'
export default {
    components:{
        MusicList
    },
    data(){
        return {
            songs:[]
        }
    },
    computed:{
        ...mapGetters([
            'singer'
        ]),
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.avatar
        }
    },
    created(){
       this._getDetail()
    },
    methods:{
        _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs
            })
              
          }
        })
      },
      _normalizeSongs(list){
          let ret=[]
          list.forEach((item) => {
              let {musicData}=item
              if(isValidMusic(musicData)){
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