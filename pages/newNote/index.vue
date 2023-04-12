<template>
  <div id="new-note">
    <br /><br />
    <!-- Form card -->
    <v-card class="common-card note-form">
      <!-- Card title -->
      <div class="card-title">New note<v-icon class="ml-1">$Pen</v-icon></div>
      <!-- Form Fields -->
      <div class="custom-input pa-8 pt-16">
        <!-- Author name field -->
        <v-text-field
          v-model="newNote.name"
          outlined
          label="*Name"
          placeholder="Name"
          style="width: 350px"
        ></v-text-field>
        <!-- Note subject field -->
        <v-text-field
          v-model="newNote.subject"
          outlined
          label="Subject"
          placeholder="Subject (Optional)"
          style="width: 350px"
        ></v-text-field>
        <!-- Note text wysivyg -->
        <!-- <v-textarea
          v-model="newNote.text"
          rows="6"
          outlined
          no-resize
          label="*Your note"
          placeholder="Your note..."
        ></v-textarea> -->
        <ckeditor v-model="newNote.text" :config="editorConfig"></ckeditor>

        <!-- The button to save the note -->
        <div class="save-button mt-6">
          <v-btn height="45" block color="primary" @click="CheckData()">
            <v-icon class="mr-1" small>mdi-check-underline</v-icon>Save</v-btn
          >
        </div>
      </div>
    </v-card>
    <!-- The toastification to show status of save operation -->
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
        text: "",
      },
      snackbar: false,
      notif: {
        color: "success",
        text: "",
        icon: "",
      },

      months: [
        "Junuary",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      editorConfig: {
        toolbar: [
          ["Bold", "Italic", "Strike"],
          ["RemoveFormat"],
          [
            "NumberedList",
            "BulletedList",
            "Outdent",
            "Indent",
            "Blockquote",
            "SpecialChar",
            "HorizontalRule",
          ],
        ],
      },
    };
  },
  methods: {
    // This function is called to get today's date
    todayDate() {
      let today = new Date();
      let dd = Number(String(today.getDate()).padStart(2, "0"));
      let mm = this.months[String(today.getMonth() + 1).padStart(2, "0") - 1];
      let yyyy = today.getFullYear();

      return `${dd} ${mm} ${yyyy}`;
    },
    // This function is called to get current time
    currentTime() {
      let today = new Date();
      let hour, minute;
      hour = ("0" + today.getHours()).slice(-2);
      minute = ("0" + today.getMinutes()).slice(-2);

      return hour + ":" + minute;
    },
    // the function to check required fields is filled or not
    CheckData() {
      if (!this.newNote.name || !this.newNote.text) {
        this.showError();
      } else {
        this.saveNote();
        this.showSuccess();
      }
    },
    // the function to save note data
    saveNote() {
      this.notes = localStorage.getItem("notes")
        ? JSON.parse(localStorage.getItem("notes"))
        : [];
      this.notes.unshift({
        id: Date.now(),
        author: this.newNote.name,
        subject: this.newNote.subject,
        text: this.newNote.text,
        time: `${this.todayDate()} - ${this.currentTime()}`,
      });
      localStorage.setItem(
        "notes",
        JSON.stringify(this.notes.sort((a, b) => a.id > b.id))
      );

      this.newNote = {};
    },
    // the function to show successfull operation toast
    showSuccess() {
      this.notif = {
        color: "success",
        text: "Your note successfully saved.",
        icon: "mdi-check-decagram",
      };
      this.snackbar = true;
    },
    // the function to show un-successfull operation toast
    showError() {
      this.notif = {
        color: "error",
        text: "Oops! you must fill in the required fields.",
        icon: "mdi-alert-decagram",
      };
      this.snackbar = true;
    },
  },
};
</script>

<style lang="scss">
.custom-input {
  .v-input__slot {
    border-radius: 10px !important;
  }

  .v-label {
    font-size: 0.95rem !important;
  }
}
.save-button {
  width: 100%;
}
.v-snack__wrapper {
  box-shadow: none !important;
  border-radius: 8px !important;
}
.cke_inner,
.cke_top,
.cke_reset {
  border-radius: 12px !important;
  border-bottom: 0 !important;
}
.cke_button {
  border-radius: 6px !important;
}
.cke_chrome {
  border-radius: 12px !important;
  border: 1px solid #9d9d9d !important;
}
.cke_bottom {
  display: none !important;
}
</style>
