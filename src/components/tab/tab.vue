<template>
   <div class="tab">
       <router-link tag='div' class='tab-item' to='/recommend'>
         <span class="tab-link">推荐</span>
       </router-link>
       <router-link tag='div' class='tab-item' to='/singer'>
         <span class="tab-link">歌手</span>
       </router-link>
       <router-link tag='div' class='tab-item' to='/rank'>
         <span class="tab-link">排行</span>
       </router-link>
       <router-link tag='div' class='tab-item' to='/my'>
         <span class="tab-link">我的</span>
       </router-link>
   </div>
</template>

<script>
export default {
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.tab{
    .flex(space-around);
    height: 44px;
    line-height: 44px;
    font-size: @font-size-medium;
    .tab-item{
        text-align: center;
        .tab-link{
            padding-bottom: 5px;
        }
        &.router-link-active{
            .tab-link{
                color: @color-green;
            border-bottom: 2px solid @color-green
            }
        }
    }
}
</style>