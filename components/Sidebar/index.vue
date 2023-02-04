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
              <span class="fs-medium">Parnia Maroofi</span>
            </v-list-item-title>
            <v-list-item-subtitle class="fs-xsmall"
              >parniamaroofi@gmail.com</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon class="mr-4">$Home</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="fs-xsmall">Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/note">
          <v-list-item-icon>
            <v-icon class="mr-4">$Note</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="fs-xsmall">Note</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="mr-4">$Chat</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="fs-xsmall">Chat</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
}
</style>
