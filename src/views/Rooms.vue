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
      <v-row>
        <v-col v-for="(room, key) of rooms" :key="key" cols="6" class="col-md-4">
          <v-card>
            <v-card-title>{{ room.roomName }}</v-card-title>
            <v-card-text v-if="room.roomSummary">{{ room.roomSummary }}</v-card-text>
            <v-card-text v-else>詳細は登録されておりません</v-card-text>
            <v-card-actions class="pa-3">
              <v-icon class="mx-2" style="color: yellow;">fas fa-hand-rock</v-icon>
              <v-icon class="mx-2" :class="{true: 'primaryText'}">fas fa-hand-peace</v-icon>
              <v-icon class="mx-2">fas fa-hand-paper</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

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
