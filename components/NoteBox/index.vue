<template>
  <div>
    <div class="note-box mb-6" v-for="(note, index) in notes" :key="index">
      <div>
        <v-row class="pt-4">
          <!-- Note author name -->
          <v-col class="pb-0">
            <p class="fs-small grey--text text--darken-1 mb-2 text-capitalize">
              <v-icon class="mr-2">$User</v-icon> {{ note.author }}
            </p>
          </v-col>
          <!-- Star Icon to ADD note to or REMOVE note from favorites list -->
          <v-col class="text-right pb-0">
            <span
              v-if="favoritesIds.includes(note.id)"
              @click="openRemoveFromFavoritesConfirmation(note)"
              class="mr-2 pointer"
            >
              <v-icon>$FilledStar</v-icon>
            </span>

            <span v-else @click="addNoteToFavorites(note)" class="mr-2 pointer">
              <v-icon>$OutlinedStar</v-icon>
            </span>
          </v-col>
        </v-row>
        <!-- Note subject -->
        <v-row>
          <v-col class="pt-0">
            <p class="fs-small grey--text text--darken-1">
              <v-icon class="mr-2 grey--text text--darken-1">$Text</v-icon>
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
          <p
            v-if="type == 'saved'"
            class="mt-2 mb-0 pointer"
            @click="openDeleteNoteConfirmation(index)"
          >
            <v-icon>$Trash</v-icon>
          </p>
        </div>
      </div>
    </div>
    <!-- Dialog for remove a note from favorites -->
    <v-dialog v-model="removeFromFavoritesConfirmation" width="400">
      <v-card class="dialog-card pt-3">
        <v-card-title>
          <v-row>
            <v-col cols="12">
              <span class="fs-xlarge">Remove note from favorites</span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <div>
            <span class="fs-medium">
              Are you sure you want to remove this note from favorites?
            </span>
            <!-- REMOVE NOTE FROM FAVORITES dialog operation button -->
            <div class="mt-5 text-right">
              <v-btn
                @click="removeFromFavoritesConfirmation = false"
                class="secondary--text"
                text
                >Cancel</v-btn
              >

              <v-btn @click="removeNoteFromFavorites()" class="error--text" text
                >Remove</v-btn
              >
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Dialog for delete a note -->
    <v-dialog v-model="deleteNoteConfirmation" width="400">
      <v-card class="dialog-card pt-3">
        <v-card-title>
          <v-row>
            <v-col cols="12">
              <span class="fs-xlarge">Delete note</span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <div>
            <span class="fs-medium">
              Are you sure you want to delete this note?
            </span>
            <!-- REMOVE NOTE FROM FAVORITES dialog operation button -->
            <div class="mt-5 text-right">
              <v-btn
                @click="deleteNoteConfirmation = false"
                class="secondary--text"
                text
                >Cancel</v-btn
              >

              <v-btn @click="deleteNote()" class="error--text" text
                >Delete Note</v-btn
              >
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["notes", "type"],
  data() {
    return {
      favorites: [],
      favoritesIds: [],
      selectedNote: {},
      selectedIndex: null,
      deleteNoteConfirmation: false,
      removeFromFavoritesConfirmation: false,
    };
  },

  mounted() {
    // Get favorite notes list
    this.favorites = localStorage.getItem("favorites")
      ? JSON.parse(localStorage.getItem("favorites"))
      : [];
    // Get favorite notes Ids
    this.favoritesIds = localStorage.getItem("favoritesIds")
      ? JSON.parse(localStorage.getItem("favoritesIds"))
      : [];
  },

  methods: {
    openRemoveFromFavoritesConfirmation(note) {
      this.selectedNote = note;
      this.removeFromFavoritesConfirmation = true;
    },
    openDeleteNoteConfirmation(index) {
      this.selectedIndex = index;
      this.deleteNoteConfirmation = true;
    },
    // the function to delete note from notes list and favotites list
    deleteNote() {
      if (this.favoritesIds.includes(this.notes[this.selectedIndex].id)) {
        this.removeNoteFromFavorites(this.notes[this.selectedIndex]);
      }
      this.notes.splice(this.selectedIndex, 1);
      localStorage.setItem("notes", JSON.stringify(this.notes));
      this.deleteNoteConfirmation = false;
    },
    // the function to add a note to favorites list
    addNoteToFavorites(note) {
      this.favorites.push(note);
      this.favoritesIds.push(note.id);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      localStorage.setItem("favoritesIds", JSON.stringify(this.favoritesIds));
    },
    //the function to remove a note from favorites list
    removeNoteFromFavorites() {
      let index = this.favoritesIds.indexOf(this.selectedNote.id);
      if (index > -1) {
        this.favorites.splice(index, 1);
        this.favoritesIds.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
        localStorage.setItem("favoritesIds", JSON.stringify(this.favoritesIds));
        this.removeFromFavoritesConfirmation = false;
        if (this.type == "favorites") {
          this.$emit("updateFavorites", this.favorites);
        }
      }
    },
  },
};
</script>
