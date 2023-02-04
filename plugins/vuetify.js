import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import Home from "./../components/icons/Home.vue";
import Note from "./../components/icons/Note.vue";
import Chat from "./../components/icons/Chat.vue";

Vue.use(Vuetify);

const opts = {};

export default new Vuetify({
  rtl: false,
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#00acc1"
      }
    }
  },
  icons: {
    iconfont: "mdi",
    values: {
      Home: {
        component: Home
      },
      Note: {
        component: Note
      },
      Chat: {
        component: Chat
      }
    }
  }
});
