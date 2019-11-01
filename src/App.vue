<template>
  <div id="app">
    <div id="nav">
      <MainSidebar></MainSidebar>
    </div>
    <router-view/>
  </div>
</template>

<script>
    // @ is an alias to /src
    import MainSidebar from './views/main-sidebar.vue';
    export default {
        name: 'projects',
        components: {
            MainSidebar
        },

    }
</script>
<style>
  *{
    margin:0;
    padding: 0;
  }
#app {
  overflow: hidden;
  width: 100%;
  min-height: calc(100vh);
  background: #f5fafe;
}
</style>
