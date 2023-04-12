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
            <NoteBox :notes="notes" :type="'saved'" />
          </div>
        </div>
      </v-card>
    </div>
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
      notes: [],
    };
  },
  methods: {},
  mounted() {
    // Get notes list
    this.notes = localStorage.getItem("notes")
      ? JSON.parse(localStorage.getItem("notes"))
      : "";
  },
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
