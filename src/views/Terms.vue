<template class="primary">
  <text-page :contents="contents" :title="title"></text-page>
</template>

<script>

import TextPage from "@/components/TextPage";
export default {
  name: 'GetStart',
  components: {
    TextPage
  },
  data: () => ({
    title: {
      main: "Terms",
      sub: "利用規約"
    },
    contents: [
      {
        title: "利用規約",
        text: `あらゆる点において制作者，サービス提供者は責任を負いません．`
      },
    ]
  }),
  methods: {
    alert: (msg) => {
      alert(msg)
    },
  }
}
</script>
