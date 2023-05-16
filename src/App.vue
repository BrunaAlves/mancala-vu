<template>
  <div id="app">
    <Mancala />
  </div>
</template>

<script>
import Mancala from './components/Mancala.vue'

export default {
  name: 'App',
  components: {
    Mancala
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
