import { v4 as uuidv4 } from "uuid"; // id generator package
import Avatar from "vue-avatar";
import CountryFlag from "vue-country-flag";
import CountryCodes from "./../../mixin/CountryCodes.vue";
import DialCodes from "./../../components/DialCodes";
import parsePhoneNumber from "libphonenumber-js";

export default {
  components: {
    Avatar,
    DialCodes,
    CountryFlag,
  },
  mixins: [CountryCodes],
  data() {
    return {
      // String
      filter: "",
      doFrom: "",
      interval: "",
      chatSearch: "",
      editedName: "",
      messageText: "",
      countryFilter: "",
      messageInterval: "",
      userMessageText: "",
      repliedMessageId: "",
      repliedMessageStyle: "",
      userName: localStorage.getItem("username"),
      guideText:
        "Hey there! I'm your guide friend who is going to help you use this online chat demo!<br />This application aims to implement a completely front-end project, and in this section, tries to provide almost complete functionality of a chat.<br /><br />The features available in the chat are as follows:<br /> <li>Create new chat: You can add a new chat to your chat list with the desired name and phone number.</li> <li> Open one chat and send new message: You can open one chat by click on it in the list, send new message and see all sent messages.</li> <li> Handle a chat by the chat options menu: You can access the options menu of a chat by right-clicking on the desired chat and use the implemented features.</li> <li> Handle a message by the message options menu: Also you can access the options menu of a message by right-clicking on the desired message and use the features implemented for it.</li><br /> Note that all data will be saved and if you use the application with the same IP address, you can see all the data you entered in the chat again. <br />Hope you enjoy ♥",

      // Object
      selectedChat: {},
      selectedItem: {},
      repliedMessage: {},
      selectedMessage: {},
      dayIndex: null,
      messageIndex: null,
      menuLocation: {
        x: 0,
        y: 0,
      },
      newChat: {
        firstName: "",
        lastName: "",
        dialCode: "+98",
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
        "December",
      ],
      searchResult: [],

      // Boolean
      openNew: false,
      listMenu: false,
      hasReply: false,
      searchMode: false,
      searchDone: false,
      pinLoading: false,
      pageLoaded: false,
      chatLoading: false,
      messageMenu: false,
      showGoDownBtn: false,
      openDialCodes: false,
      haveNewMessage: false,
      userChatDialog: false,
      noSearchResult: false,
      profileEditDialog: false,
      userProfileDialog: false,
      deleteChatConfirmation: false,
      clearHistoryConfirmation: false,
      deleteMessageConfirmation: false,
      closePinnedMessageConfirmation: false,

      searchNumber: 0,
      newMessageCount: 0,
    };
  },
  methods: {
    goNextLine() {
      this.messageText += "\n";
      setTimeout(() => {
        var textarea = document.getElementsByTagName("textarea")[0];
        textarea.scrollTop = textarea.scrollHeight - 50;
      }, 10);
    },
    // This function is called to open user profile dialog
    openUserProfileDialog() {
      this.userProfileDialog = true;
    },
    // the funtion to recognize to show down button or not
    computedDownButton() {
      if (this.pageLoaded) {
        var container = document.querySelector(".chat-content");

        if (
          parseInt(container.scrollTop) <
          container.scrollHeight -
            container.offsetHeight -
            parseInt(container.getBoundingClientRect().height / 9)
        ) {
          this.showGoDownBtn = true;
        } else {
          this.showGoDownBtn = false;
          this.haveNewMessage = false;
          this.newMessageCount = 0;
        }
      } else {
        this.showGoDownBtn = false;
        this.haveNewMessage = false;
        this.newMessageCount = 0;
      }
    },
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
        // behavior: "smooth",
        block: "start",
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
    // This function is called to show the replied meesage we clicked on it
    showMessage(messageId) {
      this.repliedMessageId = messageId;
      if (document.getElementById(messageId)) {
        document.getElementById(messageId).scrollIntoView({
          // behavior: "smooth",
          block: "start",
        });

        this.repliedMessageStyle =
          "background-color: #cee4ee; border-radius:6px; transition: .3s linear;";

        clearInterval(this.messageInterval);
        this.messageInterval = setInterval(() => {
          this.repliedMessageStyle =
            "background-color: transparent;transition: .3s linear;";
        }, 2000);
      }
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
        this.repliedMessage = {};
        this.hasReply = false;
        this.chatSearch = "";
        this.searchResult = [];
        this.searchDone = false;
        this.searchMode = false;

        setTimeout(() => {
          this.scrollToEnd();
        }, 50);

        setTimeout(() => {
          this.chatLoading = false;
          // Update unseen messages number when open the chat
          if (this.selectedChat.id != "1") {
            let index = this.chats.findIndex(
              (x) => x.id == this.selectedChat.id
            );
            this.chats[index].unseenNumber = 0;
            this.setInLocalStorage();
          }
        }, 900);
      }
    },
    openSearch() {
      this.chatSearch = "";
      this.searchResult = [];
      this.searchDone = false;
      this.searchMode = true;
      setTimeout(() => {
        document.getElementById("search-field").focus();
      }, 100);
    },
    doSearch() {
      if (this.chatSearch) {
        let allTexts = [];
        this.searchResult = [];
        this.selectedChat.messagesByDate.forEach((element1) => {
          element1.messages.forEach((element2) => {
            allTexts.push(element2);
          });
        });
        this.searchResult = allTexts.filter((x) =>
          this.removeBrTags(x.text).includes(this.chatSearch)
        );

        if (this.searchResult.length) {
          this.noSearchResult = false;
          this.searchNumber = 1;
          this.showMessage(this.searchResult[this.searchResult.length - 1].id);
        } else {
          this.noSearchResult = true;
        }

        this.searchDone = true;
      }
    },
    updateSearch() {
      if (this.chatSearch) {
        let allTexts = [];
        this.searchResult = [];
        this.selectedChat.messagesByDate.forEach((element1) => {
          element1.messages.forEach((element2) => {
            allTexts.push(element2);
          });
        });
        this.searchResult = allTexts.filter((x) =>
          this.removeBrTags(x.text).includes(this.chatSearch)
        );

        if (this.searchResult.length) {
          this.noSearchResult = false;
        } else {
          this.noSearchResult = true;
        }

        this.searchDone = true;
      }
    },
    goNextResult() {
      this.searchNumber++;
      this.showMessage(
        this.searchResult[this.searchResult.length - this.searchNumber].id
      );
    },
    goPreviousResult() {
      this.searchNumber--;
      this.showMessage(
        this.searchResult[this.searchResult.length - this.searchNumber].id
      );
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
      let index = this.chats.findIndex((x) => x.id == this.selectedChat.id);
      this.chats[index].lastAcivity = Date.now();
    },
    // This function is called to update last activity when an activity is carried out by USER
    updateActivityByUser() {
      let index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
      this.chats[index].lastAcivity = Date.now();
    },
    // This function is called to send message is from US
    sendMessage() {
      let message = {
        id: uuidv4(),
        self: true,
        text: this.parsedText,
        time: this.currentTime(),
        repliedMessage: this.hasReply ? this.repliedMessage : {},
      };

      if (this.selectedChat.messagesByDate.length) {
        // Checks if there are any messages or not
        let lastIndex = this.selectedChat.messagesByDate.length - 1; // Index of the last object in messagesByDate

        if (
          this.todayDate() == this.selectedChat.messagesByDate[lastIndex].date // Checks today's date and the date of the last message
        ) {
          // In case of equality, the new message object will be pushed in messages of the last object of messagesByDate
          this.selectedChat.messagesByDate[lastIndex].messages.push(message);
        } else {
          // If not equal, a new object will be created with today's date and the new message object will be pushed in its messages.
          this.selectedChat.messagesByDate.push({
            date: this.todayDate(),
            messages: [message],
          });
        }
      } else {
        // If no message already exists, a new object will be created with today's date and the new message object will be pushed in its messages.
        this.selectedChat.messagesByDate.push({
          date: this.todayDate(),
          messages: [message],
        });
      }

      if (this.searchDone) {
        this.updateSearch();
      }

      this.messageText = "";
      this.repliedMessage = {};
      this.hasReply = false;
      setTimeout(() => {
        this.scrollToEnd();
      }, 10);
      setTimeout(() => {
        this.updateActivityBySelf();
        this.setInLocalStorage();
      }, 100);
    },
    // This function is called to send message is from USER
    sendUserMessage() {
      if (this.selectedChat && this.selectedChat.id == this.selectedItem.id) {
        let content = document.querySelector(".chat-content");
        if (
          parseInt(content.scrollTop) >=
          content.scrollHeight -
            content.offsetHeight -
            parseInt(content.getBoundingClientRect().height / 9)
        ) {
          setTimeout(() => {
            this.scrollToEnd();
          }, 10);
        } else {
          this.haveNewMessage = true;
          this.newMessageCount++;
        }
      }

      let index = this.chats.findIndex((x) => x.id == this.selectedItem.id); // Find index of user's chat object in chats list
      let message = {
        id: uuidv4(),
        self: false,
        text: this.userMessageText,
        time: this.currentTime(),
        repliedMessage:
          this.selectedChat.id == this.selectedItem.id && this.hasReply
            ? this.repliedMessage
            : {},
      };

      if (this.chats[index].messagesByDate.length) {
        let lastIndex = this.chats[index].messagesByDate.length - 1;

        if (
          this.todayDate() == this.chats[index].messagesByDate[lastIndex].date
        ) {
          this.chats[index].messagesByDate[lastIndex].messages.push(message);
        } else {
          this.chats[index].messagesByDate.push({
            date: this.todayDate(),
            messages: [message],
          });
        }
      } else {
        this.chats[index].messagesByDate.push({
          date: this.todayDate(),
          messages: [message],
        });
      }

      this.userMessageText = "";
      this.increaseUnseenMessages();

      if (this.selectedChat.id == this.selectedItem.id) {
        this.repliedMessage = {};
        this.hasReply = false;
      }

      if (this.searchDone) {
        this.updateSearch();
      }

      setTimeout(() => {
        this.updateActivityByUser();
        this.setInLocalStorage();
      }, 100);
    },
    // This function is called to increase unseen messages number when user send a message (if that chat is not open)
    increaseUnseenMessages() {
      let index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
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
          ].self
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
    // This function is called to show menu after right click on each message
    showMessageMenu(e) {
      e.preventDefault();
      this.messageMenu = false;
      this.menuLocation.x = e.clientX;
      this.menuLocation.y = e.clientY;
      this.$nextTick(() => {
        this.messageMenu = true;
      });
    },
    // This function is called to get data of the chat that we clicked (right click)
    getClickedChatData(chat) {
      this.selectedItem = chat;
    },
    // This function is called to get data of the message that we clicked (right click)
    getClickedMessageData(message, dayIndex, messageIndex) {
      this.selectedMessage = message;
      this.dayIndex = dayIndex;
      this.messageIndex = messageIndex;
    },
    // This function is called to pin or unpin a chat
    togglePinChat() {
      let index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
      this.chats[index].isPinned = !this.chats[index].isPinned;
      if (this.chats[index].isPinned) {
        this.chats[index].pinTimestamp = Date.now();
      }
      this.setInLocalStorage();
    },
    // This function is called to pin or unpin a message
    togglePinMessage() {
      this.pinLoading = true;

      setTimeout(() => {
        if (this.selectedChat.pinnedMessage.id != this.selectedMessage.id) {
          let index = this.chats.findIndex((x) => x.id == this.selectedChat.id);
          this.chats[index].pinnedMessage = this.selectedMessage;
          this.setInLocalStorage();
        } else {
          this.closePinnedMessage();
        }

        this.pinLoading = false;
      }, 1000);
    },
    // This function is called to close the pinned message
    closePinnedMessage() {
      let index = this.chats.findIndex((x) => x.id == this.selectedChat.id);
      this.chats[index].pinnedMessage = {};
      this.closePinnedMessageConfirmation = false;
      this.setInLocalStorage();
    },
    // This function is called to reply a message
    replyMessage() {
      let content = document.querySelector(".chat-content");
      if (
        parseInt(content.scrollTop) >=
        content.scrollHeight -
          content.offsetHeight -
          parseInt(content.getBoundingClientRect().height / 9)
      ) {
        setTimeout(() => {
          this.scrollToEnd();
        }, 51);
      }

      this.hasReply = true;
      this.repliedMessage = this.selectedMessage;
      document.getElementById("textMessage").focus();
    },
    // This function is called to change "isTyping" value of the chat when the user of chat is typing message or stop typing
    changeUserTypingStatus() {
      let index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
      this.chats[index].isTyping = true;

      clearInterval(this.interval);
      if (this.chats[index]) {
        this.interval = setInterval(() => {
          this.chats[index].isTyping = false;
        }, 1000);
      }
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
        dialCode: "+98",
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
        isPinned: false,
        isTyping: false,
        isOnline: false,
        lastSeen: "",
        lastAcivity: 0,
        pinTimestamp: 0,
        messagesByDate: [],
        pinnedMessage: {},
      });
      this.setInLocalStorage();
      this.openNew = false;
      setTimeout(() => {
        this.newChat = {
          firstName: "",
          lastName: "",
          dialCode: "+98",
        };
      }, 500);
    },
    // This function is called to delete desired chat from chats list
    deleteChat() {
      this.deleteChatConfirmation = false;
      let index;
      if (this.doFrom == "list") {
        index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
      } else {
        index = this.chats.findIndex((x) => x.id == this.selectedChat.id);
      }

      if (
        (this.doFrom == "list" &&
          this.selectedChat.id &&
          this.selectedChat.id == this.selectedItem.id) ||
        this.doFrom == "private"
      ) {
        this.doFrom = "";
        this.selectedChat = {};
      }

      this.chats.splice(index, 1);
      this.repliedMessage = {};
      this.hasReply = false;
      this.setInLocalStorage();
    },
    // This function is called to clear history of desired chat
    clearHistory() {
      this.clearHistoryConfirmation = false;
      let index;
      if (this.doFrom == "list") {
        index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
      } else {
        index = this.chats.findIndex((x) => x.id == this.selectedChat.id);
      }

      this.chats[index].messagesByDate = [];
      this.chats[index].pinnedMessage = {};
      this.chats[index].unseenNumber = 0;
      this.repliedMessage = {};
      this.hasReply = false;
      this.doFrom = "";
      this.setInLocalStorage();
    },
    // This function is called to delete desired message
    deleteMessage() {
      this.deleteMessageConfirmation = false;
      let index = this.chats.findIndex((x) => x.id == this.selectedChat.id);

      if (this.selectedMessage.id == this.selectedChat.pinnedMessage.id) {
        this.chats[index].pinnedMessage = {};
      }

      this.chats[index].messagesByDate[this.dayIndex].messages.splice(
        this.messageIndex,
        1
      );

      if (this.messageIndex == 0) {
        this.chats[index].messagesByDate.splice(this.dayIndex, 1);
      }
      this.setInLocalStorage();
    },
    // This function is called to open user chat dialog to write user message
    openUserChat() {
      this.userChatDialog = true;
      this.userMessageText = "";
      setTimeout(() => {
        let field = document.getElementById("user-field");
        field.focus();
      }, 1000);
    },
    // This function is called to format the mobile number
    computedMobileNumber(number) {
      return parsePhoneNumber(number).formatInternational();
    },
    // This function is called to open profile edit dialog
    openProfileEditDialog() {
      this.editedName = this.selectedChat.user;
      this.profileEditDialog = true;
    },
    // This function is called to edit user's name
    EditName() {
      let index = this.chats.findIndex((x) => x.id == this.selectedChat.id);
      this.chats[index].user = this.editedName;
      this.setInLocalStorage();
      this.profileEditDialog = false;
    },
    // This function is called to close the opened chat
    closeChat() {
      this.profileEditDialog = false;
      this.userProfileDialog = false;
      this.selectedChat = {};
    },

    removeBrTags(str) {
      if (str) {
        return str.replaceAll("<br>", " ");
      }
    },

    computedText(text) {
      if (this.searchDone) {
        return text.replace(new RegExp(this.chatSearch, "ig"), (match) => {
          return (
            '<span style="background-color: #0c626d; color:#fff; padding: 0 3px; border-radius: 4px">' +
            match +
            "</span>"
          );
        });
      } else {
        return text;
      }
    },

    doCopy() {},
  },
  computed: {
    // Filter and sort chats list
    filteredChats() {
      let pinnedChats = this.chats.filter((x) => x.isPinned);
      let unpinnedChats = this.chats.filter((x) => !x.isPinned);

      let sortedPinnedChats = pinnedChats.sort(
        (a, b) => b.pinTimestamp - a.pinTimestamp
      );

      let sortedUnpinnedChats = unpinnedChats.sort(
        (a, b) => b.lastAcivity - a.lastAcivity
      );

      let sortedChats = sortedPinnedChats.concat(sortedUnpinnedChats);

      let filtered = sortedChats.filter((x) =>
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
      let filtered = this.countryCodes.filter((x) =>
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
    },
    computedEditedNameCharacters() {
      if (this.editedName.length > 20) {
        return true;
      } else return false;
    },
    parsedText() {
      return this.messageText.replace(/\n/g, "<br>");
    },
  },
  watch: {
    userChatDialog(val) {
      if (val && this.selectedItem.id) {
        let index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
        this.chats[index].isOnline = true;
      } else if (!val) {
        let index = this.chats.findIndex((x) => x.id == this.selectedItem.id);
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0");
        let yyyy = today.getFullYear();
        this.chats[index].isOnline = false;
        this.chats[index].lastSeen =
          dd +
          "/" +
          mm +
          "/" +
          yyyy +
          " at " +
          ("0" + today.getHours()).slice(-2) +
          ":" +
          ("0" + today.getMinutes()).slice(-2);
      }
      this.setInLocalStorage();
    },
  },
  beforeRouteLeave(to, from, next) {
    this.setInLocalStorage(); // update chats in localStorage before route leave
    next();
  },
  mounted() {
    this.guideFriend = {
      id: "1",
      user: "Guide Friend",
      src: "/guide-friend.jpg",
      unseenNumber: 0,
      isTyping: false,
      isOnline: false,
      lastSeen: "",
      lastAcivity: 0,
      pinnedMessage: {},
      messagesByDate: [
        {
          date: this.todayDate(),
          messages: [
            {
              self: false,
              text: this.guideText,
              time: "Guide friend says",
              repliedMessage: {},
            },
          ],
        },
      ],
    };
    setTimeout(() => {
      this.pageLoaded = true;
    }, 10);
    // Get chats array from localStorage
    this.chats = localStorage.getItem("chats")
      ? JSON.parse(localStorage.getItem("chats"))
      : [];
  },
};
