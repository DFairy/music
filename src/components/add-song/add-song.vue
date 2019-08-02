<template>
<transition name="slide">
   <div class="add-song" v-show="showFlag" @click.stop>
       <div class="header">
           <img src="../../common/image/back.png" @click="cancel" class="back" alt="">
           <h1>添加歌曲到列表</h1>
       </div>
       <div class="search-box-wrapper">
           <search-box  ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
       </div>
       <div class="shortcut" v-show='!query'>
           <Switches :switches='switches' :currentIndex="currentIndex" @switch="switchItem"></Switches>
           <div class="list-wrapper">
               <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
                   <div class="list-inner">
                       <song-list :songs="playHistory" @select="selectSong"></song-list>
                   </div>
               </scroll>
               <scroll ref="searchList" v-if="currentIndex===1" class="list-scroll" :data='searchHistory' :refreshDelay="refreshDelay">
                   <div class="list-inner">
                       <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
                   </div>
               </scroll>
           </div>
       </div>
       <div class="search-result" v-show='query'>
           <Suggest  :query='query' @listScroll="blurInput" :showSinger="showSinger" @select='selectSuggest'></Suggest>
       </div>
        <top-tip ref="topTip">
             <div class="tip-title">
                <img src="../../common/image/ok.png" alt="">
                <span class="text">1首歌曲已经添加到播放列表</span>
            </div>
        </top-tip>
   </div>
</transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import {searchMixin} from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import Song from 'common/js/song'
export default {
    mixins:[searchMixin],
    components:{
        SearchBox,
        Suggest,
        Switches,
        Scroll,
        SongList,
        SearchList,
        TopTip
    },
    data(){
        return{
            showFlag:false,
            showSinger:false,
            currentIndex:0,
            switches: [
                {
                    name: '最近播放'
                },
                {
                    name: '搜索历史'
                }
            ]
        }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods:{
        show(){
            this.showFlag=true
        },
        cancel(){
            this.showFlag=false
        },
        selectSuggest(){
            this.$refs.topTip.show()
            this.saveSearch() 
        },
        switchItem(index){
            this.currentIndex = index
        },
        selectSong (song, index) {
            if (index !== 0) {
            this.insertSong(new Song(song))
            this.$refs.topTip.show()
            }
        },
        ...mapActions([
            'insertSong'
        ]),
        refreshList () {
            setTimeout(() => {
                if (this.currentIndex === 0) {
                    this.$refs.songList.refresh()
                } else {
                    this.$refs.searchList.refresh()
                }
            }, 20)
       },
    },
    watch: {
      query (newVal) {
        if (!newVal) {
          this.refreshList()
        }
      }
    },
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.add-song{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: @color-background;
    &.slide-enter-active, &.slide-leave-active{
      transition: all 0.3s
    }
    &.slide-enter, &.slide-leave-to{
      transform: translate3d(100%, 0, 0)
    }
    .header{
        .flex();
        text-align: center;
        height: 50px;
        width: 100%;
        .back{
            width: 24px;
            height: 24px;
            flex:0 0 24px;
        }
        h1{
            flex: 1;
            color: @color-green;
            font-size: @font-size-medium
        }
    }
    .search-box-wrapper{
         margin: 20px;
    }
    .shortcut{
        .list-wrapper{
            position: absolute;
            top: 165px;
            bottom: 0;
            width: 100%;
            .list-scroll{
                height: 100%;
                overflow: hidden;
                .list-inner{
                    padding: 20px 30px 
                }
            }
        }
    }
    .search-result{
        position: fixed;
        top: 110px;
        bottom: 0;
        width: 100%;
    }
    .tip-title{
        text-align: center;
        padding: 18px 0;
        font-size: 0;
        .flex();
        justify-content: center;
        img{
            width: 24px;
            height: 24px;
            
        }
        .text{
            font-size: @font-size-medium;
            color: @color-green;
        }
    }
}
</style>