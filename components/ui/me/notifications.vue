<template>
  <div class="norifications" v-if="notifications.length">
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">
                <span>Оповещения</span>
              </p>
            </div>
          </div>
          <div class="content">
            <p v-for="(notification, index) in notifications" :key="index">
              <span class="log-date">{{$moment(notification.date).format(('D.MM.YYYY в HH:mm'))}}</span>
              <span class="log-message">{{notification.message}}</span>
            </p>
            <a class="button is-danger reset" @click="reset">Очистить</a>
          </div>
        </div>
      </div>
    </b-modal>
    <span class="trigger" v-if="!isModalActive" @click="isModalActive=true">
      <b-tooltip
        :label="`Новых оповещений: ${notifications.length}`"
        position="is-left"
        type="is-dark"
        animated
      >
        <span class="notifications-count">{{notifications.length}}</span>
        <i class="mdi mdi-bell mdi-24px"></i>
      </b-tooltip>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "userNotifications",
  data() {
    return {
      isModalActive: false
    };
  },
  computed: {
    ...mapGetters({
      notifications: "user/getNotifications",
      user: "user/getUser"
    })
  },
  methods: {
    playNotification(sound) {
      const audio = new Audio(sound);
      audio.play();
    },
    sendNotification(title, options) {
      if (!("Notification" in window)) {
        alert(
          "Ваш браузер не поддерживает HTML Notifications, его необходимо обновить."
        );
      }
      // Проверим, есть ли права на отправку уведомлений
      else if (Notification.permission === "granted") {
        // Если права есть, отправим уведомление
        var notification = new Notification(title, options);

        function clickFunc() {
          alert("Пользователь кликнул на уведомление");
        }

        notification.onclick = clickFunc;
      }
      // Если прав нет, пытаемся их получить
      else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
          // Если права успешно получены, отправляем уведомление
          if (permission === "granted") {
            var notification = new Notification(title, options);
          } else {
            alert("Вы запретили показывать уведомления"); // Юзер отклонил наш запрос на показ уведомлений
          }
        });
      } else {
        // Пользователь ранее отклонил наш запрос на показ уведомлений
        // В этом месте мы можем, но не будем его беспокоить. Уважайте решения своих пользователей.
      }
    },

    reset() {
      this.$store.commit("user/resetNotifications");
    }
  },
  mounted() {
    this.$socket().on("raidboss-updated", (message, boss, user) => {
      this.$store.commit("user/addNotification", message);
      this.$store.dispatch("raidbosses/rebuild", boss);
      this.playNotification("/notify/notify.mp3");
      // this.sendNotification("Верните Линуса!", {
      //   body: "Тестирование HTML5 Notifications",
      //   icon: "/items/full/arcana-mace.png",
      //   dir: "auto"
      // });
    });
    this.$socket().on("raidboss-created", (message, boss, user) => {
      this.$store.commit("user/addNotification", message);
      this.$store.commit("raidbosses/add", boss);
      this.playNotification("/notify/notify.mp3");
    });
    this.$socket().on("raidboss-removed", (message, boss, user) => {
      this.$store.commit("user/addNotification", message);
      this.$store.commit("raidbosses/remove", boss);
      this.playNotification("/notify/notify.mp3");
    });
    this.$socket().on("group-invite", (message, inviter, invitee) => {
      this.$store.commit("user/addNotification", message);
      this.$store.commit("user/set_user", invitee);
      this.playNotification("/notify/notify.mp3");
    });

    this.$socket().on("user-joined", (message, inviter, invitee) => {
      this.$store.commit("user/addNotification", message);
      this.playNotification("/notify/notify.mp3");
    });
  }
};
</script>
<style>
</style>
