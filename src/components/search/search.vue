<template>
<div class="search">
    <div class="search-box-wrapper">
        <!-- <div class="search-title">
            <img src="../../common/image/back.png" @click='$router.back()' alt="">
            <h1>搜索页</h1>
        </div> -->
        <search-box ref="searchBox" @query='onQueryChange'></search-box>
        <div class="cancel"  @click='$router.back()'>取消</div>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
        <scroll class="shortcut" ref="shortcut" :data="shortcut">
            <div>
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
                <div class="search-history" v-show="searchHistory.length">
                    <h1 class="title">
                        <span>搜索历史</span>
                        <img src="../../common/image/delete.png" @click="showConfirm" alt="">
                    </h1>
                    <search-list :searches="searchHistory" @select='addQuery' @delete='deleteSearchHistory'></search-list>
                </div>
            </div>
        </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
        <Suggest ref="suggest" :query='query' @listScroll="blurInput" @select='saveSearch'></Suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory"  text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
</div>
 
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import Confirm from 'base/confirm/confirm'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import {mapActions,mapGetters} from 'vuex'
import { playlistMixin ,searchMixin} from 'common/js/mixin'

export default {
    mixins: [playlistMixin,searchMixin],
    components:{
        SearchBox,
        Scroll,
        SearchList,
        Suggest,
        Confirm
    },
    data(){
        return{
            hotKey:[]
        }
    },
    created () {
      this._getHotKey()
    },
    computed:{
        ...mapGetters([
            'searchHistory'
        ]),
        shortcut(){
             return this.hotKey.concat(this.searchHistory)
        }
    },
    methods:{
        _getHotKey () {
            getHotKey().then((res) => {
            if (res.code === ERR_OK) {
                this.hotKey = res.data.hotkey.slice(0, 10)
            }
            })
      },
      showConfirm(){
        this.$refs.confirm.show()
      },
      handlePlayList(playList){
         const bottom=playList.length>0?'60px':''
         this.$refs.shortcutWrapper.style.bottom=bottom
         this.$refs.shortcut.refresh()

         this.$refs.searchResult.style.bottom=bottom
         this.$refs.suggest.refresh()
      },
      ...mapActions([
          'clearSearchHistory'
      ])
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.search{
    position: fixed;
    width: 100%;
    bottom: 0;
    top: 0;
    background: @color-white;
    z-index: 150;
    .search-box-wrapper{
        height: 50px;
        width: 100%;
        padding: 5px 20px;
        .flex();
        .cancel{
            width: 45px;
            margin-left: 5px;
        }
    }
    .shortcut-wrapper{
        position: absolute;
        top: 50px;
        bottom: 0;
        width: 100%;
        z-index: 150;
        .shortcut{
            height: 100%;
            overflow: hidden;
            .hot-key{
                margin: 0 20px 20px 20px;
                .title{
                    margin:20px 0;
                    font-size: @font-size-medium;
                    color: @color-green;
                }
                .item{
                    display: inline-block;
                    padding: 5px 12px;
                    margin: 0 20px 10px 0;
                    border-radius: 15px;
                    background: #eee;
                    font-size: @font-size-small ;
                    color: #999;
                }
            }
            .search-history{
                margin: 20px;
                .title{
                    margin:20px 0;
                    font-size: @font-size-medium;
                    color: @color-green;
                    .flex(space-between);
                    img{
                        width: 20px;
                        height: 20px;
                    } 
                }
            }
        }
    }
    .search-result{
        position: absolute;
        top: 50px;
        bottom: 0;
        width: 100%;
    }
}
</style>