<template class="primary">
  <text-page :contents="contents" :title="title"></text-page>
</template>

<script>

export default {
  name: 'battleRoom',
  components: {
  },
  data: () => ({
    title: {
      main: "What's \"じゃんけん\"",
      sub: "じゃんけんって？ルールは？"
    },
    contents: [
    ]
  }),
  methods: {

  }
}
</script>
