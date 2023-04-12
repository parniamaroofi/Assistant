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
          <NoteBox
            :notes="favorites"
            :type="'favorites'"
            @updateFavorites="updateFavorites"
          />
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import NoteBox from "./../../components/NoteBox";
export default {
  components: {
    NoteBox,
  },
  data() {
    return {
      favorites: [],
    };
  },
  methods: {
    updateFavorites(e) {
      this.favorites = e;
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
  },
  mounted() {
    // Get favorites list
    this.favorites = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites")).reverse()
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
