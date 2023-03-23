import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

// Icons
import Pen from "./../components/icons/Pen.vue";
import Key from "./../components/icons/Key.vue";
import Home from "./../components/icons/Home.vue";
import Note from "./../components/icons/Note.vue";
import Chat from "./../components/icons/Chat.vue";
import User from "./../components/icons/User.vue";
import Text from "./../components/icons/Text.vue";
import Copy from "./../components/icons/Copy.vue";
import Close from "./../components/icons/Close.vue";
import Phone from "./../components/icons/Phone.vue";
import Trash from "./../components/icons/Trash.vue";
import Logout from "./../components/icons/Logout.vue";
import Search from "./../components/icons/Search.vue";
import Bookmark from "./../components/icons/Bookmark.vue";
import PenNoLine from "./../components/icons/PenNoLine.vue";
import ArrowRight from "./../components/icons/ArrowRight.vue";
import FilledStar from "./../components/icons/FilledStar.vue";
import SquareCheck from "./../components/icons/SquareCheck.vue";
import OutlinedStar from "./../components/icons/OutlinedStar.vue";

Vue.use(Vuetify);

const opts = {};

export default new Vuetify({
  rtl: false,
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#00acc1",
        secondary: "#00838f",
        mainBlack: "#616161",
      },
    },
  },
  icons: {
    iconfont: "mdi",
    values: {
      Home: {
        component: Home,
      },
      Note: {
        component: Note,
      },
      Chat: {
        component: Chat,
      },
      Bookmark: {
        component: Bookmark,
      },
      SquareCheck: {
        component: SquareCheck,
      },
      Pen: {
        component: Pen,
      },
      User: {
        component: User,
      },
      Key: {
        component: Key,
      },
      Trash: {
        component: Trash,
      },
      FilledStar: {
        component: FilledStar,
      },
      OutlinedStar: {
        component: OutlinedStar,
      },
      Text: {
        component: Text,
      },
      Copy: {
        component: Copy,
      },
      Search: {
        component: Search,
      },
      Close: {
        component: Close,
      },
      ArrowRight: {
        component: ArrowRight,
      },
      PenNoLine: {
        component: PenNoLine,
      },
      Phone: {
        component: Phone,
      },
      Logout: {
        component: Logout,
      },
    },
  },
});
