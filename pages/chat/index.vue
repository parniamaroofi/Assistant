<template>
  <div class="chats">
    <div class="chat-card">
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
            </template></v-text-field
          >
        </div>
        <div v-for="(chat, index) in filteredChats" :key="index">
          <div class="chat-box d-flex mt-1">
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
                    chat.lastMessage.length > 22
                      ? chat.lastMessage.slice(0, 22) + "..."
                      : chat.lastMessage
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
                <p class="mb-0 fs-xxsmall grey--text mt-1">{{ chat.date }}</p>
              </div>
            </div>
          </div>
          <v-divider class="my-1"></v-divider>
        </div>
      </div>

      <div class="private-chat ma-4">
        <div class="chat-header d-flex">
          <img width="45" height="45" src="~assets/image/user-avatar.png" />
          <div class="mt-1 ml-3">
            <p class="fs-medium mb-0">Romina</p>
            <p class="primary--text fs-xxsmall">Online</p>
          </div>
        </div>

        <v-divider class="mb-2"></v-divider>

        <div class="chat-content">
          <v-row class="messages">
            <v-col>
              <div class="message-box user-message">Hello dear :)</div>
              <div class="fs-xxsmall grey--text mt-1">8:12</div>
            </v-col>
          </v-row>
          <v-row class="messages">
            <v-col>
              <div class="float-right" style="width: fit-content">
                <div class="message-box own-message">
                  Hey! what's up?
                </div>
                <div class="fs-xxsmall grey--text mt-1 text-right">8:14</div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="chat-footer">
          <v-text-field
            rounded
            style="background-color: #fff"
            placeholder="Write Your Message..."
            outlined
            hide-details
            v-model="messageText"
          >
            <template v-slot:append>
              <div>
                <v-btn
                  text
                  width="45"
                  height="45"
                  :disabled="!messageText"
                  style="min-width: 40px; margin-top:5px"
                  ><v-icon color="primary">mdi-send</v-icon></v-btn
                >
              </div>
            </template>
          </v-text-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: "",
      messageText: "",
      chats: [
        {
          sender: "Romina",
          lastMessage: "Hello Sis! ;)",
          unseenNumber: 1,
          date: "2023/02/16"
        },
        {
          sender: "Arina",
          lastMessage: "What is going on?!?!",
          unseenNumber: 2,
          date: "2023/02/16"
        },
        {
          sender: "Sarah",
          lastMessage: "Good! i hope you pass your exam with a great score!",
          unseenNumber: 0,
          date: "2023/02/14"
        }
      ]
    };
  },
  computed: {
    filteredChats() {
      let filtered = this.chats.filter(x =>
        x.sender.toLowerCase().includes(this.filter)
      );
      return filtered;
    }
  }
};
</script>

<style lang="scss">
.chats {
  .chat-card {
    height: 90vh;
    box-shadow: 0 3px 3px #ccc;
    border: 1px solid #eee;
    margin-top: 3%;
    border-radius: 12px;
    background: rgb(243, 248, 248);
    background: linear-gradient(
      57deg,
      rgba(243, 248, 248, 1) 0%,
      rgba(211, 233, 227, 1) 100%
    );
    display: flex;

    .chats-list {
      width: 550px;
      height: 100%;
      padding: 20px 10px;
      border-right: 1px solid #e3e3e3;
    }

    .chat-box {
      padding: 10px 11px 0;
      border-radius: 7px;
      cursor: pointer;
      img {
        border-radius: 50%;
      }
      &:hover {
        background-color: #dbe3ff;
      }
    }

    .private-chat {
      border-radius: 10px;
      width: 100%;
      height: 85vh;
      .chat-header {
        img {
          border-radius: 50%;
        }
      }

      .chat-content {
        height: 80%;
        width: 100%;
        padding-top: 15px;
        .message-box {
          width: fit-content;
          max-width: 250px;
          min-width: 150px;
          margin-top: 3px;
          font-size: 0.8rem;
          padding: 12px;
        }
        .user-message {
          color: #fff;
          background-color: #00acc1;
          border-radius: 12px 12px 12px 0;
        }
        .own-message {
          color: #272727;
          background-color: #fff;
          border-radius: 12px 12px 0 12px;
        }
      }

      .chat-footer {
        .v-input__append-inner {
          margin: 0 !important;
        }
      }
    }
  }
}
</style>
