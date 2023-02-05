<template>
  <div>
    <div class="all-notes">
      <br /><br />
      <v-card class="common-card note-form">
        <div class="card-title">
          <v-icon class="ml-1" color="#00acc1"
            >mdi-checkbox-marked-outline</v-icon
          >
          Saved notes
          <span class="fs-medium grey--text"
            >({{
              notes.length + (notes.length == 1 ? " note" : " notes")
            }})</span
          >
        </div>
        <div class="pa-8">
          <div
            class="note-box mb-6"
            style="position:relative"
            v-for="(note, index) in notes"
            :key="index"
          >
            <div style="position:absolute; right:-2px; top:-12px">
              <img width="32" src="~assets/image/note_thepin_1330.png" alt="" />
            </div>
            <div>
              <p class="fs-medium grey--text text--darken-2 mb-2">
                <v-icon class="mr-2">mdi-account</v-icon> {{ note.author }}
              </p>
              <p class="fs-medium grey--text text--darken-2">
                <v-icon class="mr-2">mdi-text</v-icon> {{ note.subject }}
              </p>

              <p class="fs-medium grey--text text--darken-2 mt-4">
                {{ note.text }}
              </p>
              <v-divider></v-divider>
              <div class="d-flex justify-space-between">
                <p class="fs-xsmall grey--text text--darken-2 mt-4 mb-0">
                  {{ note.time }}
                </p>
                <p class="mt-2 mb-0 pointer" @click="deleteNote(index)">
                  <v-icon>mdi-delete-outline</v-icon>
                </p>
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
      notes: []
    };
  },
  methods: {
    deleteNote(index) {
      this.notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(this.notes));
    }
  },
  mounted() {
    this.notes = JSON.parse(localStorage.getItem("notes")).reverse();
  }
};
</script>

<style lang="scss">
.all-notes {
  .note-box {
    background-color: #0f6d7a0d;
    border-radius: 6px;
    padding: 15px;
    border: 1px solid #d8d8d8ee;
  }
}
</style>
