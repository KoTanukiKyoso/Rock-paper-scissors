<template>
  <div class="header my-background-main">
    <h1 style="color: white;">{{msg}}</h1>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String
  }
}

</script>

<style scoped lang="scss">
h1 {
  margin: 0px;
}

.header {
  color: white;
  padding: 10px;
}

</style>