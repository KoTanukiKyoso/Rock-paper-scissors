<style>
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}

.v-enter, .v-leave-to {
  opacity: 0;
}

/*横方向*/
.fromLeft-leave-active,
.fromLeft-enter-active {
  /* transition: opacity 1s; */
  transition: all 0.5s;
}

.fromLeft-enter {
  opacity: 0;
  transform: translateX(-400px);
}

.fromLeft-enter-to {
  opacity: 1;
}

.fromLeft-leave {
  opacity: 1;
}

.fromLeft-leave-to {
  opacity: 0;
  transform: translateX(-400px);
}

.fromLeftToRight-leave-active,
.fromLeftToRight-enter-active {
  /* transition: opacity 1s; */
  transition: all 0.4s;
}

.fromLeftToRight-enter {
  opacity: 0;
  transform: translateX(-200px);
}

.fromLeftToRight-enter-to {
  opacity: 1;
}

.fromLeftToRight-leave {
  opacity: 1;
}

.fromLeftToRight-leave-to {
  opacity: 0;
  transform: translateX(200px);
}


/*縦方向*/
.downup-leave-active,
.downup-enter-active {
  /* transition: opacity 1s; */
  transition: all 0.5s;
}

.downup-enter {
  opacity: 0;
  transform: translateY(-50%);
}

.downup-enter-to {
  opacity: 1;
}

.downup-leave {
  opacity: 1;
}

.downup-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}


.updown-leave-active,
.updown-enter-active {
  transition: all 0.5s;
}

.updown-enter {
  opacity: 0;
  transform: translateY(+50%);
}

.updown-enter-to {
  opacity: 1;
}

.updown-leave {
  opacity: 1;
}

.updown-leave-to {
  opacity: 0;
  transform: translateY(+50%);
}


.downup_length-leave-active,
.downup_length-enter-active {
  /* transition: opacity 1s; */
  transition: all 0.7s;
}

.downup_length-enter,
.downup_length-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.downup_length-enter-to,
.downup_length-leave {
  opacity: 1;
}


@media screen and (max-width: 400px) {
  .v-toolbar__content {
    padding-left: 6px;
    padding-right: 6px;
  }
}

</style>
<template>
  <v-app class="primary lighten-1">
    <Header msg="ジャンケン Online"/>

    <transition name="fromLeft" mode="out-in">
      <router-view/>
    </transition>
    <div elevation="10" class="elevation-5">
      <Footer/>
    </div>

    <myAlert/>
  </v-app>
</template>

<script>
import myAlert from "@/components/parts/Alert";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default {
  name: 'App',

  components: {
    Header,
    Footer,
    myAlert
  },

  data: () => ({
    messages: []
    //
  }),
  methods: {
    createPageTitle: function (to) {
      // タイトルを設定
      if (to.meta.title) {
        let setTitle = to.meta.title;
        document.title = setTitle;
      } else {
        document.title = 'じゃんけん Online'
      }

      if (!document.querySelector("meta[name='description']")) {
        return;
      }
      // メタタグdescription設定
      if (to.meta.desc) {
        let setDesc = to.meta.desc;
        document.querySelector("meta[name='description']").setAttribute('content', setDesc)
      } else {
        document.querySelector("meta[name='description']").setAttribute('content',
            'コロナ渦なのに まだ対面でじゃんけんしてるんですか？テレビ会議でじゃんけんできてますか？？多数決なんてもう古い！これからはじゃんけんの時代！！全てはじゃんけんできましょう！！！')
      }
    }
  },
  mounted: function () {
    let to = this.$route;
    this.createPageTitle(to);
  },
  watch: {
    '$route'(to) {
      this.createPageTitle(to);
    }
  }
};
</script>
