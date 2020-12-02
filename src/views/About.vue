<template class="primary">
  <text-page :contents="contents" :title="title"></text-page>
</template>

<script>

import TextPage from "@/components/TextPage";
export default {
  name: 'Top',
  components: {
    TextPage

  },
  data: () => ({
    title: {
      main: "ABOUT",
      sub: "本システムについて"
    },
    contents: [
      {
        title: "目的",
        text: `本システムは佐賀大学生の授業での使用，兼システム制作の勉強を目的として，佐賀大学の学生によって作成されました．`
      },
      {
        title: "用途",
        text: `本システムはオンラインでじゃんけんをする為のシステムです．遠く離れた人と，また１対多での大人数でのじゃんけんが可能です．`
      },
      {
        title: "開発環境",
        text: `OS：Windows10
        ブラウザ：Google Chrome
        IDE：PHP Storm
        言語：HTML，JavaScript，CSS，SASS（Scss）`
      },
      {
        title: "使用した主な技術，主要プラットフォーム等",
        text: `Vue Cli, Vue Router, Vue UI, Vuetify, Firebase Authentication, Firebase Cloud Firestore, NPM, FontAwesome`
      },
      {
        title: "制作期間，感想",
        text: ``
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
