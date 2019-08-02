<template>
   <Scroll class="suggest" :data="result" ref="suggest" :pullup="pullup" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" @beforeScroll="listScroll">
       <ul class="suggest-list">
           <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
               <img :src="getIconCls(item)" alt="" class="icon">
               <div class="name" v-html="getDisplayName(item)"></div>
           </li>
           <loading v-show="hasMore"  title=""></loading>
       </ul>
       <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
       </div>
   </Scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20
export default {
    props:{
       showSinger: {
        type: Boolean,
        default: true
      }, 
      query: {
        type: String,
        default: ''
      }
    },
    components:{
        Scroll,
        Loading,
        NoResult
    },
    data(){
        return{
            page:1,
            result:[],
            hasMore:true,
            pullup: true,
            beforeScroll: true,
        }
    },
    created(){
    },
    methods:{
        getIconCls(item){
            if(item.type===TYPE_SINGER){
                return require('../../common/image/people-icon.png')
            }else{
                return require('../../common/image/music-icon.png')
            }
        },
        getDisplayName(item){
            return item.type===TYPE_SINGER?item.singername:`${item.name}-${item.singer}`
        },
        refresh () {
            this.$refs.suggest.refresh()
        },
        search(){
            this.page=1
            this.hasMore=true
            this.$refs.suggest.scrollTo(0, 0)
            search(this.query,this.page,this.showSinger,perpage).then(res=>{
                if(res.code===ERR_OK){
                     this._genResult(res.data).then((result) => {
                        this.result =result
                         
                    })
                    this._checkMore(res.data)
                }
            })
        },
        searchMore () {
            if (!this.hasMore) {
            return
            }
            this.page++
            search(this.query, this.page, this.showSinger, perpage).then((res) => {
            if (res.code === ERR_OK) {
                this._genResult(res.data).then((result) => {
                    this.result = this.result.concat(result)
                })
                this._checkMore(res.data)
            }
            })
        },
        listScroll () {
            this.$emit('listScroll')
        },
        selectItem (item) {
            if (item.type === TYPE_SINGER) {
            const singer = new Singer({
                id: item.singermid,
                name: item.singername
            })
            this.$router.push({
                path: `/search/${singer.id}`
            })
            this.setSinger(singer)
            } else {
                this.insertSong(item)
            }
            this.$emit('select', item)
        },
        _genResult (data) {
            // console.log(data)
            let ret = []
            if (data.zhida && data.zhida.singerid && this.page === 1) {
                ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
                console.log(ret)
            }
            return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
                ret = ret.concat(songs)
                return ret
            })
        },
        _normalizeSongs (list) {
            let ret = []
            list.forEach((musicData) => {
            if (isValidMusic(musicData)) {
                ret.push(createSong(musicData))
            }
            })
            return ret
        },
        _checkMore (data) {
            const song = data.song
            if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
            this.hasMore = false
            }
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch:{
        query (newQuery) {
            if (!newQuery) {
                return
            }
            this.search(newQuery)
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
        padding: 10px 30px;
        .suggest-item{
            .flex();
            padding-bottom: 20px;
            .icon{
                flex:0 0 26px;
                margin-right: 10px;
            }
            .name{
                flex: 1;
                font-size: @font-size-medium;
                .no-wrap();
            }
        }
    }
}
</style>