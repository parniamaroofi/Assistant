<template>
  <div>
    <div class="all-notes">
      <br /><br />
      <!-- Main card -->
      <v-card class="common-card">
        <!-- The card title -->
        <div class="card-title">
          <v-icon class="ml-1" color="#00acc1">
            mdi-checkbox-marked-outline
          </v-icon>
          Saved notes
          <!-- Length of total notes -->
          <span class="fs-medium grey--text">
            ({{ notes.length + (notes.length == 1 ? " note" : " notes") }})
          </span>
        </div>
        <div class="pa-8">
          <!-- The box that shows when the notes array is empty -->
          <div
            v-if="!notes.length"
            class="grey--text text--lighten-1 text-center mt-16"
          >
            There is no note yet!
          </div>
          <!-- The notes -->
          <div v-else>
            <div
              class="note-box mb-6"
              v-for="(note, index) in notes"
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
                  <!-- Star Icon to ADD note to or REMOVE note from favorites list -->
                  <v-col class="text-right pb-0">
                    <span
                      v-if="favoritesIds.includes(note.id)"
                      @click="removeNoteFromFavorites(note)"
                      class="mr-2 pointer"
                    >
                      <v-icon>$FilledStar</v-icon>
                    </span>

                    <span
                      v-else
                      @click="addNoteToFavorites(note)"
                      class="mr-2 pointer"
                    >
                      <v-icon>$OutlinedStar</v-icon>
                    </span>
                  </v-col>
                </v-row>
                <!-- Note subject -->
                <v-row>
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

                <div class="d-flex justify-space-between">
                  <!-- Note added date and time -->
                  <p class="fs-xsmall grey--text text--darken-2 mt-4 mb-0">
                    {{ note.time }}
                  </p>
                  <!-- Trash icon to delete a note -->
                  <p class="mt-2 mb-0 pointer" @click="deleteNote(index)">
                    <v-icon>$Trash</v-icon>
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
      favorites: [],
      favoritesIds: []
    };
  },
  methods: {
    // the function to delete note from notes list and favotites list
    deleteNote(index) {
      if (this.favoritesIds.includes(this.notes[index].id)) {
        this.removeNoteFromFavorites(this.notes[index]);
      }
      this.notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },
    // the function to add a note to favorites list
    addNoteToFavorites(note) {
      this.favorites.push(note);
      this.favoritesIds.push(note.id);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      localStorage.setItem("favoritesIds", JSON.stringify(this.favoritesIds));
    },
    //the function to remove a note from favorites list
    removeNoteFromFavorites(note) {
      let index = this.favoritesIds.indexOf(note.id);
      if (index > -1) {
        this.favorites.splice(index, 1);
        this.favoritesIds.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
        localStorage.setItem("favoritesIds", JSON.stringify(this.favoritesIds));
      }
    }
  },
  mounted() {
    // Get notes list
    this.notes = localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : "";
    // Get favorite notes list
    this.favorites = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites"))
      : [];
    // Get favorite notes Ids
    this.favoritesIds = localStorage.getItem("favoritesIds")
      ? JSON.parse(localStorage.getItem("favoritesIds"))
      : [];
  }
};
</script>

<style lang="scss">
.all-notes {
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
