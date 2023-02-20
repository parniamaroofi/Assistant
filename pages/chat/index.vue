<template>
  <div class="chats">
    <div class="chat-card" @keyup.esc="selectedChat = {}" tabindex="0">
      <div class="chats-list">
        <div class="mb-4">
          <v-text-field
            class="mx-2"
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
          <!-- @contextmenu="showListMenu" -->
          <div @contextmenu="getChatData(chat)">
            <div
              @click="selectChat(chat, index)"
              @contextmenu="showListMenu"
              class="chat-box d-flex mt-1"
            >
              <div>
                <img width="55" src="~assets/image/user-avatar.png" />
              </div>
              <div
                class="ml-3 mt-2 d-flex justify-space-between"
                style="width: 100%"
              >
                <div>
                  <p class="fs-medium mb-0">{{ chat.sender }}</p>
                  <p class="mb-0 fs-xsmall grey--text">
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
                    {{ computedChatDate(chat) }}
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
                  <v-icon>mdi-message-arrow-left-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="fs-small pl-2"
                  >Messege From {{ selectedItem.sender }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider class="my-1"></v-divider>
        </div>
      </div>

      <div class="chat-div ma-4">
        <v-skeleton-loader v-if="chatLoading" type="image"></v-skeleton-loader>
        <div class="chat" v-if="selectedChat.sender">
          <div class="chat-header d-flex">
            <img width="45" height="45" src="~assets/image/user-avatar.png" />
            <div class="mt-1 ml-3">
              <p class="fs-medium mb-0">{{ selectedChat.sender }}</p>
              <p v-if="selectedChat.isOnline" class="primary--text fs-xxsmall">
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
export default {
  data() {
    return {
      filter: "",
      messageText: "",
      selectedChat: {},
      selectedIndex: null,
      chatLoading: false,
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

      selectedItem: {}
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
    selectChat(chat, index) {
      if (this.selectedChat != chat) {
        this.chatLoading = true;
        this.selectedChat = chat;
        this.selectedIndex = index;
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

      return today.getHours() + ":" + today.getMinutes();
    },
    updateActivity() {
      this.chats[this.selectedIndex].lastAcivity = Date.now();
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
          setTimeout(() => {
            this.updateActivity();
          }, 100);
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
          setTimeout(() => {
            this.updateActivity();
          }, 100);
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
        setTimeout(() => {
          this.updateActivity();
        }, 100);
      }

      this.messageText = "";
      localStorage.setItem("chats", JSON.stringify(this.chats));
      setTimeout(() => {
        this.scrollToEnd();
      }, 10);
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
    getChatData(chat) {
      this.selectedItem = chat;
    }
  },
  computed: {
    filteredChats() {
      // let sortedChats = this.chats.sort(
      //   (a, b) => a.lastAcivity > b.lastAcivity
      // );
      let filtered = this.chats.filter(x =>
        x.sender.toLowerCase().includes(this.filter)
      );
      return filtered;
    }
  },
  mounted() {
    this.chats = localStorage.getItem("chats")
      ? JSON.parse(localStorage.getItem("chats"))
      : "";
    // localStorage.setItem("chats", JSON.stringify(this.chats));
  }
};
</script>
<style lang="scss">
.v-menu__content {
  box-shadow: rgba(81, 81, 81, 0.15) 1.95px 1.95px 2.6px !important;
  border-radius: 8px !important;
}
</style>
