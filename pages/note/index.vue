<template>
  <div id="new-note">
    <br /><br />
    <v-card class="common-card note-form">
      <div class="card-title">
        New note
      </div>
      <div class="pa-8 pt-16">
        <v-text-field
          v-model="newNote.name"
          outlined
          label="Name"
          style="width:350px;"
        ></v-text-field>
        <v-text-field
          v-model="newNote.subject"
          outlined
          label="Subject (Optional)"
          style="width:350px;"
        ></v-text-field>
        <v-textarea
          v-model="newNote.text"
          rows="6"
          outlined
          no-resize
          label="Text"
        ></v-textarea>
        <div class="save-button text-right">
          <v-btn height="45" width="120" color="primary" @click="saveNote"
            >Save</v-btn
          >
        </div>
        <!-- <v-row class="mt-8">
          <v-col md="6" cols="12">
            <transition name="fade">
              <span v-show="error" class="error"
                ><i class="material-icons red-text left">cancel</i>Oops! you
                must fill in the name field and the note field.</span
              >
            </transition>
            <transition name="fade">
              <span v-show="done" class="done"
                ><i class="material-icons green-text left">check_circle</i
                >Saved!</span
              >
            </transition>
          </v-col>
         
        </v-row> -->
      </div>
    </v-card>
    <!-- <div class="show-note">
      <label>Saved Notes</label>
      <br /><br />

      <div
        class="card note-box"
        v-for="(note, index) in notes"
        v-if="note.name"
      >
        <div class="content">
          <ul>
            <li><i class="material-icons left">person</i> {{ note.name }}</li>
            <li v-if="note.subject">
              <i class="material-icons left">subject</i> {{ note.subject }}
            </li>
            <li class="text">
              <i class="material-icons left">rate_review</i>
              {{ note.note_text }}
            </li>
          </ul>
        </div>
        <div class="card-action">
          <span class="left" id="date-time">{{ note.time }}</span>
          <span class="del-note right" v-on:click="deleteNote(index)"
            ><i class="material-icons" title="delete">delete_forever</i></span
          >
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      notes: [
        {
          name: "",
          subject: "",
          note_text: "",
          time: ""
        }
      ],
      newNote: {
        name: "",
        subject: "",
        text: ""
      },
      error: false,
      done: false
    };
  },
  methods: {
    saveNote: function() {
      let dt = new Date();
      if (!this.newName || !this.newText) {
        this.error = true;
        this.done = false;
        setTimeout(() => (this.error = false), 2000);
      } else {
        this.notes.push({
          name: this.newName,
          subject: this.newSubject,
          note_text: this.newText,
          time: dt.toLocaleString()
        });
        this.error = false;
        this.done = true;
        setTimeout(() => (this.done = false), 2000);
        this.newName = "";
        this.newSubject = "";
        this.newText = "";
      }
    },

    deleteNote: function(index) {
      if (confirm("Do you really want to delete this note?")) {
        notes.splice(index, 1);
      } else {
        console.log("The operation was canceled!");
      }
    }
  }
};
</script>

<style lang="scss">
.save-button {
  position: absolute;
  bottom: 30px;
  right: 30px;
}
</style>
