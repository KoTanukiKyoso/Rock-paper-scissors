<template>
  <button @click="onClick" v-ripple style="width: calc(100% - 8px); max-width: 400px; height: 4em; font-size: 20px;"
          class=" font-weight-bold d-block ma-auto elevation-5 white--text my-4"
          :class="myClass">{{ msg }}
  </button>
</template>

<script>

export default {
  name: "cardButton",
  props: {
    msg: String,
    myClass: String
  },
  methods:{
    onClick() {
      this.$emit("click");
    }
  }

}
</script>

<style scoped>

</style>