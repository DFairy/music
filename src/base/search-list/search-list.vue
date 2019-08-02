<template>
   <div class="search-list">
       <transition-group name="list" tag="ul">
           <li class="item" v-for="(item,index) in searches" :key='index' @click="selectItem(item)">
               <span class="text">{{item}}</span>
               <img src="../../common/image/del-icon.png" class="del" @click.stop="deleteOne(item)">
           </li>
       </transition-group>
   </div>
</template>

<script>
export default {
    props: {
      searches: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods:{
        selectItem (item) {
            this.$emit('select', item)
        },
        deleteOne (item) {
            this.$emit('delete', item)
        }
    }
}
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.search-list{
    .item{
        .flex(space-between);
        height: 40px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
            transition: all 0.1s
        }
        &.list-enter, &.list-leave-to{
            height: 0
        }
        .text{
            flex:1;
            font-size: @font-size-medium;
            color: #aaa
        }
        .del{
            width: 20px;
            height: 20px;
        }
    }
}
</style>