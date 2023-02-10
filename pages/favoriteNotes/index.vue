<template>
  <div>
    <div class="favorite-notes">
      <br /><br />
      <v-card class="common-card note-form">
        <div class="card-title">
          <v-icon class="primary-icon ml-1" color="#00acc1">$StarOff</v-icon>
          Favorite Notes
          <span class="fs-medium grey--text"
            >({{
              favorites.length + (favorites.length == 1 ? " note" : " notes")
            }})</span
          >
        </div>
        <div class="pa-8">
          <div
            v-if="!favorites.length"
            class="grey--text text--lighten-1 text-center mt-16"
          >
            There is no favorite note yet!
          </div>
          <div v-else>
            <div
              class="note-box mb-6"
              v-for="(note, index) in favorites"
              :key="index"
            >
              <div>
                <v-row class="pt-4">
                  <v-col>
                    <p
                      class="fs-small grey--text text--darken-1 mb-2 text-capitalize"
                    >
                      <v-icon class="mr-2">$User</v-icon> {{ note.author }}
                    </p>
                  </v-col>
                  <v-col class="text-right">
                    <span
                      @click="removeNoteFromFavorites(note)"
                      class="mr-2 pointer"
                      ><v-icon>$StarOn</v-icon></span
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <p class="fs-small grey--text text--darken-1">
                      <v-icon class="mr-2 grey--text text--darken-1"
                        >mdi-text</v-icon
                      >
                      {{ note.subject ? note.subject : "--" }}
                    </p>
                  </v-col>
                </v-row>

                <p class="fs-medium grey--text text--darken-2 mt-4">
                  {{ note.text }}
                </p>
                <v-divider></v-divider>
                <div>
                  <p class="fs-xsmall grey--text text--darken-2 mt-4 mb-0">
                    {{ note.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      notes: [],
      favorites: []
    };
  },
  methods: {
    deleteNote(index) {
      this.notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },
    addNoteToFavorites(note) {
      this.favorites.push(note.id);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    removeNoteFromFavorites(note) {
      let index = this.favoritesIds.indexOf(note.id);
      this.favorites.splice(index, 1);
      this.favoritesIds.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      localStorage.setItem("favoritesIds", JSON.stringify(this.favoritesIds));
    }
  },
  mounted() {
    this.favorites = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites")).reverse()
      : [];
    this.favoritesIds = localStorage.getItem("favoritesIds")
      ? JSON.parse(localStorage.getItem("favoritesIds"))
      : [];
  }
};
</script>

<style lang="scss">
.favorite-notes {
  .note-box {
    background: rgb(243, 248, 248);
    background: linear-gradient(
      137deg,
      rgba(243, 248, 248, 1) 0%,
      rgba(211, 233, 227, 1) 100%
    );
    border-radius: 6px;
    padding: 15px;
    border: 1px solid #d8d8d8ee;
  }
}
</style>
