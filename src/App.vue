<template>
  <div id="app">
    <!--头部-->
    <!--<div class="container-top">-->
    <!--<top-nav></top-nav>-->
    <!--</div>-->

    <!--内容-->
    <div class="container-content">
      <!--<div class="patch"></div>-->
      <router-view></router-view>
      <div class="patch"></div>
    </div>

    <mu-toast v-if="toast" :message="toastMsg"></mu-toast>

    <!--底部tabs-->
    <!--<div class="container-bottom">-->
    <!--<bottom-tab class="tab"></bottom-tab>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import topNav from './components/topnav/top-nav'
  import bottomTab from './components/bottomtab/bottom-tab'

  export default {
    name: 'app',
    components: {
      topNav,
      bottomTab
    },
    computed: {
      ...mapState(['toast', 'toastMsg'])
    }
  }
</script>

<style lang="scss">
  html, body {

  }

  #app {
    .container-top {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 10%;
      z-index: 101;
    }

    .container-content {
      width: 100%;
      /*background-color: #fff;*/
      .patch {
        position: relative;
        width: 100%;
        height: 10vh;
      }
    }

    .container-bottom {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 1;
      width: 100%;
      /*height: 10%;*/
      overflow: hidden;
      .tab {
        /*background-color: #fff;*/
      }
    }

    .mu-toast {
      left: 50%;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      -o-transform: translateX(-50%);
      transform: translateX(-50%);
      bottom: 15%;
      width: auto !important;
    }
  }

  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, .5);
  }
</style>
