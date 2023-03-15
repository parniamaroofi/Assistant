<template>
  <div class="sidebar">
    <v-navigation-drawer dark color="cyan darken-2" permanent>
      <v-list color="cyan darken-3">
        <v-list-item>
          <v-list-item-avatar>
            <img src="~assets/image/user.jpg" />
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <span class="fs-large">Parnia Maroofi</span>
            </v-list-item-title>
            <v-list-item-subtitle class="fs-xxsmall mt-2"
              >+98 922 690 7483</v-list-item-subtitle
            >
            <v-list-item-subtitle class="fs-xxsmall"
              >parniamaroofi@gmail.com</v-list-item-subtitle
            >
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
      </v-list>
      <p
        class="fs-xxsmall white--text"
        style="position: absolute; bottom: 0; left: 22px"
      >
        Design & develop by Parnia Maroofi
      </p>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "$Home",
          title: "Home",
          to: "/"
        },
        {
          icon: "$Note",
          title: "New Note",
          to: "/newNote"
        },
        {
          icon: "$Bookmark",
          title: "Saved Notes",
          to: "/savedNotes"
        },
        {
          icon: "$OutlinedStar",
          title: "Favorite Notes",
          to: "/favoriteNotes"
        },
        {
          icon: "$Chat",
          title: "Chat Rooms",
          to: "/chat"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;

  .v-avatar {
    width: 65px !important;
    height: 65px !important;
  }
}
</style>
