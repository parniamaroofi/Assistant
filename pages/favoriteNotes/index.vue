<template>
  <div class="favorite-notes">
    <br /><br />
    <!-- The main card -->
    <v-card class="common-card">
      <!-- The card title -->
      <div class="card-title">
        <v-icon class="primary-icon ml-1" color="#00acc1">
          $OutlinedStar
        </v-icon>
        Favorite Notes
        <!-- Length of total favorites -->
        <span class="fs-medium grey--text">
          ({{
            favorites.length + (favorites.length == 1 ? " note" : " notes")
          }})
        </span>
      </div>
      <div class="pa-8">
        <!-- The box that shows when the favorites array is empty -->
        <div
          v-if="!favorites.length"
          class="grey--text text--lighten-1 text-center mt-16"
        >
          There is no favorite note yet!
        </div>
        <!-- The favorite notes -->
        <div v-else>
          <div
            class="note-box mb-6"
            v-for="(note, index) in favorites"
            :key="index"
          >
            <div>
              <v-row class="pt-4">
                <!-- Note author name -->
                <v-col class="pb-0">
                  <p
                    class="fs-small grey--text text--darken-1 mb-2 text-capitalize"
                  >
                    <v-icon class="mr-2">$User</v-icon> {{ note.author }}
                  </p>
                </v-col>
                <!-- Star Icon to REMOVE note from favorites list -->
                <v-col class="text-right pb-0">
                  <span
                    @click="removeNoteFromFavorites(note)"
                    class="mr-2 pointer"
                    ><v-icon>$FilledStar</v-icon></span
                  >
                </v-col>
              </v-row>
              <v-row>
                <!-- Note subject -->
                <v-col class="pt-0">
                  <p class="fs-small grey--text text--darken-1">
                    <v-icon class="mr-2 grey--text text--darken-1"
                      >$Text</v-icon
                    >
                    {{ note.subject ? note.subject : "--" }}
                  </p>
                </v-col>
              </v-row>
              <!-- Note text -->
              <p
                class="fs-medium grey--text text--darken-2 mt-4"
                v-html="note.text"
              ></p>
              <v-divider></v-divider>
              <!-- Note added date and time -->
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
</template>
<script>
export default {
  data() {
    return {
      notes: [],
      favorites: [],
    };
  },
  methods: {
    // the function to remove a note from favorites
    removeNoteFromFavorites(note) {
      let index = this.favoritesIds.indexOf(note.id);
      this.favorites.splice(index, 1);
      this.favoritesIds.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      localStorage.setItem("favoritesIds", JSON.stringify(this.favoritesIds));
    },
  },
  mounted() {
    // Get favorites list
    this.favorites = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites")).reverse()
      : [];
    // Get favorite notes Ids list
    this.favoritesIds = localStorage.getItem("favoritesIds")
      ? JSON.parse(localStorage.getItem("favoritesIds")).reverse()
      : [];
  },
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
    box-shadow: 0 3px 3px #ccc;

    ul {
      li {
        list-style: disc;
      }
    }
  }
}
</style>
