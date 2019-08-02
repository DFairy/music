<template>
  <div class="no-result">
    <div class="no-result-icon">
    </div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang='less' scoped>
@import "~common/style/variable";
@import "~common/style/mixin";
.no-result{
    text-align: center;
    .no-result-icon{
        width: 86px;
        height: 90px;
        margin: 0 auto;
        background:url('../../common/image/no-result.png') no-repeat center center;
    }
    .no-result-text{
        margin-top: 30px;
        font-size: @font-size-medium;
        color: #ccc;
    }
}
</style>