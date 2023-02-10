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
        <!-- <wysiwyg v-model="newNote.text" /> -->
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
      </div>
    </v-card>

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
        this.notes = localStorage.getItem("notes")
          ? JSON.parse(localStorage.getItem("notes"))
          : [];
        this.notes.push({
          id: Date.now(),
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
