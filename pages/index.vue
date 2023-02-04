<template>
  <div>
    <div style="width:100%" class="d-flex">
      <img width="500" src="~assets/image/Taking notes-rafiki.png" alt="" />
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
          <v-btn style="width:100%" height="80" color="primary" to="/chat"
            ><v-icon class="mr-3">$Chat</v-icon>
            <span class="fs-xlarge">Chat</span></v-btn
          >
        </v-col>
        <v-col>
          <v-btn style="width:100%" height="80" color="primary" to="/note"
            ><v-icon class="mr-3">$Note</v-icon>
            <span class="fs-xlarge">Note</span></v-btn
          >
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped></style>
