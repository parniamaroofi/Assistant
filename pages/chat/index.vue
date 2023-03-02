<template>
  <div class="chats">
    <div class="chat-card" @keyup.esc="selectedChat = {}" tabindex="0">
      <div class="chats-list">
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
            <template v-slot:prepend-inner>
              <div>
                <v-icon class="mr-2">$Search</v-icon>
              </div>
            </template>
            <template v-slot:append>
              <div class="pointer" v-if="filter" @click="filter = ''">
                <v-icon color="primary">mdi-close</v-icon>
              </div>
            </template>
          </v-text-field>
        </div>
        <div v-if="!filteredChats.length" class="text-center mt-8">
          <p class="fs-medium grey--text text--darken-1">
            No result for "{{ filter }}"
          </p>
        </div>
        <div v-for="(chat, index) in filteredChats" :key="index">
          <div @contextmenu="getClickedChatData(chat)">
            <div
              @click="selectChat(chat)"
              @contextmenu="showListMenu"
              class="chat-box d-flex"
            >
              <div>
                <avatar
                  :username="chat.sender"
                  :size="54"
                  rounded
                  color="#fff"
                  backgroundColor="#B0BEC5"
                ></avatar>
                <!-- <img width="55" src="~assets/image/user-avatar.png" /> -->
              </div>
              <div
                class="ml-3 mt-2 d-flex justify-space-between"
                style="width: 100%"
              >
                <div>
                  <p class="fs-medium mb-0">{{ chat.sender }}</p>
                  <div
                    class="mb-0 fs-xsmall primary--text d-flex"
                    v-if="chat.isTyping"
                  >
                    <span>Typing</span>
                    <div class="snippet ml-3 mt-2" data-title=".dot-elastic">
                      <div class="stage">
                        <div class="dot-elastic"></div>
                      </div>
                    </div>
                  </div>
                  <p v-else class="mb-0 fs-xsmall grey--text">
                    {{
                      computedLastMessage(chat).length > 22
                        ? computedLastMessage(chat).slice(0, 22) + "..."
                        : computedLastMessage(chat)
                    }}
                  </p>
                </div>

                <div class="text-right">
                  <v-badge
                    v-if="chat.unseenNumber"
                    :content="chat.unseenNumber"
                    class="mr-4"
                  ></v-badge>
                  <p class="mb-0" v-else>&nbsp;</p>
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
          <v-menu
            v-model="listMenu"
            :position-x="menuLocation.x"
            :position-y="menuLocation.y"
            absolute
            offset-y
          >
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-pin-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title
                  class="fs-small pl-2 grey--text text--darken-2"
                  >Pin Chat
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="userChatDialog = true">
                <v-list-item-icon>
                  <v-icon>mdi-message-arrow-left-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title
                  class="fs-small pl-2 grey--text text--darken-2"
                  >Send Messege From {{ selectedItem.sender }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider class="my-1"></v-divider>
        </div>

        <div
          @click="userChatDialog = false"
          v-if="userChatDialog"
          class="backDrop"
        >
          &nbsp;
        </div>
        <div
          class="userChatDialog"
          :class="userChatDialog ? 'active' : ''"
          @keyup.esc="userChatDialog = false"
          tabindex="1"
        >
          <v-card flat>
            <v-container
              class="dialog-body d-flex flex-column justify-space-between h-100"
            >
              <div class="text-right">
                <span @click="userChatDialog = false">
                  <v-icon class="pointer">$Close</v-icon>
                </span>
              </div>

              <div>
                <div>
                  <span class="fs-xlarge">
                    Send Message From
                    <span class="primary--text">{{ selectedItem.sender }}</span>
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
                    v-model="userMessageText"
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
        <v-btn @click="openNew = true" class="new-btn secondary lighten-1"
          ><v-icon class="light-icon">$PenNoLine</v-icon></v-btn
        >

        <div class="new-chat" :class="openNew ? 'active' : ''">
          <v-card flat class="main-card pa-5">
            <div class="d-flex justify-space-between">
              <span class="fs-xlarge">Create New Chat</span>
              <span @click="openNew = false" class="pointer"
                ><v-icon>$ArrowRight</v-icon></span
              >
            </div>
            <div class="mt-10 d-flex">
              <div class="d-flex flex-column justify-space-between">
                <avatar
                  :size="62"
                  :username="newChat.firstName + ' ' + newChat.lastName"
                  color="#fff"
                  backgroundColor="#B0BEC5"
                ></avatar>

                <div>
                  <v-text-field
                    dense
                    outlined
                    hideDetails
                    readonly
                    style="width:67px !important"
                    v-model="newChat.dialCode"
                  ></v-text-field>
                </div>
              </div>
              <div class="ml-3" style="width:78%">
                <v-text-field
                  class="mb-4"
                  dense
                  outlined
                  hideDetails
                  placeholder="First name"
                  v-model="newChat.firstName"
                ></v-text-field>

                <v-text-field
                  class="mb-4"
                  dense
                  outlined
                  hideDetails
                  placeholder="Last name (optional)"
                  v-model="newChat.lastName"
                ></v-text-field>

                <v-text-field
                  dense
                  outlined
                  hideDetails
                  placeholder="Phone number"
                  v-model="newChat.phone"
                ></v-text-field>
              </div>
            </div>
            <div class="mt-6">
              <v-text-field
                dense
                filled
                rounded
                placeholder="Search by country name..."
                hideDetails
                class="mb-4"
              >
                <template v-slot:prepend-inner>
                  <div>
                    <v-icon small class="mr-2 pt-1">$Search</v-icon>
                  </div>
                </template>
                <template v-slot:append>
                  <div class="pointer" v-if="filter" @click="filter = ''">
                    <v-icon color="primary">mdi-close</v-icon>
                  </div>
                </template>
              </v-text-field>

              <div class="country-codes-box">
                <div
                  v-for="(item, index) in countryCodes"
                  :key="index"
                  class="d-flex justify-space-between fs-medium pointer"
                  @click="newChat.dialCode = item.dial_code"
                >
                  <p>
                    <country-flag :country="item.code" size="small" />
                    <span class="pl-1">
                      {{
                        item.name.length > 30
                          ? item.name.slice(0, 30) + "..."
                          : item.name
                      }}s
                    </span>
                  </p>
                  <p class="secondary--text">{{ item.dial_code }}</p>
                </div>
              </div>
            </div>
          </v-card>
          <div>
            <v-btn class="create-btn primary" height="52">Create</v-btn>
          </div>
        </div>
      </div>

      <div class="chat-div ma-4">
        <v-skeleton-loader v-if="chatLoading" type="image"></v-skeleton-loader>
        <div class="chat" v-if="selectedChat.sender">
          <div class="chat-header d-flex">
            <avatar
              :username="selectedChat.sender"
              :size="45"
              rounded
              color="#fff"
              backgroundColor="#B0BEC5"
            ></avatar>
            <!-- <img width="45" height="45" src="~assets/image/user-avatar.png" /> -->
            <div class="mt-1 ml-3">
              <p class="fs-medium mb-0">{{ selectedChat.sender }}</p>
              <div
                v-if="selectedChat.isTyping"
                class="primary--text fs-xxsmall d-flex mb-4"
              >
                <span>Typing</span>
                <div class="snippet ml-3 mt-2" data-title=".dot-elastic">
                  <div class="stage">
                    <div class="dot-elastic"></div>
                  </div>
                </div>
              </div>
              <p
                v-else-if="selectedChat.isOnline"
                class="primary--text fs-xxsmall"
              >
                Online
              </p>
              <p v-else class="grey--text fs-xxsmall">
                {{ selectedChat.lastSeen }}
              </p>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="chat-content">
            <div
              class="messages-by-date"
              v-for="(item, index) in selectedChat.messagesByDate"
              :key="index"
              :id="item.date"
            >
              <v-chip
                small
                @click="goToDate(item.date)"
                class="date-chip my-4"
                >{{ computedDate(item.date) }}</v-chip
              >
              <div v-for="(item2, index2) in item.messages" :key="index2">
                <v-row class="messages">
                  <v-col>
                    <div
                      :class="item2.sender == 'self' ? 'float-right' : ''"
                      style="width: fit-content"
                    >
                      <div
                        class="message-box"
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
              v-model="messageText"
              @keyup.enter="messageText ? sendMessage() : ''"
            >
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

        <div v-else>
          <v-chip small class="noChat-chip"
            >Select a chat to start messaging...</v-chip
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
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
      filter: "",
      messageText: "",
      userMessageText: "",
      selectedChat: {},
      chatLoading: false,
      userChatDialog: false,
      listMenu: false,
      menuLocation: {
        x: 0,
        y: 0
      },
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

      chats: [],
      selectedItem: {},
      newChat: {
        firstName: "",
        lastName: "",
        dialCode: "+98"
      },
      interval: "",
      openNew: false
    };
  },
  methods: {
    computedDate(date) {
      let year = date.split("/")[0];
      let month = Number(date.split("/")[1]);
      let day = Number(date.split("/")[2]);
      let monthName = this.months[month];
      return monthName + " " + day + ", " + year;
    },
    computedMessageTime(item, index) {
      if (item[Number(index) + 1]) {
        if (item[Number(index) + 1].time == item[Number(index)].time) {
          return false;
        } else return true;
      } else return true;
    },
    goToDate(date) {
      document.getElementById(date).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    scrollToEnd() {
      var container = document.querySelector(".chat-content");
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    setInLocalStorage() {
      localStorage.setItem("chats", JSON.stringify(this.chats));
    },
    selectChat(chat) {
      if (this.selectedChat != chat) {
        this.chatLoading = true;
        this.selectedChat = chat;
        let index = this.chats.findIndex(x => x.id == this.selectedChat.id);
        this.chats[index].unseenNumber = 0;
        this.setInLocalStorage();
        setTimeout(() => {
          this.scrollToEnd();
        }, 50);
        setTimeout(() => {
          this.chatLoading = false;
        }, 900);
      }
    },
    todayDate() {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();

      return yyyy + "/" + mm + "/" + dd;
    },
    currentTime() {
      let today = new Date();
      let hour, minute;
      if (today.getHours() < 10) {
        hour = "0" + today.getHours();
      } else {
        hour = today.getHours();
      }

      if (today.getMinutes() < 10) {
        minute = "0" + today.getMinutes();
      } else {
        minute = today.getMinutes();
      }

      return hour + ":" + minute;
    },
    updateActivityFromSelf() {
      let index = this.chats.findIndex(x => x.id == this.selectedChat.id);
      this.chats[index].lastAcivity = Date.now();
    },
    updateActivityFromUser() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      this.chats[index].lastAcivity = Date.now();
    },
    sendMessage() {
      if (this.selectedChat.messagesByDate.length) {
        let lastIndex = this.selectedChat.messagesByDate.length - 1;

        if (
          this.todayDate() == this.selectedChat.messagesByDate[lastIndex].date
        ) {
          this.selectedChat.messagesByDate[lastIndex].messages.push({
            sender: "self",
            text: this.messageText,
            time: this.currentTime()
          });
        } else {
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
        this.updateActivityFromSelf();
      }, 100);
      setTimeout(() => {
        this.setInLocalStorage();
      }, 150);
    },
    sendUserMessage() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);

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
          setTimeout(() => {
            this.updateActivityFromUser();
          }, 100);
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
          setTimeout(() => {
            this.updateActivityFromUser();
          }, 100);
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
        setTimeout(() => {
          this.updateActivityFromUser();
        }, 100);
      }

      this.userMessageText = "";
      this.checkUnseenMessages();
      this.setInLocalStorage();
      setTimeout(() => {
        this.scrollToEnd();
      }, 10);
    },
    checkUnseenMessages() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      if (this.chats[index] != this.selectedChat) {
        this.chats[index].unseenNumber++;
      }
    },
    computedLastMessage(chat) {
      if (
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
        return "No Message yet";
      }
    },
    computedChatDate(chat) {
      if (chat.messagesByDate.length) {
        return chat.messagesByDate[chat.messagesByDate.length - 1].date;
      } else return "";
    },
    showListMenu(e) {
      e.preventDefault();
      this.listMenu = false;
      this.menuLocation.x = e.clientX;
      this.menuLocation.y = e.clientY;
      this.$nextTick(() => {
        this.listMenu = true;
      });
    },
    getClickedChatData(chat) {
      this.selectedItem = chat;
    },
    changeUserTypingStatus() {
      let index = this.chats.findIndex(x => x.id == this.selectedItem.id);
      this.chats[index].isTyping = true;

      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.chats[index].isTyping = false;
      }, 1000);
    }
  },
  computed: {
    filteredChats() {
      let sortedChats = this.chats.sort(
        (a, b) => b.lastAcivity - a.lastAcivity
      );
      let filtered = sortedChats.filter(x =>
        x.sender.toLowerCase().includes(this.filter)
      );
      return filtered;
    },
    computedFieldPlaceholder() {
      return this.selectedItem.sender + "'s Message...";
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
          today.getHours() +
          ":" +
          today.getMinutes();
        // this.selectedItem = {};
      }
      this.setInLocalStorage();
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setInLocalStorage();
    next();
  },
  mounted() {
    this.chats = localStorage.getItem("chats")
      ? JSON.parse(localStorage.getItem("chats"))
      : "";
  }
};
</script>
<style lang="scss">
.v-menu__content {
  box-shadow: rgba(81, 81, 81, 0.15) 1.95px 1.95px 2.6px !important;
  border-radius: 8px !important;
}
</style>
