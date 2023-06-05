<template>
  <div class="login-page">
    <!-- Main div -->
    <div class="main-box"></div>
    <!-- Login page content -->
    <div class="box-content">
      <div>
        <p class="mainFont--text mb-0 fs-large">Welcome to</p>
        <p class="fs-xxlarge primary--text font-weight-bold bold-text mb-4">
          Assistant application
        </p>
        <p class="grey--text text--darken-2 fs-medium mb-4">
          <span>Please sign in to continue</span>
          <!-- Info icon -->
          <span @click="openInfoDialog()" class="pointer">
            <v-icon class="ml-1" color="primary"
              >mdi-information-outline</v-icon
            >
          </span>

          <!-- Dialog for information -->
          <v-dialog v-model="infoDialog" width="400">
            <v-card class="modal-card pt-5">
              <v-card-text>
                <div class="mainBlack--text">
                  <p class="fs-large mb-1">Dear user</p>
                  <p class="mb-5 fs-medium">
                    The information you enter in the login form will be
                    displayed in the application. Please enter correct
                    information for better display.
                  </p>
                  <div class="text-center">
                    <v-btn
                      @click="infoDialog = false"
                      color="primary"
                      height="42"
                      block
                      >Okay</v-btn
                    >
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </p>
      </div>

      <!-- Username field -->
      <div>
        <v-text-field
          hideDetails
          class="mb-5"
          placeholder="Enter your full name"
          v-model="account.username"
          @keyup.enter="account.username && account.mobile ? doLogin() : ''"
        >
          <!-- User icon -->
          <template v-slot:prepend-inner>
            <v-icon class="mr-2">$User</v-icon>
          </template>
        </v-text-field>

        <!-- Mobile number field -->
        <v-text-field
          hideDetails
          class="mb-3"
          type="number"
          placeholder="Enter your mobile number"
          v-model="account.mobile"
          @keyup.enter="account.username && account.mobile ? doLogin() : ''"
        >
          <template v-slot:prepend-inner>
            <!-- Phone icon -->
            <v-icon class="ml-1">$Phone</v-icon>

            <!-- DialCode menu -->
            <v-menu
              transition="slide-y-transition"
              :close-on-content-click="false"
              bottom
              rounded="lg"
              v-model="dialCodesMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <!-- dialCode -->
                <div class="mr-1" v-bind="attrs" v-on="on">
                  <v-icon>mdi-chevron-down</v-icon>
                  <span class="prefix">({{ account.dialCode }})</span>
                </div>
              </template>
              <v-card v-if="dialCodesMenu" class="pa-1" width="325">
                <!-- dialCodes list: shows when click on dialCode box -->
                <div class="dialCodes-box">
                  <DialCodes @select="selectDialCode" :filled="true" />
                </div>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </div>

      <!-- Login button -->
      <div class="login-btn text-center mt-4">
        <v-btn
          @click="account.username && account.mobile ? doLogin() : ''"
          :class="!account.username || !account.mobile ? 'no-drop' : ''"
          :ripple="account.username && account.mobile ? true : false"
          class="primary"
          width="140"
          height="42"
          >Login <v-icon class="ml-2">mdi-arrow-right</v-icon></v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import DialCodes from "./../components/DialCodes"; // DialCodes list component
export default {
  components: {
    DialCodes,
  },
  data() {
    return {
      account: {
        username: "",
        dialCode: "+98",
        mobile: "",
      },
      infoDialog: false,
      dialCodesMenu: false,
    };
  },

  methods: {
    // This function is called to select desired dialcode
    selectDialCode(item) {
      this.dialCodesMenu = false;
      this.account.dialCode = item.dial_code;
      setTimeout(() => {
        this.countryFilter = "";
      }, 1000);
    },
    // This function is called to login by clicking on button
    doLogin() {
      localStorage.setItem("username", this.account.username);
      localStorage.setItem("dialCode", this.account.dialCode);
      localStorage.setItem("mobile", this.account.mobile);
      this.$router.push("/home");
    },
    // This function is called to open Info dialog
    openInfoDialog() {
      this.infoDialog = true;
    },
  },
};
</script>
