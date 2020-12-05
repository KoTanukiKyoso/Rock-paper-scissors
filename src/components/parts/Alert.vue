<style scoped>
.alert {
  z-index: 202;
  position: fixed;
  top: 20px;
  margin: 5px auto;
  left: 0;
  right: 0;
  width: calc(100% - 20px);
  max-width: 800px;
}
</style>
<template>
  <transition name="downup" @after-leave="leave">
    <v-alert v-model="alert"
             v-if="mMessages.length > 0 && showing && alert"
             class="alert white--text darken-1"
             :type="risks[mMessages[0].risk]"
             border="left" :dismissible="mMessages[0].dismissible"
             elevation="10">
      <div class="pl-2">{{ mMessages[0].text }}</div>
    </v-alert>
  </transition>
</template>

<script>
import Vue from 'vue'

export default {
  name: "myAlert",
  data: () => ({
    risks: ["success", "info", "warning", "error"],
    alert: false,
    showing: false,
    mMessages: Vue.prototype.store.messages
  }),
  methods: {
    leave() {
      this.showing = false;
      this.alert = true;
      if (this.mMessages.length > 0) {
        this.mMessages.shift();
      }
    },
    nextMessage() {
      this.showing = false;
    },
  },
  watch: {
    mMessages: function () {
      if (this.showing) {
        return;
      }
      if (this.mMessages.length > 0) {
        this.alert = true;
        this.showing = true;
        if (!this.mMessages[0].dismissible) {
          this.mMessages[0].dismissible = false;
        }
        if (!this.mMessages[0].time) {
          this.mMessages[0].time = 2.5;
        }
        if (!this.mMessages[0].risk) {
          this.mMessages[0].risk = 3;
        }
        console.log(this.mMessages[0].text);
        if (this.mMessages[0].dismissible == 0) {
          setTimeout(this.nextMessage, this.mMessages[0].time * 1000);
        }
      }
    },
  }
}
</script>