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
      main: "Getting Started",
      sub: "本システムの使用方法"
    },
    contents: [
      {
        title: "親と子",
        text: `本システムでは「親」と「子」でじゃんけんをします．それぞれの対戦において「親」は必ず1人になります．
        子は10人まで参加可能です．部屋を作成した人が親になります．
        親は，部屋の名前を決める，部屋の人数制限をかけるといった機能が利用できます．`
      },
      {
        title: "部屋を作る「対戦相手を募集する」",
        text: `じゃんけんをする方法は，自身で対戦相手を募集する「部屋を作る」と，対戦相手を募集している人を見つける「部屋を探す」があります．
        部屋を作る場合，部屋の名前と募集人数，入室パスワード，募集制限時間を設定することができます．`
      },
      {
        title: "部屋を探す",
        text: `既に募集している対戦相手を探します．パスワードが必要な場合は入室時にパスワードを入力します．`
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
