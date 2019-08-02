<template>
   <div  class="music-list">
       <div class="title" >
           <img src="../../common/image/back.png" alt="" @click="back" class="back">
           <h1>{{title}}</h1>
       </div>
        <div class="bg-image" :style="bgStyle"  ref="bgImage">
            <div class="play-wrapper">
                <div ref="playBtn" v-show="songs.length>0"  class="play" @click='random'>
                    <img src="../../common/image/play (1).png" class="icon-play" alt="">
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref='layer'></div>
        <Scroll :data='songs' class="list" ref="list"  @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType">
            <div class="song-list-wrapper">
                <SongList :songs='songs' @select='selectSong' :rank='rank'></SongList>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <Loading></Loading>
            </div>
        </Scroll>
   </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import {mapActions} from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 42
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
    mixins: [playlistMixin],
    props:{
        bgImage: {
            type: String,
            default: ''
        },
        songs:{
            type:Array,
            default(){
                return []
            }
        },
        title: {
            type: String,
            default: ''
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    components:{
        Scroll,
        Loading,
        SongList
    },
    data(){
        return{
            scrollY: 0
        }
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted(){
        this.imageHeight=this.$refs.bgImage.clientHeight
        this.minTransalteY=-this.imageHeight+RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods:{
        back(){
            this.$router.back()
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        selectSong(item,index){
            this.selectPlay({
                list:this.songs,
                index
            })
        },
        random(){
            this.randomPlay({
                list:this.songs
            })
        },
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.list.$el.style.bottom=bottom
            this.$refs.list.refresh()
        },
        ...mapActions([
            'selectPlay',
            'randomPlay'
        ])
    },
    watch:{
        scrollY(newVal){
            let translateY = Math.max(this.minTransalteY, newVal)
            let zIndex = 0
            let scale=1
            let blur=0//高斯模糊
            const percent = Math.abs(newVal / this.imageHeight)//图片下拉的公式比
            if(newVal>0){
                zIndex=10
                scale=1+percent
            }else{
                 blur = Math.min(20, percent * 20)
            }
            this.$refs.layer.style['transform']=`translate3d(0,${translateY}px,0)`//背景色一起滚动
            this.$refs.bgImage.style[transform] = `scale(${scale})`//图片下拉
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`//图片模糊
            //设置顶部不被遮挡
            if(newVal<this.minTransalteY){
                zIndex=10
                this.$refs.bgImage.style.paddingTop = 0
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                this.$refs.playBtn.style.display = 'none'
            }else {
                this.$refs.bgImage.style.paddingTop = '70%'
                this.$refs.bgImage.style.height = 0
                this.$refs.playBtn.style.display = ''
            }
            this.$refs.bgImage.style.zIndex = zIndex
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.music-list{
    position: fixed;
    top: 0;
    bottom: 0; 
    left: 0;
    right: 0;
    background: @color-background;
    z-index: 100;
    .title{
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 50;
        text-align: center;
        padding: 12px;
        font-size: @font-size-large;
        color: @color-white;
        .back{
            width: 24px;
            height: 24px;
            position: absolute;
            top:6px;
            left: 6px;
        }
    }
    .bg-image{
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin:top;
        background-size:cover;
        .play-wrapper{
            position: absolute;
            bottom: 20px;
            z-index: 50;
            width: 100%;
            .play{
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid @color-white;
                color: @color-white;
                 border-radius: 100px;
                font-size: 0;
                .icon-play{
                    display: inline-block;
                    vertical-align: middle;
                    width: 24px;
                    height: 24px;
                    margin-right: 6px;
                    font-size: @font-size-medium-x ;
                }
                .text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: @font-size-small;
                }
            }
        }
        .filter{
           position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7,17,27,.4); 
        }
    }
    .bg-layer{
        position: relative;
        height: 100%;
        background: @color-background-w ;
    }
    .list{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: @color-background-w ;
        .song-list-wrapper{
            padding: 20px 30px
        }
        .loading-container{
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%)
        }
    }
}
</style>