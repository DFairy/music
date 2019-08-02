<template>
   <div class="player" v-show="playList.length>0">
       <transition name='normal'
       @enter='enter'
       @after-enter='afterEnter'
       @leave='leave'
       @after-leave='afterLeave'>
           <div class="normal-player" v-show="fullScreen">
               <div class="background">
                   <img :src="currentSong.image" width="100%" height="100%" alt="">
               </div>
               <div class="top">
                   <img class="back" src="../../common/image/back.png" @click="setFullScreen(false)">
                   <h1 class="title" v-html="currentSong.name"></h1>
                   <h2 class="subtitle" v-html="currentSong.singer"></h2>
               </div>
               <div class="middle"
                    @touchstart.prevent="middleTouchStart"
                    @touchmove.prevent="middleTouchMove"
                    @touchend="middleTouchEnd">
                   <div class="middle-l" ref='middleL'>
                       <div class="cd-wrapper" ref='cdWrapper'>
                           <div class="cd">
                               <img :src="currentSong.image" class="image" :class="cdCls" alt="">
                           </div>
                       </div>
                       <div class="playing-lyric-wrapper">
                           <div  class="playing-lyric">{{playingLyric}}</div>
                       </div>
                   </div>
                   <Scroll class="middle-r" ref='lyricList' :data="currentLyric && currentLyric.lines">
                       <div class="lyric-wrapper">
                           <div v-if='currentLyric'>
                               <p class="text" :class="{'current': currentLineNum == index}" ref='lyricLine' v-for="(line,index) in currentLyric.lines" :key='index'>{{line.txt}}</p>
                           </div>
                           <div class="pure-music" v-show="isPureMusic">
                                <p>{{pureMusicLyric}}</p>
                            </div>
                       </div>
                   </Scroll>
               </div>
               <div class="bottom">
                   <div class="dot-wrapper">
                       <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                       <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                   </div>
                   <div class="progress-wrapper">
                       <span class="time">{{format(currentTime)}}</span>
                       <div class="progress-bar-wrapper">
                           <ProgressBar :percent='percent' @percentChange='onProgressBarChange' ref='progressBar'></ProgressBar>
                       </div>
                       <span class="time">{{format(currentSong.duration)}}</span>
                   </div>
                   <div class="operators">
                       <div class="icon">
                           <img :src="iconMode" @click='changeMode' alt="">
                       </div>
                       <div class="icon" :class="disableCls">
                           <img @click='prev' src="../../common/image/previous.png" alt="">
                       </div>
                       <div class="icon" :class="disableCls">
                           <img :src="playIcon" alt="" @click="togglePlaying">
                       </div>
                       <div class="icon" :class="disableCls">
                           <img @click='next' src="../../common/image/next.png" alt="">
                       </div>
                       <div class="icon">
                           <img :src="favoriteIcon" @click="toggleFavorite(currentSong)" alt="">
                       </div>
                   </div>
               </div>
           </div>
       </transition>
       <transition name='mini'>
           <div class="mini-player" v-show="!fullScreen" @click='setFullScreen(true)'>
                <div class="icon">
                    <img :src="currentSong.image" :class="cdCls" width="40" height="40" alt="">
                </div>
                <div class="text">
                        <h2 class="name" v-html="currentSong.name"></h2>
                        <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control" @click.stop="togglePlaying">
                    <ProgressCircle :radius="radius" :percent='percent'>
                        <img :src="miniIcon"  class="icon-mini"  alt="">
                    </ProgressCircle>
                </div>
                <div class="control" @click="showPlaylist">
                     <img src="../../common/image/play-list-line.png" width="30" height="30" class="play-list" alt="">
                </div>
           </div>
       </transition>
       <Playlist ref="playlist"></Playlist>
       <audio :src="currentSong.url" ref='audio' @playing="ready" @error="error" @timeupdate="updateTime" @ended='end' @pause="paused"></audio>
   </div>
</template>

