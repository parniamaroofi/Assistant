<template>
  <div class="sidebar">
    <v-navigation-drawer dark color="cyan darken-2" permanent>
      <v-list color="cyan darken-3">
        <v-list-item>
          <v-list-item-avatar>
            <img src="~assets/image/user-avatar.png" />
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content class="pt-0 pb-1">
            <v-list-item-title>
              <span class="fs-medium2">{{
                username ? username : "No name"
              }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="fs-xxsmall mt-1">
              <!-- Display when there is a correct phone number -->
              <div v-if="!formattedPhoneNumber">
                <!-- Alert icon -->
                <v-icon color="#ffffffb2" small class="mr-1"
                  >mdi-alert-circle-outline</v-icon
                >

                <span>Incorrect mobile number</span>
              </div>
              <!-- Display when there is not a correct phone number -->
              <div v-else>
                {{ formattedPhoneNumber }}
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item v-for="(item, index) in items" :key="index" :to="item.to">
          <v-list-item-icon class="light-icon">
            <v-icon class="mr-4">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="fs-xsmall">{{
            item.title
          }}</v-list-item-title>
        </v-list-item>
        <v-divider class="mb-1"></v-divider>
        <v-list-item @click="logout()">
          <v-list-item-icon class="light-icon">
            <v-icon class="mr-4">$Logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="fs-xsmall">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
      <p
        class="fs-xxsmall white--text"
        style="position: absolute; bottom: 0; left: 16px"
      >
        Design & develop by Parnia Maroofi
      </p>
    </v-navigation-drawer>
  </div>
</template>
<script>
import parsePhoneNumber from "libphonenumber-js";
export default {
  data() {
    return {
      items: [
        {
          icon: "$vuetify.icons.Home",
          title: "Home",
          to: "/home",
        },
        {
          icon: "$Note",
          title: "New Note",
          to: "/newNote",
        },
        {
          icon: "$Bookmark",
          title: "Saved Notes",
          to: "/savedNotes",
        },
        {
          icon: "$OutlinedStar",
          title: "Favorite Notes",
          to: "/favoriteNotes",
        },
        {
          icon: "$Chat",
          title: "Chat Rooms",
          to: "/chats",
        },
      ],

      username: localStorage.getItem("username"),
      dialCode: localStorage.getItem("dialCode"),
      mobile: localStorage.getItem("mobile"),
      formattedPhoneNumber: "",
    };
  },
  methods: {
    logout() {
      this.$emit("setLoading");
      localStorage.removeItem("username");
      localStorage.removeItem("dialCode");
      localStorage.removeItem("mobile");
      this.$router.push("/");
    },
  },
  mounted() {
    if (this.dialCode && this.mobile) {
      this.formattedPhoneNumber = parsePhoneNumber(
        this.dialCode + this.mobile
      ).formatInternational();
    }
  },
};
</script>

<style lang="scss">
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  .v-navigation-drawer {
    width: 235px !important;
  }

  .v-avatar {
    width: 60px !important;
    height: 60px !important;
  }
}
</style>
