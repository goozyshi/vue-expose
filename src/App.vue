<script setup>
const alpha = [1,2,3,4,5]
const beta = 'a,b,c,d,e,f,g,h,i'.split(',')

</script>

<template>
  <div class="main">
    <h1>重复曝光</h1>
    <div class="container row">
      <div class="card" v-expose="{
        id: item,
        keyCodes: 'same',
        once: false,
        data: {
          
        }
      }" v-for="item in alpha">
        {{ item }}
      </div>
    </div>
    <h1>逐个曝光</h1>
    <div class="container">
      <div v-expose="{
        id: item,
        data: {
          target: item
        }
      }"  class="card" v-for="item in beta">
        {{ item }}
      </div>
    </div>
    <div 
      style="position: fixed; bottom: 0; right: 0;"
      v-expose="{
        id: 'fixed',
      }"
      class="card"
    >
      fixed 数据
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  width: 800px;
  display: flex;
  flex-direction: column;
}
.row {
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.card {
  flex: none;
  width: 200px;
  height: 100px;
  background-color: #d7d7d7;
  padding: 10px;
  margin: 8px;
}

</style>