<script>
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Scroll from 'base/scroll/scroll'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import Lyric from 'lyric-parser'
import Playlist from 'components/playlist/playlist'
import {playerMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
export default {
    mixins:[playerMixin],
    components:{
        ProgressBar,
        ProgressCircle,
        Scroll,
        Playlist
    },
    data(){
        return{
            songReady:false,
            currentTime:0,
            radius:32,
            currentLyric:null,//歌词列表
            isPureMusic:false,
            pureMusicLyric:'',//纯音乐
            currentLineNum:0,//当前歌词所在行,
            playingLyric:'',//当前歌词
            currentShow: 'cd',//当前页面
        }
    },
    computed:{
        playIcon () {
            return this.playing ? require('../../common/image/pause.png') : require('../../common/image/play.png')
        },
        miniIcon(){
            return this.playing ?require('../../common/image/pause-icon.png'):require('../../common/image/play-icon.png')
        },
        cdCls(){
             return this.playing ?'play':'play pause'
        },
        disableCls(){
            return this.songReady?'':'disable'
        },
        percent(){
            return this.currentTime/this.currentSong.duration
        },
        ...mapGetters([
            'fullScreen',
            'playing',
            'currentIndex',
        ])
    },
    created(){
        this.touch={}
    },
    methods:{
        enter(el,done){
            const{x,y,scale}=this._getPosAndScale()
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            animations.runAnimation(this.$refs.cdWrapper,'move',done)
        },
        afterEnter(){
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation=''
        },
        leave(el,done){
            const { x, y, scale } = this._getPosAndScale()
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            const timer = setTimeout(done, 400)
            this.$refs.cdWrapper.addEventListener('transitionend', () => {
            clearTimeout(timer)
                done()
            })
        },
        afterLeave(){
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        _getPosAndScale () {
            const targetWidth = 40//小cd的宽高
            const paddingLeft = 40//小cd的左边距离
            const paddingBottom = 30//小cd的底部距离
            const paddingTop = 80//cd容器距离顶部的距离
            const width = window.innerWidth * 0.8 //cd容器的宽度
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        togglePlaying(){
            if(!this.songReady){
                return
            }
            this.setPlayingState(!this.playing)
            if(this.currentLyric){
                this.currentLyric.togglePlay()
            }
        },
        next(){
            if(!this.songReady){
                return
            }
            if(this.playList.length===1){
                this.loop()
            }else{
                let index=this.currentIndex+1
                if(index===this.playList.length){
                    index=0
                }
                this.setCurrentIndex(index)
                if(!this.playing){
                    this.togglePlaying()
                }
            }
            
        },
        prev(){
            if(!this.songReady){
                return
            }
            if(this.playList.length===1){
                this.loop()
            }else{
                let index=this.currentIndex-1
                if(index===-1){
                    index=this.playList.length-1
                }
                this.setCurrentIndex(index)
                if(!this.playing){
                    this.togglePlaying()
                }
            }
            
        },
        ready(){
            clearTimeout(this.timer)
            this.songReady=true
            this.canLyricPlay = true
            this.savePlayHistory(this.currentSong)
             // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
            if (this.currentLyric && !this.isPureMusic) {
                this.currentLyric.seek(this.currentTime * 1000)
            }
        },
        error(){
            clearTimeout(this.timer)
            this.songReady = true
        },
        updateTime(e){
            this.currentTime = e.target.currentTime
        },
        end(){
            this.currentTime = 0
            if(this.mode==playMode.loop){
                this.loop()
            }else{
                this.next()
            }
        },
        paused () {
            this.setPlayingState(false)
            if (this.currentLyric) {
            this.currentLyric.stop()
            }
        },
        loop(){
            this.$refs.audio.currentTime=0
            this.$refs.audio.play()
            if(this.currentLyric){
                this.currentLyric.seek(0)//循环歌曲的歌词归0
            }
        },
        format (interval) {
            interval = interval | 0
            const minute = interval / 60 | 0
            const second = this._pad(interval % 60)
            return `${minute}:${second}`
        },
        _pad (num, n = 2) {
            let len = num.toString().length
            while (len < n) {
                num = '0' + num
                len++
            }
            return num
        },
        onProgressBarChange(percent){
            const currentTime=this.currentSong.duration*percent
            this.$refs.audio.currentTime=currentTime
            if(!this.playing){
                this.togglePlaying()
            }
            if(this.currentLyric){
                this.currentLyric.seek(currentTime*1000)
            }
        },
        //歌词
        getLyric () {
            this.currentSong.getLyric().then((lyric=>{
                if (this.currentSong.lyric !== lyric) {
                    return
                }
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                this.isPureMusic = !this.currentLyric.lines.length
                if (this.isPureMusic) {
                    this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
                    this.playingLyric = this.pureMusicLyric
                } else {
                    if (this.playing && this.canLyricPlay) {
                    // 这个时候有可能用户已经播放了歌曲，要切到对应位置
                    this.currentLyric.seek(this.currentTime * 1000)
                    }
                }
            })).catch(()=>{
                 this.currentLyric=null
                 this.playingLyric = ''
                 this.currentLineNum = 0
            })
        },
        handleLyric(res){
            const { lineNum, txt }=res
            if (!this.$refs.lyricLine) {
                return
            }
            this.currentLineNum=lineNum
            if(lineNum>5){
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl, 1000)
            }else{
                this.$refs.lyricList.scrollTo(0, 0, 1000)
            }
            this.playingLyric = txt
        },
        middleTouchStart(e){
            this.touch.initiated = true
            // 用来判断是否是一次移动
            this.touch.moved=false
            const touch=e.touches[0]
            this.touch.startX=touch.pageX
            this.touch.startY=touch.pageY
        },
        middleTouchMove(e){
            if(!this.touch.initiated){
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            if(!this.touch.moved){
                this.touch.moved=true
            }
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = 0

            this.touch.percent = Math.abs(offsetWidth / window.innerWidth) //滑动百分比
            this.$refs.middleL.style.opacity = 1 - this.touch.percent
            this.$refs.middleL.style[transitionDuration] = 0
        },
        middleTouchEnd(){
            if (!this.touch.moved) {
                return
            }
            let offsetWidth
            let opacity
            if(this.currentShow === 'cd'){
                if(this.touch.percent>0.1){
                    offsetWidth = -window.innerWidth
                    opacity = 0
                    this.currentShow = 'lyric'
                }else{
                    offsetWidth = 0
                    opacity = 1
                }
            }else{
                if(this.touch.percent<0.9){
                    offsetWidth=0
                    this.currentShow='cd'
                    opacity=1
                }else{
                    offsetWidth = -window.innerWidth
                    opacity = 0
                }
            }
            const time = 300
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
            this.$refs.middleL.style.opacity = opacity
            this.$refs.middleL.style[transitionDuration] = `${time}ms`
            this.touch.initiated = false
        },
        showPlaylist(){
            this.$refs.playlist.show()
        },
        ...mapMutations({
            setFullScreen:'SET_FULL_SCREEN',
        }),
        ...mapActions([
            'savePlayHistory'
        ])
    },
    watch:{
        currentSong(newSong,oldSong){
            if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
                return
            }
            this.songReady = false
            this.canLyricPlay = false
            if (this.currentLyric) {
                this.currentLyric.stop()
                // 重置为null
                this.currentLyric = null
                this.currentTime = 0
                this.playingLyric = ''
                this.currentLineNum = 0
            }
            this.$refs.audio.src = newSong.url
            this.$nextTick(()=>{
                this.$refs.audio.play()
                this.getLyric()
            })
             clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.songReady = true
            }, 5000)
           
            
        },
        playing(newPlaying){
            if(!this.songReady){
                return
            }
            const audio=this.$refs.audio
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause()
            })
        },
        fullScreen (newVal) {
            if (newVal) {
            setTimeout(() => {
                this.$refs.lyricList.refresh()
                this.$refs.progressBar.setProgressOffset(this.percent)
            }, 20)
            }
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.player{
    .normal-player{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 150;
        background:#222;
        &.normal-enter-active,&.normal-leave-active{
            transition: all 0.4s;
            .top,.bottom{
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            }
        }
        &.normal-enter,&.normal-leave-to{
            opacity: 0;
            .top{
                transform: translate3d(0, -100px, 0)
            }
            .bottom{
                transform: translate3d(0, 100px, 0)
            }
        }
        .background{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }
        .top{
            position: relative;
            margin-bottom: 25px; 
            .back{
                width: 24px;
                height: 24px;
                position: absolute;
                top: 6px;
                left: 6px;
                transform: rotate(-90deg)
            }
            .title{
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 18px;
                color: #fff;
            }
            .subtitle{
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                color: #fff;
            }
        }
        .middle{
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l{
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper{
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    box-sizing: border-box;
                    height: 100%;
                    .cd{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        .image{
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border-radius: 50%;
                            border: 10px solid hsla(0,0%,100%,.1);
                            &.play{
                                animation: rotate 20s linear infinite
                            }
                            &.pause{
                                animation-play-state: paused
                            } 
                        }
                    }
                }
                .playing-lyric-wrapper{
                    width: 80%;
                    margin: 30px auto 0;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric{
                        height: 20px;
                        line-height: 20px;
                        font-size: @font-size-medium;
                        color: @color-text-l;
                    }
                }
            }
            .middle-r{
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper{
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text{
                        line-height: 32px;
                        color: @color-text-l;
                        font-size: @font-size-medium;
                        &.current{
                            color: @color-green;
                        }
                    }
                    .pure-music{
                        padding-top: 50%;
                        line-height: 32px;
                        color: @color-text-l;
                        font-size: @font-size-medium; 
                    }
                }
            }
        }
        .bottom{
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper{
                text-align: center;
                font-size: 0;
                .dot{
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: @color-text-l;
                    &.active{
                        width: 20px;
                        border-radius: 5px;
                        background: @color-text-ll; 
                    }
                }
            }
            .progress-wrapper{
                .flex();
                width: 80%;
                margin: 0 auto;
                padding: 10px 0;
                .time{
                   color:  @color-white;
                   font-size: @font-size-small;
                   flex: 0 0 30px;
                   width: 30px;
                }
                .progress-bar-wrapper{
                    flex: 1;
                }
            }
            .operators{
                .flex(space-around);
                .icon{
                    width: 30px;
                    height: 30px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        
    }
    .mini-player{
        .flex();
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        width: 100%;
        height: 60px;
        background: #555;
         z-index: 180;
        &.mini-enter-active,&.mini-leave-active{
            transition: all 0.4s
        }
        &.mini-enter,&.mini-leave-to{
            opacity: 0
        }
        .icon{
            flex: 0 0 70px;
            width: 70px;
            height: 40px;
            padding: 0 10px 0 20px;
            img{
                border-radius: 50%;
                &.play{
                    animation: rotate 10s linear infinite
                }
                &.pause{
                    animation-play-state: paused
                }
            }
        }
        .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name{
                .no-wrap();
                font-size: @font-size-medium;
                color: @color-white;
                margin-bottom: 2px  
            }
            .desc{
                .no-wrap();
                font-size: @font-size-small;
                color: @color-grey;
            }
        }
        .control{
            flex: 0 0 50px;
            width: 50px;
            padding: 0 10px;
            text-align: center;
            .icon-mini{
                position: absolute;
                top: 50%;
                left:55%;
                transform: translate3d(-50%,-50%,0);
                width: 15px;
                height: 15px;
            }
        }
        

    }
    @keyframes rotate{
        0%{
            transform: rotate(0)
        }
        100%{
            transform: rotate(360deg)
        }
    }
}

</style>