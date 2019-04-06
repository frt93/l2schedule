<template>
  <div class="rb-norifications" v-if="logs.length">
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">
                <span>Логи изменений</span>
              </p>
            </div>
          </div>
          <div class="content">
            <p v-for="(log, index) in logs" :key="index">
              <span class="log-date">{{$moment(log.date).format(('D.MM.YYYY в HH:mm'))}}</span>
              <span class="log-message">{{log.message}}</span>
            </p>
          </div>
        </div>
      </div>
    </b-modal>
    <span class="trigger" v-if="!isModalActive" @click="isModalActive=true">
      <i class="mdi mdi-bell mdi-24px"></i>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "raidbossesNotifications",
  data() {
    return {
      isModalActive: false
    };
  },
  computed: {
    ...mapGetters({
      logs: "raidbosses/getLogs"
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
    }
  },
  beforeMount() {
    this.$socket().on("raidboss-updated", (message, boss, user) => {
      this.$store.commit("raidbosses/addLog", message);
      this.$store.dispatch("raidbosses/rebuild", boss);
      this.playNotification("/notify/notify.mp3");
      // this.sendNotification("Верните Линуса!", {
      //   body: "Тестирование HTML5 Notifications",
      //   icon: "/items/full/arcana-mace.png",
      //   dir: "auto"
      // });
    });
    this.$socket().on("raidboss-created", (message, boss, user) => {
      this.$store.commit("raidbosses/addLog", message);
      this.$store.commit("raidbosses/add", boss);
      this.playNotification("/notify/notify.mp3");
    });
    this.$socket().on("raidboss-removed", (message, boss, user) => {
      this.$store.commit("raidbosses/addLog", message);
      this.$store.commit("raidbosses/remove", boss);
      this.playNotification("/notify/notify.mp3");
    });
  }
};
</script>
<style>
.rb-norifications .trigger {
  height: 48px;
  width: 48px;
  position: fixed;
  right: 40px;
  bottom: 40px;
  cursor: pointer;

  border-radius: 100%;
  text-align: center;
  background-color: transparent;
}

.rb-norifications .trigger i {
  line-height: 48px;
  height: 48px;
  width: 48px;
  color: #167df0;
  background-color: transparent;
}

.rb-norifications .trigger i:before {
  transition: 2s ease-in-out;
  -webkit-animation: swinging 2s ease-in-out 0s infinite;
  -moz-animation: swinging 2s ease-in-out 0s infinite;
  animation: swinging 2s ease-in-out 0s infinite;
  -webkit-transform-origin: 50% 0%;
  -moz-transform-origin: 50% 0;
  transform-origin: 50% 0;
  content: " \F09A";
}
.rb-norifications .trigger i:hover:before {
  content: "\F09E";
}

.rb-norifications .log-date:after {
  content: "•";
  margin-left: 3px;
}

@keyframes bell {
  0% {
    content: "\F09E";
  }
  50% {
    content: " \F09A";
  }
  100% {
    content: "\F09E";
  }
}

@keyframes swinging {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(2deg);
  }
  50% {
    transform: rotate(-1deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@-webkit-keyframes swinging {
  0% {
    -webkit-transform: rotate(0);
  }
  25% {
    -webkit-transform: rotate(2deg);
  }
  50% {
    -webkit-transform: rotate(-1deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
  }
}

@-moz-keyframes swinging {
  0% {
    -moz-transform: rotate(0);
  }
  25% {
    -moz-transform: rotate(2deg);
  }
  50% {
    -moz-transform: rotate(-1deg);
  }
  100% {
    -moz-transform: rotate(0deg);
  }
}
</style>
