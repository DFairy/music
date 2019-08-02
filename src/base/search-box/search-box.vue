<template>
   <div class="search-box">
       <img src="../../common/image/search.png" class="icon-serach" alt="">
       <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
       <img src="../../common/image/del.png" class="icon-dismiss" v-show="query" @click="query=''" alt="">
   </div>
</template>

<script>
import { debounce } from 'common/js/util'
export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods:{
        setQuery (query) {
            this.query = query
        },
        blur () {
            this.$refs.query.blur()
        }
    },
    created(){
        this.$watch('query',debounce(newQuery=>{
            this.$emit('query',newQuery)
        },200))
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.search-box{
    .flex();
    box-sizing: boeder-box;
    width: 100%;
    padding: 0 10px;
    height: 40px;
    background: @color-background-w ; 
    border-radius: 20px;
    .icon-serach{
        width: 24px;
        height: 24px;
    }
    .box{
        flex:1;
        margin: 0 5px;
        height: 40px;
        line-height: 20px;
        background: @color-background-w ; 
        color: @color-text;
        font-size: @font-size-medium;
        .extend-click();
    }
    .icon-dismiss{
        width: 16px;
        height: 16px;

    }
}
</style>