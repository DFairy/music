<template>
   <div class="header">
       <div class="search" @click='search'>
           <img src="../../common/image/search.png" alt="" class='searchImg'>
           <span>搜索歌曲、歌手</span>
        </div>
       <img src="../../common/image/music_record.png" class="record" alt="">
   </div>
</template>

<script>
export default {
    methods:{
        search(){
            this.$router.push('/search')
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.header{
    position: relative;
    height:50px;
    color: @color-red;
    text-align: center;
    padding: 0 20px;
    .flex(space-around);
    .record{
        width: 34px;
        height: 34px;
        margin-left: 10px;
    }
    .search{
        flex:1;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: @color-background-w ;
        border-radius: 20px;
        color: @color-grey;
        font-size: @font-size-medium;
        .flex(center);
        .searchImg{
            width: 24px;
            height: 24px;
            display: inline-block;
            margin-right: 8px;
        }
    }
} 
</style>