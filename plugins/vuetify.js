import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import Home from "./../components/icons/Home.vue";
import Note from "./../components/icons/Note.vue";
import Chat from "./../components/icons/Chat.vue";
import Bookmark from "./../components/icons/Bookmark.vue";
import SquareCheck from "./../components/icons/SquareCheck.vue";
import Pen from "./../components/icons/Pen.vue";
import User from "./../components/icons/User.vue";
import Trash from "./../components/icons/Trash.vue";
import FilledStar from "./../components/icons/FilledStar.vue";
import OutlinedStar from "./../components/icons/OutlinedStar.vue";
import Text from "./../components/icons/Text.vue";
import Search from "./../components/icons/Search.vue";

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
      },
      Bookmark: {
        component: Bookmark
      },
      SquareCheck: {
        component: SquareCheck
      },
      Pen: {
        component: Pen
      },
      User: {
        component: User
      },
      Trash: {
        component: Trash
      },
      FilledStar: {
        component: FilledStar
      },
      OutlinedStar: {
        component: OutlinedStar
      },
      Text: {
        component: Text
      },
      Search: {
        component: Search
      }
    }
  }
});
