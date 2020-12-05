<template class="primary">
  <v-main>
    <v-container>
      <div v-if="Object.keys(rooms).length == 0" class="pa-4">
        <h3>ルームがありません．<br>自身でルームを作成する場合は「部屋を作る」を選択してください．</h3>
        <v-btn text rounded>
          <router-link to="/">
            <h2>戻る</h2>
          </router-link>
        </v-btn>
      </div>

    </v-container>
  </v-main>
</template>

<script>

export default {
  name: 'rooms',
  components: {},
  data: () => ({
    rooms: {},
    db: null
  }),
  created() {
    this.db = this.store.firebase.firestore();
    this.listenRoom();
    // this.getRooms();
  },
  methods: {
    async getRooms() {
      this.rooms = await this.db.collection("rooms").get();
      // this.rooms = this.db.collection("rooms").where("recruitment", "==", "true").onSnapshot();
      console.log(this.rooms);
    },
    listenRoom() {
      let self = this;
      this.db.collection("rooms").where("recruitment", "==", true)
          .onSnapshot(function (querySnapshot) {
            let rooms = {};
            querySnapshot.forEach(function (doc) {
              // console.log(doc);
              rooms[doc.id] = doc.data();
            });
            console.log(rooms);
            self.rooms = rooms;
          });
    }
  }
}
</script>
