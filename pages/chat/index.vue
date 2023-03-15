<template>
  <div class="chats" v-if="pageLoaded">
    <!-- main div -->
    <div class="chat-card" @keyup.esc="selectedChat = {}" tabindex="0">
      <!-- chat box LEFT SECTION -->
      <div class="chats-list">
        <!-- search field for chats -->
        <div class="mb-4">
          <v-text-field
            class="mx-2 no-border-field"
            placeholder="Search..."
            hide-details
            outlined
            rounded
            style="background-color: #fff"
            v-model="filter"
          >
            <!-- SEARCH icon -->
            <template v-slot:prepend-inner>
              <div>
                <v-icon class="mr-2">$Search</v-icon>
              </div>
            </template>
            <!-- CLOSE icon -->
            <template v-slot:append>
              <div class="pointer" v-if="filter" @click="filter = ''">
                <v-icon color="primary">mdi-close</v-icon>
              </div>
            </template>
          </v-text-field>
        </div>
        <!-- NO CHATS BOX when no chat has been created yet -->
        <div v-if="!filter && !filteredChats.length" class="text-center mt-8">
          <p class="fs-medium grey--text text--darken-1">
            There is no chats yet!
          </p>
        </div>
        <!-- NO RESULT BOX when there is no filter result for chats -->
        <div v-if="filter && !filteredChats.length" class="text-center mt-8">
          <p class="fs-medium grey--text text--darken-1">
            No result for "{{ filter }}"
          </p>
        </div>
        <!-- list of ALL CHATS -->
        
        <div class="all-chats">
          <div v-if="!filter" class="chat-box d-flex" @click="selectChat(guideFriend)">
            <!-- profile avatar of a chat -->
            <div>
              <avatar
                :username="guideFriend.user"
                :size="48"
                rounded
                color="#fff"
                :src="guideFriend.src"
              ></avatar>
              <!-- <img width="55" src="~assets/image/user-avatar.png" /> -->
            </div>

            <div
              class="ml-3 d-flex justify-space-between"
              style="width: 100%; margin-top:6px"
            >
              <div>
                <!-- user of a chat -->
                <p class="fs-medium mb-0">{{ guideFriend.user }} <v-icon color="primary" small style="transform: translateY(-2px)">mdi-check-decagram</v-icon></p>

                <!-- preview of the last sent chat message -->
                <p class="mb-0 fs-xsmall grey--text">
                  {{
                    computedLastMessage(guideFriend).length > 22
                      ? computedLastMessage(guideFriend).slice(0, 22) + "..."
                      : computedLastMessage(guideFriend)
                  }}
                </p>
              </div>

            </div>
          </div>
          <v-divider v-if="!filter" class="my-1"></v-divider>
          <div v-for="(chat, index) in filteredChats" :key="index">
            <!-- box of a chat -->
            <div @contextmenu="getClickedChatData(chat)">
              <!-- getting the object of clicked chat -->
              <div
                @click="selectChat(chat)"
                @contextmenu="showListMenu"
                class="chat-box d-flex"
              >
                <!-- profile avatar of a chat -->
                <div>
                  <avatar
                    :username="chat.user"
                    :size="48"
                    rounded
                    color="#fff"
                  ></avatar>
                  <!-- <img width="55" src="~assets/image/user-avatar.png" /> -->
                </div>

                <div
                  class="ml-3 d-flex justify-space-between"
                  style="width: 100%; margin-top:6px"
                >
                  <div>
                    <!-- user of a chat -->
                    <p class="fs-medium mb-0">{{ chat.user }}</p>

                    <!-- isTyping box: shows when user is typing message text -->
                    <div
                      class="mb-0 fs-xsmall primary--text d-flex"
                      v-if="chat.isTyping"
                    >
                      <span>Typing</span>
                      <!-- moving dots -->
                      <div class="snippet ml-3 mt-2" data-title=".dot-elastic">
                        <div class="stage">
                          <div class="dot-elastic"></div>
                        </div>
                      </div>
                    </div>

                    <!-- preview of the last sent chat message -->
                    <p v-else class="mb-0 fs-xsmall grey--text">
                      {{
                        computedLastMessage(chat).length > 22
                          ? computedLastMessage(chat).slice(0, 22) + "..."
                          : computedLastMessage(chat)
                      }}
                    </p>
                  </div>

                  <div class="text-right">
                    <!-- the number of unread messages in a chat -->
                    <v-badge
                      v-if="chat.unseenNumber"
                      :content="chat.unseenNumber"
                      class="mr-4"
                    ></v-badge>
                    <p class="mb-0" v-else>&nbsp;</p>

                    <!-- the date of the last message sent in the chat -->
                    <p class="mb-0 fs-xxsmall grey--text mt-1">
                      {{
                        computedChatDate(chat)
                          ? computedDate(computedChatDate(chat))
                          : ""
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- chat right click menu -->
            <v-menu
              v-model="listMenu"
              :position-x="menuLocation.x"
              :position-y="menuLocation.y"
              absolute
              offset-y
              transition="scale-transition"
            >
              <v-list>
                <!-- PIN item -->
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-pin-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title
                    class="fs-small pl-2 grey--text text--darken-2"
                    >Pin chat
                  </v-list-item-title>
                </v-list-item>

                <!-- DELETE CHAT item -->
                <v-list-item @click="deleteChatConfirmation = true">
                  <v-list-item-icon>
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title
                    class="fs-small pl-2 grey--text text--darken-2"
                    >Delete chat
                  </v-list-item-title>
                </v-list-item>

                <!-- CLEAR HISTORY item -->
                <v-list-item @click="clearHistoryConfirmation = true">
                  <v-list-item-icon>
                    <v-icon>mdi-chat-remove-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title
                    class="fs-small pl-2 grey--text text--darken-2"
                    >Clear history
                  </v-list-item-title>
                </v-list-item>

                <!-- SEND MESSAGE FROM USER item -->
                <v-list-item @click="userChatDialog = true">
                  <v-list-item-icon>
                    <v-icon style="transform: translateY(2px)"
                      >mdi-message-arrow-left-outline</v-icon
                    >
                  </v-list-item-icon>
                  <v-list-item-title
                    class="fs-small pl-2 grey--text text--darken-2"
                    >Send messege from <b>{{ selectedItem.user }}</b>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <!-- chats divider -->
            <v-divider class="my-1"></v-divider>
          </div>
        </div>

        <!-- Dialog to get confirm to delete a chat  -->
        <v-dialog v-model="deleteChatConfirmation" width="350">
          <v-card class="dialog-card">
            <v-card-title class="pb-2">
              <div class="d-flex">
                <avatar
                  :size="40"
                  :username="selectedItem.user"
                  color="#fff"
                ></avatar>
                <span class="fs-xlarge pl-3 pt-1">Delete chat</span>
              </div>
            </v-card-title>

            <v-card-text>
              <div v-if="deleteChatConfirmation">
                <span class="fs-medium"
                  >Are you sure you want to delete chat with
                  <b>{{ selectedItem.user }}</b
                  >?</span
                >

                <!-- DELETE CHAT dialog operation button -->
                <div class="mt-5 text-right">
                  <v-btn
                    @click="deleteChatConfirmation = false"
                    class="secondary--text"
                    text
                    >Cancel</v-btn
                  >

                  <v-btn @click="deleteChat()" class="error--text" text
                    >Delete chat</v-btn
                  >
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of delete chat dialog -->

        <!-- Dialog to get confirm to clear history of a chat  -->
        <v-dialog v-model="clearHistoryConfirmation" width="350">
          <v-card class="dialog-card">
            <v-card-title class="pb-2">
              <div class="d-flex">
                <avatar
                  :size="40"
                  :username="selectedItem.user"
                  color="#fff"
                ></avatar>
                <span class="fs-xlarge pl-3 pt-1">Clear history</span>
              </div>
            </v-card-title>

            <v-card-text>
              <div v-if="clearHistoryConfirmation">
                <span class="fs-medium"
                  >Are you sure you want to clear chat history with
                  <b>{{ selectedItem.user }}</b
                  >?</span
                >

                <!-- CLEAR HISTORY dialog operation buttons -->
                <div class="mt-5 text-right">
                  <v-btn
                    @click="clearHistoryConfirmation = false"
                    class="secondary--text"
                    text
                    >Cancel</v-btn
                  >
                  <v-btn @click="clearHistory()" class="error--text" text
                    >Clear history</v-btn
                  >
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of clear history dialog -->

        <!-- backdrop of user chat dialog -->
        <div
          @click="userChatDialog = false"
          v-if="userChatDialog"
          class="backDrop"
        >
          &nbsp;
        </div>
        <!-- user chat dialog -->
        <div class="userChatDialog" :class="userChatDialog ? 'active' : ''">
          <v-card flat>
            <v-container
              class="dialog-body d-flex flex-column justify-space-between h-100"
            >
              <!-- dialog CLOSE icon -->
              <div class="text-right">
                <span @click="userChatDialog = false">
                  <v-icon class="pointer">$Close</v-icon>
                </span>
              </div>

              <!-- dialog content -->
              <div>
                <div>
                  <span class="fs-large">
                    From: 
                    <span class="primary--text">{{ selectedItem.user }}</span>
                  </span>
                </div>
                <p class="fs-xsmall grey--text mb-0" style="line-height: 20px">
                  This is a demo version of online chat and you can send
                  messages from the desired user and see the performance of chat
                  sections.
                </p>

                <div class="mt-6">
                  <v-text-field
                    class="no-border-field"
                    rounded
                    style="background-color: #fff"
                    :placeholder="computedFieldPlaceholder"
                    outlined
                    hide-details
                    v-model.trim="userMessageText"
                    @input="changeUserTypingStatus()"
                    @keyup.enter="userMessageText ? sendUserMessage() : ''"
                  >
                    <template v-slot:append>
                      <div>
                        <v-btn
                          text
                          width="45"
                          height="45"
                          :disabled="!userMessageText"
                          @click="sendUserMessage()"
                          style="min-width: 40px; transform: translateY(-8px)"
                          ><v-icon color="primary">mdi-send</v-icon></v-btn
                        >
                      </div>
                    </template>
                  </v-text-field>
                </div>
              </div>
            </v-container>
          </v-card>
        </div>
        <!-- CREATE NEW CHAT button -->
        <v-btn @click="openNewChat()" class="new-btn secondary lighten-1"
          ><v-icon class="light-icon">$PenNoLine</v-icon></v-btn
        >

        <!-- CREATE NEW CHAT div -->
        <div class="new-chat" :class="openNew ? 'active' : ''">
          <v-card flat class="main-card pa-5">
            <div class="d-flex justify-space-between">
              <span class="fs-xlarge">Create New Chat</span>
              <span @click="closeNewChat()" class="pointer"
                ><v-icon>$ArrowRight</v-icon></span
              >
            </div>

            <div
              class="mt-4 fs-xsmall"
              :class="computedFullnameCharacters ? 'error--text' : 'grey--text'"
            >
              <v-icon :color="computedFullnameCharacters ? 'error' : 'grey'"
                >mdi-alert-circle-outline</v-icon
              >
              The maximum number of characters for the first name and last name
              is 20 characters in total.
            </div>
            <div class="mt-4 d-flex">
              <div class="d-flex flex-column justify-space-between">
                <!-- NEW CHAT avatar -->
                <avatar
                  :size="62"
                  :username="newChat.firstName + ' ' + newChat.lastName"
                  color="#fff"
                  backgroundColor="#B0BEC5"
                ></avatar>

                <!-- NEW CHAT dialCode box -->
                <div
                  @click="openDialCodes = !openDialCodes"
                  :class="openDialCodes ? 'active' : ''"
                  class="dialCode fs-small grey--text text--darken-1 pointer"
                >
                  {{ newChat.dialCode }}
                </div>
              </div>

              <div class="ml-3" style="width:78%">
                <!-- NEW CHAT first name -->
                <v-text-field
                  class="mb-4"
                  dense
                  outlined
                  hideDetails
                  placeholder="First name"
                  v-model.trim="newChat.firstName"
                  @focus="openDialCodes = false"
                ></v-text-field>

                <!-- NEW CHAT last name -->
                <v-text-field
                  class="mb-4"
                  dense
                  outlined
                  hideDetails
                  placeholder="Last name (optional)"
                  v-model="newChat.lastName"
                  @focus="openDialCodes = false"
                ></v-text-field>

                <!-- NEW CHAT phone number -->
                <v-text-field
                  dense
                  outlined
                  hideDetails
                  type="number"
                  placeholder="Phone number"
                  v-model.trim="newChat.mobile"
                  @keyup.enter="
                    newChat.firstName && newChat.mobile ? createChat() : ''
                  "
                  @focus="openDialCodes = false"
                ></v-text-field>
              </div>
            </div>

            <!-- dialCodes list: shows when click on dialCode box -->
            <div
              class="dialCodes-box mt-5"
              :class="openDialCodes ? 'active' : ''"
            >
              <div class="pa-3">
                <!-- dialCode search field -->
                <v-text-field
                  dense
                  rounded
                  placeholder="Search in country name..."
                  hideDetails
                  class="mb-2 no-border-field"
                  style="background-color: #fff;"
                  v-model="countryFilter"
                >
                  <!-- SEARCH icon -->
                  <template v-slot:prepend-inner>
                    <div>
                      <v-icon small class="mr-2" style="margin-top: 11px"
                        >$Search</v-icon
                      >
                    </div>
                  </template>
                  <!-- CLOSE icon -->
                  <template v-slot:append>
                    <div
                      class="pointer"
                      v-if="countryFilter"
                      @click="countryFilter = ''"
                    >
                      <v-icon color="primary" small class="mt-3"
                        >mdi-close</v-icon
                      >
                    </div>
                  </template>
                </v-text-field>

                <div class="dialCodes-list">
                  <!-- NO RESULT box when there is no filter result for country -->
                  <div v-if="!filteredContries.length" class="text-center">
                    <span class="fs-medium grey--text"
                      >No result for "{{ countryFilter }}"</span
                    >
                  </div>

                  <!-- dialCode item -->
                  <div
                    v-for="(item, index) in filteredContries"
                    :key="index"
                    class="list-item d-flex justify-space-between fs-medium pointer"
                    @click="selectDialCode(item)"
                  >
                    <p class="mb-0">
                      <!-- country flag -->
                      <country-flag :country="item.code" size="small" />
                      <!-- country name -->
                      <span class="pl-1 fs-small">
                        {{
                          item.name.length > 28
                            ? item.name.slice(0, 28) + "..."
                            : item.name
                        }}
                      </span>
                    </p>
                    <!-- country dialCode -->
                    <p class="secondary--text mb-0 fs-small">{{ item.dial_code }}</p>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
          <!-- submit and create new chat button -->
          <div>
            <v-btn
              :disabled="!newChat.firstName || !newChat.mobile"
              @click="createChat()"
              class="create-btn primary"
              height="52"
            >
              Submit</v-btn
            >
          </div>
        </div>
      </div>

      <!-- chat content div -->
      <div class="chat-div ma-4">
        <!-- chat LOADER -->
        <v-skeleton-loader v-if="chatLoading" type="image"></v-skeleton-loader>

        <div class="chat" v-if="selectedChat.user">
          <div class="chat-header d-flex">
            <!-- chat avatar -->
            <avatar
              :username="selectedChat.user"
              :size="45"
              rounded
              color="#fff"
              class="mb-3"
              :src="selectedChat.id == '1' ? selectedChat.src : ''"
            ></avatar>
            <!-- <img width="45" height="45" src="~assets/image/user-avatar.png" /> -->

            <div class="mt-1 ml-3">
              <!-- chat user name -->
              <p
                class="fs-medium mb-0"
                :class="
                  !selectedChat.lastSeen && !selectedChat.isOnline ? 'mt-2' : ''
                "
              >
                {{ selectedChat.user }} <v-icon v-if="selectedChat.id == '1'" color="primary" small style="transform: translateY(-2px)">mdi-check-decagram</v-icon>
              </p>

              <!-- isTyping box: when user is typing a message -->
              <div
                v-if="selectedChat.isTyping"
                class="primary--text fs-xxsmall d-flex mb-4"
              >
                <span>Typing</span>
                <!-- moving dots -->
                <div class="snippet ml-3 mt-2" data-title=".dot-elastic">
                  <div class="stage">
                    <div class="dot-elastic"></div>
                  </div>
                </div>
              </div>

              <!-- online status box: when user is online to send a message -->
              <p
                v-else-if="selectedChat.isOnline"
                class="primary--text fs-xxsmall"
              >
                Online
              </p>

              <!-- user last seen box: when user is offline -->
              <p v-else class="grey--text fs-xxsmall mb-0">
                {{ selectedChat.lastSeen }}
              </p>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="chat-content">
            <!-- NO CONTENT box when there is no messages for a chat -->
            <div
              v-if="
                selectedChat.messagesByDate &&
                  !selectedChat.messagesByDate.length
              "
            >
              <v-chip small class="noContent-chip"
                >No messages here yet...</v-chip
              >
            </div>

            <!-- messages box for a sending date -->
            <div
              class="messages-by-date"
              v-for="(item, index) in selectedChat.messagesByDate"
              :key="index"
              :id="item.date"
            >
              <!-- date of sending -->
              <v-chip
                small
                @click="goToDate(item.date)"
                class="date-chip my-4"
                >{{ computedDate(item.date) }}</v-chip
              >

              <!-- box of a message -->
              <div v-for="(item2, index2) in item.messages" :key="index2">
                <v-row class="messages">
                  <v-col>
                    <div
                      :class="item2.sender == 'self' ? 'float-right' : ''"
                      style="width: fit-content"
                    >
                      <!-- message text -->
                      <div
                        class="message-box"
                        :dir="messageDirection(item2.text)"
                        :class="
                          item2.sender == 'self'
                            ? 'own-message'
                            : 'user-message'
                        "
                        :style="
                          !computedMessageTime(item.messages, index2)
                            ? 'margin-bottom: 15px'
                            : ''
                        "
                      >
                        {{ item2.text }}
                      </div>

                      <!-- message time -->
                      <div
                        v-if="computedMessageTime(item.messages, index2)"
                        class="fs-xxsmall grey--text mt-1 mb-3"
                        :class="
                          item2.sender == 'self' ? ' text-right' : 'text-left'
                        "
                      >
                        {{ item2.time }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>

          <div class="chat-footer">
            <v-text-field
              rounded
              class="no-border-field"
              style="background-color: #fff"
              placeholder="Write Your Message..."
              outlined
              hide-details
              :dir="messageDirection(messageText)"
              v-model.trim="messageText"
              @keyup.enter="messageText ? sendMessage() : ''"
            >
              <!-- SENDING icon -->
              <template v-slot:append>
                <div>
                  <v-btn
                    text
                    width="45"
                    height="45"
                    :disabled="!messageText"
                    @click="sendMessage()"
                    style="min-width: 40px; margin-top:5px"
                    ><v-icon color="primary">mdi-send</v-icon></v-btn
                  >
                </div>
              </template>
            </v-text-field>
          </div>
        </div>
        <!-- NO CONTENT box when no chat is selected -->
        <div v-else>
          <v-chip small class="noContent-chip"
            >Select a chat to start messaging...</v-chip
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid"; // id generator package for chats
import Avatar from "vue-avatar";
import CountryFlag from "vue-country-flag";
import CountryCodes from "./../../mixin/CountryCodes.vue";
export default {
  components: {
    Avatar,
    CountryFlag
  },
  mixins: [CountryCodes],
  data() {
    return {
      // String
      filter: "",
      interval: "",
      messageText: "",
      countryFilter: "",
      userMessageText: "",
      guideText: "Hello there! I am your guide friend. nice to meet you :)",

      // Object
      selectedChat: {},
      selectedItem: {},
      menuLocation: {
        x: 0,
        y: 0
      },
      newChat: {
        firstName: "",
        lastName: "",
        dialCode: "+98"
      },
      guideFriend: {},

      // Array
      chats: [],
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
        "December"
      ],

      // Boolean
      openNew: false,
      listMenu: false,
      pageLoaded: false,
      chatLoading: false,
      openDialCodes: false,
      userChatDialog: false,
      deleteChatConfirmation: false,
      clearHistoryConfirmation: false
    };
  },
  methods: {
    // This function is called to change the display form of the date
    computedDate(date) {
      let year = date.split("/")[0]; // GET YEAR of the date
      let month = Number(date.split("/")[1]); // GET MONTH of the date
      let day = Number(date.split("/")[2]); // GET DAY of the date
      let monthName = this.months[month]; // Get the name of the month ex: April, June,...
      return monthName + " " + day + ", " + year;
    },
    // This function is called to show time only once for messages sent at the same time
    computedMessageTime(item, index) {
      if (item[Number(index) + 1]) {
        if (item[Number(index) + 1].sender == item[Number(index)].sender) {
          if (item[Number(index) + 1].time == item[Number(index)].time) {
            return false;
          } else return true;
        } else return true;
      } else return true;
    },
    // This function is called to go to the beginning of the messages box of a date
    goToDate(date) {
      document.getElementById(date).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    // the function to detect message text direction
    messageDirection(value) {
      var rtl_rx = /[\u0591-\u07FF]/;
      return rtl_rx.test(value) ? "rtl" : "ltr";
    },
    // This function is called to scroll down to the end of messages box
    scrollToEnd() {
      var container = document.querySelector(".chat-content");
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    // This function is called to set and update chats data in localStorage
    setInLocalStorage() {
      localStorage.setItem("chats", JSON.stringify(this.chats));
    },
    // This function is called after select a chat from list to display chat data
    selectChat(chat) {
      if (this.selectedChat != chat) {
        this.chatLoading = true;
        this.selectedChat = chat; // selectedChat contains one chat's object

        setTimeout(() => {
          this.scrollToEnd();
        }, 50);

        setTimeout(() => {
          this.chatLoading = false;
          // Update unseen messages number when open the chat
          let index = this.chats.findIndex(x => x.id == this.selectedChat.id);
          this.chats[index].unseenNumber = 0;
          this.setInLocalStorage();
        }, 900);
      }
    },
    // This function is called to get today's date
    todayDate() {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();

      return yyyy + "/" + mm + "/" + dd;
    },
    // This function is called to get current time
    currentTime() {
      let today = new Date();
      let hour, minute;
      hour = ("0" + today.getHours()).slice(-2);
      minute = ("0" + today.getMinutes()).slice(-2);

      return hour + ":" + minute;
    },
    // This function is called to update last activity when an activity is carried out by US
    updateActivityBySelf() {
      let index = this.chats.findIndex(x => x.id == this.selectedChat.id);
      this.chats[index].lastAcivity = Date.now();
    },
    // This function is called to update last activity when an activity is carried out by USER
    updateActivityByUser() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      this.chats[index].lastAcivity = Date.now();
    },
    // This function is called to send message is from US
    sendMessage() {
      if (this.selectedChat.messagesByDate.length) {
        // Checks if there are any messages or not
        let lastIndex = this.selectedChat.messagesByDate.length - 1; // Index of the last object in messagesByDate

        if (
          this.todayDate() == this.selectedChat.messagesByDate[lastIndex].date // Checks today's date with the date of the last message
        ) {
          // In case of equality the new message object will be pushed in messages of the last object of messagesByDate
          this.selectedChat.messagesByDate[lastIndex].messages.push({
            sender: "self",
            text: this.messageText,
            time: this.currentTime()
          });
        } else {
          // If not equal, a new object will be created with today's date and the new message object will be pushed in its messages.
          this.selectedChat.messagesByDate.push({
            date: this.todayDate(),
            messages: [
              {
                sender: "self",
                text: this.messageText,
                time: this.currentTime()
              }
            ]
          });
        }
      } else {
        // If no message already exists, a new object will be created with today's date and the new message object will be pushed in its messages.
        this.selectedChat.messagesByDate.push({
          date: this.todayDate(),
          messages: [
            {
              sender: "self",
              text: this.messageText,
              time: this.currentTime()
            }
          ]
        });
      }

      this.messageText = "";
      setTimeout(() => {
        this.scrollToEnd();
      }, 10);
      setTimeout(() => {
        this.updateActivityBySelf();
      }, 100);
      setTimeout(() => {
        this.setInLocalStorage();
      }, 150);
    },
    // This function is called to send message is from USER
    sendUserMessage() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id); // Find index of user's chat object in chats list

      if (this.chats[index].messagesByDate.length) {
        let lastIndex = this.chats[index].messagesByDate.length - 1;

        if (
          this.todayDate() == this.chats[index].messagesByDate[lastIndex].date
        ) {
          this.chats[index].messagesByDate[lastIndex].messages.push({
            sender: "user",
            text: this.userMessageText,
            time: this.currentTime()
          });
        } else {
          this.chats[index].messagesByDate.push({
            date: this.todayDate(),
            messages: [
              {
                sender: "user",
                text: this.userMessageText,
                time: this.currentTime()
              }
            ]
          });
        }
      } else {
        this.chats[index].messagesByDate.push({
          date: this.todayDate(),
          messages: [
            {
              sender: "user",
              text: this.userMessageText,
              time: this.currentTime()
            }
          ]
        });
      }

      this.userMessageText = "";
      this.increaseUnseenMessages();
      this.setInLocalStorage();
      setTimeout(() => {
        this.scrollToEnd();
      }, 10);
      setTimeout(() => {
        this.updateActivityByUser();
      }, 100);
    },
    // This function is called to increase unseen messages number when user send a message (if that chat is not open)
    increaseUnseenMessages() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      if (this.chats[index] != this.selectedChat) {
        this.chats[index].unseenNumber++;
      }
    },
    // This function is called to computed last message that sent in a chat
    computedLastMessage(chat) {
      if (
        // Checks if there are any messages or not
        chat.messagesByDate.length &&
        chat.messagesByDate[chat.messagesByDate.length - 1].messages.length
      ) {
        return (
          (chat.messagesByDate[chat.messagesByDate.length - 1].messages[
            chat.messagesByDate[chat.messagesByDate.length - 1].messages
              .length - 1
          ].sender == "self"
            ? "You: "
            : "") +
          chat.messagesByDate[chat.messagesByDate.length - 1].messages[
            chat.messagesByDate[chat.messagesByDate.length - 1].messages
              .length - 1
          ].text
        );
      } else {
        return "No Messages yet";
      }
    },
    // This function is called to computed the date of last activity
    computedChatDate(chat) {
      if (chat.messagesByDate.length) {
        return chat.messagesByDate[chat.messagesByDate.length - 1].date;
      } else return "";
    },
    // This function is called to show menu after right click on each chat box in the list
    showListMenu(e) {
      e.preventDefault();
      this.listMenu = false;
      this.menuLocation.x = e.clientX;
      this.menuLocation.y = e.clientY;
      this.$nextTick(() => {
        this.listMenu = true;
      });
    },
    // This function is called to get data of the chat that we clicked (right click)
    getClickedChatData(chat) {
      this.selectedItem = chat;
    },
    // This function is called to change "isTyping" value of the chat when the user of chat is typing message or stop typing
    changeUserTypingStatus() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      this.chats[index].isTyping = true;

      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.chats[index].isTyping = false;
      }, 1000);
    },
    // This function is called to open new chat dialog
    openNewChat() {
      this.openNew = true;
    },
    // This function is called to close new chat dialog and reset newChat object
    closeNewChat() {
      this.openNew = false;
      this.openDialCodes = false;
      this.newChat = {
        firstName: "",
        lastName: "",
        dialCode: "+98"
      };
    },
    // This function is called to set selected dialCode as new chat user's mobile dialCode
    selectDialCode(item) {
      this.openDialCodes = false;
      this.newChat.dialCode = item.dial_code;
      setTimeout(() => {
        this.countryFilter = "";
      }, 1000);
    },
    // This function is called to create new chat
    createChat() {
      this.chats.push({
        id: uuidv4(),
        user: `${this.newChat.firstName} ${this.newChat.lastName}`,
        mobile: this.newChat.dialCode + this.newChat.mobile,
        unseenNumber: 0,
        isTyping: false,
        isOnline: false,
        lastSeen: "",
        lastAcivity: 0,
        messagesByDate: []
      });
      this.setInLocalStorage();
      this.openNew = false;
      this.newChat = {
        firstName: "",
        lastName: "",
        dialCode: "+98"
      };
    },
    // This function is called to delete desired chat from chats list
    deleteChat() {
      this.deleteChatConfirmation = false;
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      if (
        this.selectedChat.id &&
        this.selectedChat.id == this.selectedItem.id
      ) {
        this.selectedChat = {};
      }
      this.chats.splice(index, 1);
      this.setInLocalStorage();
    },
    // This function is called to clear history of desired chat
    clearHistory() {
      this.clearHistoryConfirmation = false;
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      this.chats[index].messagesByDate = [];
      this.setInLocalStorage();
    }
  },
  computed: {
    // Filter and sort chats list
    filteredChats() {
      let sortedChats = this.chats.sort(
        (a, b) => b.lastAcivity - a.lastAcivity
      );
      let filtered = sortedChats.filter(x =>
        x.user.toLowerCase().includes(this.filter)
      );
      return filtered;
    },
    // Computed the field placeholder of the USER chat
    computedFieldPlaceholder() {
      return this.selectedItem.user + "'s Message...";
    },
    // Filter countries in dialCodes list
    filteredContries() {
      let filtered = this.countryCodes.filter(x =>
        x.name.toLowerCase().includes(this.countryFilter)
      );
      return filtered;
    },
    // Check full name characters number
    computedFullnameCharacters() {
      if (this.newChat.firstName || this.newChat.lastName) {
        if (this.newChat.firstName.length + this.newChat.lastName.length > 20) {
          return true;
        } else return false;
      } else return false;
    }
  },
  watch: {
    userChatDialog(val) {
      if (val && this.selectedItem.id) {
        let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
        this.chats[index].isOnline = true;
      } else if (!val) {
        let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();
        this.chats[index].isOnline = false;
        this.chats[index].lastSeen =
          yyyy +
          "/" +
          mm +
          "/" +
          dd +
          " at " +
          ("0" + today.getHours()).slice(-2) +
          ":" +
          ("0" + today.getMinutes()).slice(-2);
      }
      this.setInLocalStorage();
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setInLocalStorage(); // update chats in localStorage before route leave
    next();
  },
  mounted() {
    this.guideFriend = {
      id: '1',
      user: "Gide Friend",
      src:"/guide-friend.jpg",
      unseenNumber: 0,
      isTyping: false,
      isOnline: false,
      lastSeen: "",
      lastAcivity: 0,
      messagesByDate: [
        {
          date: this.todayDate(),
          messages: [
            {
              sender: "user",
              text: this.guideText,
              time: this.currentTime()
            }
          ]
        }
      ]
    };
    setTimeout(() => {
      this.pageLoaded = true;
    }, 10);
    // Get chats array from localStorage
    this.chats = localStorage.getItem("chats")
      ? JSON.parse(localStorage.getItem("chats"))
      : "";
  }
};
</script>
<style lang="scss">
.v-menu__content {
  box-shadow: rgba(81, 81, 81, 0.15) 1.95px 1.95px 2.6px !important;
  border-radius: 10px !important;
  .v-list-item {
    height: 30px !important;
  }
  .v-list-item__icon {
    margin: 12px 0 !important;
  }
}
</style>
