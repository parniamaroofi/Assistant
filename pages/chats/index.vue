<template>
  <div class="chats" v-if="pageLoaded">
    <!-- main div -->
    <div class="chat-card" @keyup.esc="closeChat()" tabindex="0">
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
            dense
            style="background-color: #fff"
            v-model="filter"
          >
            <!-- SEARCH icon -->
            <template v-slot:prepend-inner>
              <div>
                <v-icon class="mr-2" style="margin-top: 1px">$Search</v-icon>
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
        <!-- NO RESULT BOX when there is no filter result for chats -->
        <div v-if="filter && !filteredChats.length" class="text-center mt-8">
          <p class="fs-medium grey--text text--darken-1">
            No result for "{{ filter }}"
          </p>
        </div>
        <!-- list of ALL CHATS -->

        <div class="all-chats">
          <div
            v-if="!filter"
            class="chat-box d-flex"
            @click="selectChat(guideFriend)"
          >
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
              style="width: 100%; margin-top: 6px"
            >
              <div>
                <!-- user of a chat -->
                <p class="fs-small mb-0 mainBlack--text">
                  {{ guideFriend.user }}
                  <v-icon
                    color="primary"
                    small
                    style="transform: translateY(-2px)"
                    >mdi-check-decagram</v-icon
                  >
                </p>

                <!-- preview of the last sent chat message -->
                <p class="mb-0 fs-xsmall grey--text">
                  {{
                    computedLastMessage(guideFriend).length > 22
                      ? `${computedLastMessage(guideFriend).slice(0, 22)}...`
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
                  style="width: 100%; margin-top: 6px"
                >
                  <div>
                    <!-- user of a chat -->
                    <p class="fs-small mb-0 mainBlack--text">
                      {{ chat.user }}
                    </p>

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
                          ? `${removeBrTags(computedLastMessage(chat)).slice(
                              0,
                              22
                            )}...`
                          : removeBrTags(computedLastMessage(chat))
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
                    <div v-else-if="chat.isPinned" class="pin-badge ml-auto">
                      <v-icon small color="primary">mdi-pin</v-icon>
                    </div>
                    <p class="mb-0" v-else>&nbsp;</p>

                    <!-- the date of the last message sent in the chat -->
                    <p class="mb-0 fs-xxsmall grey--text" style="height: 17px">
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
                <v-list-item @click="togglePinChat()">
                  <v-list-item-icon>
                    <v-icon>{{
                      !selectedItem.isPinned
                        ? "mdi-pin-outline"
                        : "mdi-pin-off-outline"
                    }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="fs-small pl-2 mainBlack--text"
                    >{{ !selectedItem.isPinned ? "Pin chat" : "Unpin chat" }}
                  </v-list-item-title>
                </v-list-item>

                <!-- DELETE CHAT item -->
                <v-list-item @click="deleteChatConfirmation = true">
                  <v-list-item-icon>
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="fs-small pl-2 mainBlack--text"
                    >Delete chat
                  </v-list-item-title>
                </v-list-item>

                <!-- CLEAR HISTORY item -->
                <v-list-item @click="clearHistoryConfirmation = true">
                  <v-list-item-icon>
                    <v-icon style="font-size: 22px"
                      >mdi-chat-remove-outline</v-icon
                    >
                  </v-list-item-icon>
                  <v-list-item-title class="fs-small pl-2 mainBlack--text"
                    >Clear history
                  </v-list-item-title>
                </v-list-item>

                <!-- SEND MESSAGE FROM USER item -->
                <v-list-item @click="openUserChat()">
                  <v-list-item-icon>
                    <v-icon style="font-size: 22px; transform: translateY(2px)"
                      >mdi-message-arrow-left-outline</v-icon
                    >
                  </v-list-item-icon>
                  <v-list-item-title class="fs-small pl-2 mainBlack--text"
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
              <div>
                <span class="fs-medium"
                  >Are you sure you want to delete chat with
                  <b>{{ selectedItem.user }}</b
                  >?</span
                >

                <!-- DELETE CHAT dialog operation button -->
                <div class="mt-5 text-right">
                  <v-btn
                    @click="deleteChatConfirmation = false"
                    color="secondary"
                    text
                    >Cancel</v-btn
                  >

                  <v-btn @click="deleteChat()" color="error" text
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
              <div>
                <span class="fs-medium"
                  >Are you sure you want to clear chat history with
                  <b>{{ selectedItem.user }}</b
                  >?</span
                >

                <!-- CLEAR HISTORY dialog operation buttons -->
                <div class="mt-5 text-right">
                  <v-btn
                    @click="clearHistoryConfirmation = false"
                    color="secondary"
                    text
                    >Cancel</v-btn
                  >
                  <v-btn @click="clearHistory()" color="error" text
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
                    class="no-border-field mb-3"
                    rounded
                    style="background-color: #fff"
                    :placeholder="computedFieldPlaceholder"
                    outlined
                    hide-details
                    dense
                    id="user-field"
                    v-model.trim="userMessageText"
                    @input="changeUserTypingStatus()"
                    @keyup.enter="userMessageText ? sendUserMessage() : ''"
                    :dir="messageDirection(userMessageText)"
                  >
                    <template v-slot:append>
                      <div>
                        <v-btn
                          text
                          width="45"
                          height="45"
                          :disabled="!userMessageText"
                          @click="sendUserMessage()"
                          style="min-width: 40px; transform: translateY(-4px)"
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
        <v-btn @click="openNewChat()" class="new-btn secondary lighten-1">
          <v-icon class="light-icon">$PenNoLine</v-icon>
        </v-btn>

        <!-- CREATE NEW CHAT div -->
        <div class="new-chat" :class="openNew ? 'active' : ''">
          <v-card flat class="main-card pa-5">
            <div class="d-flex justify-space-between">
              <span class="fs-xlarge">Create New Chat</span>
              <span @click="closeNewChat()" class="pointer"
                ><v-icon>mdi-arrow-right</v-icon></span
              >
            </div>

            <div
              class="mt-4 fs-xsmall"
              :class="
                computedFullnameCharacters
                  ? 'error--text font-weight-bold'
                  : 'grey--text'
              "
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

              <div class="ml-3" style="width: 78%">
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
              <DialCodes @select="selectDialCode" :filled="false" />
            </div>
          </v-card>

          <!-- submit and create new chat button -->
          <div>
            <v-btn
              :disabled="
                !newChat.firstName ||
                !newChat.mobile ||
                computedFullnameCharacters
              "
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

        <!-- user profile dialog -->
        <div
          class="userProfileDialog"
          :class="userProfileDialog ? 'active' : ''"
        >
          <div class="pa-6">
            <!-- dialog CLOSE icon -->
            <div class="text-right">
              <span @click="userProfileDialog = false">
                <v-icon class="pointer">$Close</v-icon>
              </span>
            </div>

            <!-- dialog content -->
            <div v-if="userProfileDialog">
              <!-- user profile avatar -->
              <div class="d-flex">
                <avatar
                  :username="selectedChat.user"
                  :size="59"
                  rounded
                  color="#fff"
                  class="mb-3"
                ></avatar>

                <span class="fs-xlarge pl-3 pt-4">User Profile</span>
                <span
                  class="profile-edit-icon pointer"
                  @click="openProfileEditDialog()"
                  ><v-icon>$Note</v-icon></span
                >
              </div>

              <div class="mt-3 mx-1 d-flex pa-3">
                <!-- <div class="d-flex flex-column justify-start mr-2">
                  <v-icon>mdi-information-outline</v-icon>
                </div> -->
                <span class="fs-small mainBlack--text"
                  >In this section, you can see the information of a user and
                  you can also edit the user's name through the editing icon
                  above. Note that the user's mobile number
                  <span class="text-decoration-underline"
                    >cannot be edited!</span
                  ></span
                >
              </div>

              <div class="mt-8 ml-5">
                <p class="mb-5 fs-medium blackFont--text">
                  <v-icon class="mr-3">$User</v-icon> {{ selectedChat.user }}
                </p>
                <p class="fs-medium blackFont--text">
                  <v-icon class="mr-3" style="transform: translateX(1px)"
                    >$Phone</v-icon
                  >
                  {{ computedMobileNumber(selectedChat.mobile) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="chat" v-if="selectedChat.user">
          <div class="chat-header">
            <div v-if="!searchMode" class="d-flex">
              <div
                @click="selectedChat.id != '1' ? openUserProfileDialog() : ''"
                :class="selectedChat.id != '1' ? 'pointer' : ''"
                class="d-flex"
              >
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
                    class="fs-medium mb-0 mainBlack--text"
                    :class="
                      !selectedChat.lastSeen && !selectedChat.isOnline
                        ? 'mt-2'
                        : ''
                    "
                  >
                    {{ selectedChat.user }}
                    <v-icon
                      v-if="selectedChat.id == '1'"
                      color="primary"
                      small
                      style="transform: translateY(-2px)"
                      >mdi-check-decagram</v-icon
                    >
                  </p>

                  <!-- isTyping box: when user is typing a message -->
                  <div
                    v-if="selectedChat.isTyping"
                    class="primary--text fs-xxsmall d-flex mb-3"
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
                    class="primary--text fs-xxsmall mb-3"
                  >
                    Online
                  </p>

                  <!-- user last seen box: when user is offline -->
                  <p v-else class="grey--text fs-xxsmall mb-0">
                    {{ selectedChat.lastSeen }}
                  </p>
                </div>
              </div>

              <v-spacer></v-spacer>

              <div class="pt-3">
                <v-menu offset-y transition="slide-y-transition" left>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on" class="ms-1"
                      ><v-icon>mdi-dots-vertical</v-icon></span
                    >
                  </template>
                  <v-list class="py-0">
                    <!-- SEARCH item -->
                    <v-list-item @click="openSearch()">
                      <v-list-item-title>
                        <v-icon style="transform: translate(3px, -2px)" small
                          >$Search</v-icon
                        ><span class="fs-xsmall grey--text text--darken-2 pl-4"
                          >Search</span
                        >
                      </v-list-item-title>
                    </v-list-item>

                    <!-- CLEAR HISTORY item -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon style="font-size: 22px"
                          >mdi-chat-remove-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title class="fs-small pl-2 mainBlack--text"
                        >Clear history
                      </v-list-item-title>
                    </v-list-item>

                    <!-- DELETE CHAT item -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon style="transform: translateX(-1px)"
                          >mdi-delete-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title class="fs-small pl-2 mainBlack--text"
                        >Delete chat
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>

            <!-- Chat search box -->
            <div class="search-box d-flex align-center mx-1 pt-1" v-else>
              <span
                @click="doSearch()"
                class="pointer"
                style="transform: translateY(1px)"
              >
                <v-icon>$Search</v-icon>
              </span>
              <!-- _________________________________________ -->
              <v-text-field
                id="search-field"
                placeholder="Search..."
                hide-details
                rounded
                v-model="chatSearch"
                @keyup.enter="doSearch()"
              ></v-text-field>
              <!-- _________________________________________ -->
              <div v-if="searchDone" class="d-flex align-center">
                <b v-if="!noSearchResult" class="primary--text fs-small pr-3"
                  >{{ searchNumber }} of {{ searchResult.length }}</b
                >
                <b v-else class="primary--text fs-small pr-3">No result</b>
                <!-- _________________________________________ -->
                <span
                  @click="goNextResult()"
                  class="pointer"
                  :class="
                    (!noSearchResult && searchNumber == searchResult.length) ||
                    noSearchResult
                      ? 'disabled'
                      : ''
                  "
                >
                  <v-icon color="primary">mdi-chevron-up</v-icon>
                </span>
                <!-- _________________________________________ -->
                <span
                  @click="goPreviousResult()"
                  class="pointer"
                  :class="
                    (!noSearchResult && searchNumber == 1) || noSearchResult
                      ? 'disabled'
                      : ''
                  "
                >
                  <v-icon color="primary">mdi-chevron-down</v-icon>
                </span>
                <v-divider vertical class="mx-4"></v-divider>
              </div>
              <!-- _________________________________________ -->
              <span class="pointer" @click="searchMode = false">
                <v-icon>mdi-arrow-right</v-icon>
              </span>
            </div>
          </div>

          <v-divider v-if="!pinLoading"></v-divider>

          <v-progress-linear
            indeterminate
            color="primary"
            height="1"
            v-else
          ></v-progress-linear>

          <!-- The box that display pinned message -->
          <div
            class="pin-box d-flex justify-space-between pointer"
            v-if="selectedChat.pinnedMessage.id"
            @click="showMessage(selectedChat.pinnedMessage.id)"
          >
            <div class="border-left">
              <p class="fs-small mb-0 mainBlack--text">Pinned Message</p>
              <p
                class="fs-xsmall mb-0 grey--text text-left"
                :dir="messageDirection(selectedChat.pinnedMessage.text)"
              >
                {{
                  selectedChat.pinnedMessage.text.length > 30
                    ? `${removeBrTags(selectedChat.pinnedMessage.text).slice(
                        0,
                        30
                      )}...`
                    : removeBrTags(selectedChat.pinnedMessage.text)
                }}
              </p>
            </div>

            <!-- Pin close icon -->
            <div
              @click="closePinnedMessageConfirmation = true"
              @click.stop="showMessage(selectedChat.pinnedMessage.id)"
              class="pointer"
            >
              <v-icon small>mdi-close</v-icon>
            </div>
          </div>

          <div
            class="chat-content"
            :class="{
              fullScreen: selectedChat.id == '1', // box height when Guide friend chat is open
              // box height when there is just one opened box (reply or pin)
              hasOneBox:
                (hasReply && !selectedChat.pinnedMessage.id) ||
                (!hasReply && selectedChat.pinnedMessage.id),
              hasTwoBox: hasReply && selectedChat.pinnedMessage.id, // box height when both of boxes is opened
            }"
            @scroll="computedDownButton()"
          >
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
                v-if="selectedChat.id != '1'"
                small
                @click="goToDate(item.date)"
                class="date-chip my-4"
                >{{ computedDate(item.date) }}</v-chip
              >

              <!-- box of a message -->
              <div
                v-for="(item2, index2) in item.messages"
                :key="index2"
                :class="selectedChat.id == '1' ? 'mt-6' : ''"
                :id="item2.id"
                class="allMessages-box"
              >
                <v-row class="messages">
                  <v-col>
                    <div
                      :style="
                        item2.id == repliedMessageId ? repliedMessageStyle : ''
                      "
                    >
                      <div
                        style="width: fit-content"
                        @contextmenu="
                          getClickedMessageData(item2, index, index2)
                        "
                        :class="item2.self ? 'ml-auto' : ''"
                      >
                        <!-- message text -->
                        <div @contextmenu="showMessageMenu">
                          <div
                            class="message-box"
                            :dir="messageDirection(item2.text)"
                            :class="{
                              'own-message': item2.self,
                              'user-message': !item2.self,
                              'text-right':
                                messageDirection(item2.text) == 'rtl',
                            }"
                            :style="
                              !computedMessageTime(item.messages, index2)
                                ? 'margin-bottom: 15px'
                                : ''
                            "
                          >
                            <div
                              v-if="item2.repliedMessage.text"
                              class="replied-message pointer text-left"
                              @click="showMessage(item2.repliedMessage.id)"
                            >
                              <p class="message-sender mb-0 fs-small">
                                {{
                                  item2.repliedMessage.self
                                    ? userName
                                    : selectedChat.user
                                }}
                              </p>
                              <p
                                class="message-text mb-0"
                                :dir="
                                  messageDirection(item2.repliedMessage.text)
                                "
                              >
                                {{
                                  item2.repliedMessage.text.length > 30
                                    ? `${removeBrTags(
                                        item2.repliedMessage.text
                                      ).slice(0, 30)}...`
                                    : removeBrTags(item2.repliedMessage.text)
                                }}
                              </p>
                            </div>
                            <span v-html="item2.text"></span>
                          </div>
                        </div>

                        <!-- message time -->
                        <div
                          v-if="computedMessageTime(item.messages, index2)"
                          class="fs-xxsmall grey--text mt-1 mb-3"
                          :class="item2.self ? ' text-right' : 'text-left'"
                        >
                          {{ item2.time }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
            <!-- Go down button -->

            <v-btn
              v-if="showGoDownBtn"
              @click="scrollToEnd"
              class="goDownBtn"
              color="secondary"
              ><v-icon>mdi-chevron-down</v-icon></v-btn
            >

            <v-chip
              v-if="haveNewMessage"
              @click="scrollToEnd"
              color="primary darken-2 new-message"
              ><span class="fs-xsmall"
                >{{ newMessageCount }}
                {{
                  newMessageCount == 1 ? "New message" : "New messages"
                }}</span
              ><v-icon small class="ms-1">mdi-chevron-down</v-icon></v-chip
            >
          </div>

          <div
            v-if="hasReply"
            class="reply-box d-flex justify-space-between pointer"
            @click="showMessage(repliedMessage.id)"
          >
            <div class="d-flex">
              <v-icon class="reply-icon">mdi-reply</v-icon>
              <div class="ml-3">
                <p class="fs-small mainBlack--text mb-0">
                  {{ repliedMessage.self ? userName : selectedChat.user }}
                </p>
                <p
                  class="fs-xsmall grey--text mb-0"
                  :dir="messageDirection(repliedMessage.text)"
                >
                  {{
                    repliedMessage.text.length > 30
                      ? `${removeBrTags(repliedMessage.text).slice(0, 30)}...`
                      : removeBrTags(repliedMessage.text)
                  }}
                </p>
              </div>
            </div>
            <div @click="hasReply = false" class="pointer">
              <v-icon small>mdi-close</v-icon>
            </div>
          </div>

          <div v-if="selectedChat.id != '1'" class="chat-footer">
            <v-divider class="mb-3"></v-divider>
            <v-textarea
              rounded
              class="no-border-field"
              style="background-color: #fff"
              placeholder="Write Your Message..."
              outlined
              hide-details
              no-resize
              id="textMessage"
              @keydown.enter.exact.prevent="messageText ? sendMessage() : ''"
              @keydown.enter.shift.exact.prevent="goNextLine"
              :dir="messageDirection(messageText)"
              v-model.trim="messageText"
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
                    style="min-width: 40px; margin-top: 7px"
                    ><v-icon color="primary">mdi-send</v-icon></v-btn
                  >
                </div>
              </template>
            </v-textarea>
          </div>
        </div>

        <!-- NO CONTENT box when no chat is selected -->
        <div v-else>
          <v-chip small class="noContent-chip"
            >Select a chat to start messaging...</v-chip
          >
        </div>

        <!-- message right click menu -->
        <v-menu
          v-model="messageMenu"
          :position-x="menuLocation.x"
          :position-y="menuLocation.y"
          absolute
          offset-y
          transition="scale-transition"
        >
          <v-card v-if="selectedChat.id != '1'" min-width="170">
            <v-list>
              <!-- REPLY item -->
              <v-list-item @click="replyMessage()">
                <v-list-item-icon>
                  <v-icon>mdi-reply-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="fs-small pl-2 mainBlack--text"
                  >Reply
                </v-list-item-title>
              </v-list-item>

              <!-- COPY item -->
              <v-list-item
                v-clipboard:copy="removeBrTags(selectedMessage.text)"
                @click="doCopy()"
              >
                <v-list-item-icon>
                  <v-icon>$Copy</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="fs-small pl-2 mainBlack--text"
                  >Copy
                </v-list-item-title>
              </v-list-item>

              <!-- PIN item -->
              <v-list-item @click="togglePinMessage()">
                <v-list-item-icon>
                  <v-icon>{{
                    selectedChat.id
                      ? selectedChat.pinnedMessage.id != selectedMessage.id
                        ? "mdi-pin-outline"
                        : "mdi-pin-off-outline"
                      : "mdi-pin-outline"
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="fs-small pl-2 mainBlack--text"
                  >{{
                    selectedChat.id
                      ? selectedChat.pinnedMessage.id != selectedMessage.id
                        ? "Pin message"
                        : "Unpin message"
                      : "Pin message"
                  }}
                </v-list-item-title>
              </v-list-item>

              <!-- DELETE MESSAGE item -->
              <v-list-item @click="deleteMessageConfirmation = true">
                <v-list-item-icon>
                  <v-icon>mdi-delete-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="fs-small pl-2 mainBlack--text"
                  >Delete Message
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- Dialog to get confirm to delete a chat  -->
        <v-dialog v-model="deleteMessageConfirmation" width="350">
          <v-card class="dialog-card">
            <v-card-title class="pb-2">
              <div>
                <span class="fs-xlarge pt-1">Delete message</span>
              </div>
            </v-card-title>

            <v-card-text>
              <div>
                <span class="fs-medium"
                  >Are you sure you want to delete this message?</span
                >

                <!-- DELETE CHAT dialog operation button -->
                <div class="mt-5 text-right">
                  <v-btn
                    @click="deleteMessageConfirmation = false"
                    color="secondary"
                    text
                    >Cancel</v-btn
                  >

                  <v-btn @click="deleteMessage()" color="error" text
                    >Delete</v-btn
                  >
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of delete chat dialog -->

        <!-- Dialog to get confirm to close pinned message  -->
        <v-dialog v-model="closePinnedMessageConfirmation" width="350">
          <v-card class="dialog-card">
            <v-card-title class="pb-2">
              <div>
                <span class="fs-xlarge pt-1">Unpin message</span>
              </div>
            </v-card-title>

            <v-card-text>
              <div>
                <span class="fs-medium"
                  >Are you sure you want to unpin this message?</span
                >

                <!-- UNPIN MESSAGE dialog operation button -->
                <div class="mt-5 text-right">
                  <v-btn
                    @click="closePinnedMessageConfirmation = false"
                    color="secondary"
                    text
                    >Cancel</v-btn
                  >

                  <v-btn @click="closePinnedMessage()" color="error" text
                    >Unpin</v-btn
                  >
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of close pinned message dialog -->

        <!-- Dialog for user profile edit -->
        <v-dialog v-model="profileEditDialog" width="400">
          <v-card class="dialog-card" v-if="profileEditDialog">
            <v-card-title class="pb-2 pt-5">
              <div class="d-flex">
                <avatar :size="40" :username="editedName" color="#fff"></avatar>
                <span class="fs-xlarge pl-3 pt-1">Edit Name</span>
              </div>
            </v-card-title>

            <v-card-text>
              <div>
                <div class="mt-4">
                  <v-text-field
                    prepend-inner-icon="$User"
                    v-model.trim="editedName"
                    outlined
                    hide-details
                    placeholder="User's full name"
                    @keyup.enter="
                      editedName && !computedEditedNameCharacters
                        ? EditName()
                        : ''
                    "
                  >
                  </v-text-field>
                </div>

                <div class="d-flex mt-2">
                  <div class="d-flex flex-column justify-start mr-1">
                    <v-icon
                      class="fs-xlarge"
                      style="margin-top: 2px"
                      :color="
                        computedEditedNameCharacters ? 'error' : 'grey darken-1'
                      "
                      >mdi-alert-circle-outline</v-icon
                    >
                  </div>
                  <span
                    class="fs-small"
                    :class="
                      computedEditedNameCharacters
                        ? 'error--text'
                        : 'mainBlack--text'
                    "
                  >
                    The maximum number of characters is 20.
                  </span>
                </div>
              </div>
              <!-- EDIT PROFILE dialog operation button -->
              <div class="mt-5 text-right">
                <v-btn @click="profileEditDialog = false" color="secondary" text
                  >Cancel</v-btn
                >

                <v-btn
                  :disabled="computedEditedNameCharacters || !editedName"
                  @click="EditName()"
                  color="error"
                  text
                  >Edit name</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of user profile edit dialog -->
      </div>
    </div>
  </div>
</template>

<script>
import chatScript from "./script.js";
export default chatScript;
</script>
