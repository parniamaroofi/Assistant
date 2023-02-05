<template>
  <div id="new-note">
    <br /><br />
    <v-card class="common-card note-form">
      <div class="card-title">New note<v-icon class="ml-1">$Pen</v-icon></div>
      <div class="pa-8 pt-16">
        <v-text-field
          v-model="newNote.name"
          outlined
          label="*Name"
          placeholder="Name"
          style="width:350px;"
        ></v-text-field>
        <v-text-field
          v-model="newNote.subject"
          outlined
          label="Subject"
          placeholder="Subject (Optional)"
          style="width:350px;"
        ></v-text-field>
        <v-textarea
          v-model="newNote.text"
          rows="6"
          outlined
          no-resize
          label="*Your note"
          placeholder="Your note..."
        ></v-textarea>
        <div class="save-button text-right mt-6">
          <v-btn
            height="45"
            style="width:100%"
            color="primary"
            @click="saveNote"
          >
            <v-icon class="mr-1" small>mdi-check-underline</v-icon>Save</v-btn
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
    <v-snackbar
      top
      right
      text
      outlined
      :timeout="3000"
      :color="notif.color"
      v-model="snackbar"
    >
      <div class="w-100 text-center">
        <v-icon :color="notif.color" class="mr-2">{{ notif.icon }}</v-icon
        >{{ notif.text }}
      </div>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notes: [],
      newNote: {
        name: "",
        subject: "",
        text: ""
      },
      snackbar: false,
      notif: {
        color: "success",
        text: "",
        icon: ""
      }
    };
  },
  methods: {
    saveNote: function() {
      let dt = new Date();
      if (!this.newNote.name || !this.newNote.text) {
        this.notif = {
          color: "error",
          text: "Oops! you must fill in the required fields.",
          icon: "mdi-alert-decagram"
        };
        this.snackbar = true;
      } else {
        this.notes = JSON.parse(localStorage.getItem("notes"));
        this.notes.push({
          author: this.newNote.name,
          subject: this.newNote.subject,
          text: this.newNote.text,
          time: dt.toLocaleString()
        });
        this.notif = {
          color: "success",
          text: "Your note successfully saved.",
          icon: "mdi-check-decagram"
        };
        this.snackbar = true;

        localStorage.setItem("notes", JSON.stringify(this.notes));

        this.newNote = {};
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
  width: 100%;
}
.v-snack__wrapper {
  box-shadow: none !important;
  border-radius: 8px !important;
}
</style>
