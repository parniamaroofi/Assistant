<template>
  <div class="d-flex flex-column justify-space-between">
    <div style="width:100%" class="d-flex">
      <div style="width: 500px">
        <img width="500" src="~assets/image/Taking notes-rafiki.png" alt="" />
      </div>
      <div class="mt-15 pt-2">
        <h4>Welcome to <span class="primary--text">EasyNote</span>.</h4>

        <p class="mt-8 mr-10">
          Save time for more important things in your life by easily saving your
          notes. This is a test piece that helps designers and programmers to
          use these test letters to demonstrate their completed designs and
          designs to the employer, using this test text can speed up the
          progress of the project. Instead of typing and writing text, designers
          can replace this text in different boxes with a single copy and post.
          This entry was posted in Persian by Lourm Ipsum.
        </p>
      </div>
    </div>
    <div>
      <v-row class="mx-6 mt-6">
        <v-col>
          <v-btn
            style="width:100%"
            class="dashboard-button"
            height="80"
            color="primary"
            to="/chat"
            ><v-icon class="mr-3">$Chat</v-icon>
            <span class="fs-xlarge">Chat room</span></v-btn
          >
        </v-col>
        <v-col>
          <v-btn
            style="width:100%"
            class="dashboard-button"
            height="80"
            color="primary"
            to="/newNote"
            ><v-icon class="mr-3">$Note</v-icon>
            <span class="fs-xlarge">New note</span></v-btn
          >
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style>
.dashboard-button {
  background: rgb(78, 200, 213) !important;
  background: linear-gradient(
    0deg,
    rgba(78, 200, 213, 1) 0%,
    rgba(46, 88, 93, 1) 100%
  ) !important;
}
</style>
