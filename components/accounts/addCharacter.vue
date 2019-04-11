<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">
          Добавить персонажа к аккаунту
          <span class="login" @click="$emit('copy')">{{account.login}}</span>
        </p>
      </div>
    </div>
    <div class="content">
      <add :account="account" :character="character" :action="'add'" @add="addCharacter"></add>
    </div>
  </div>
</template>
<script>
import add from "./characterForm";
export default {
  name: "addCharacterComponent",
  components: {
    add
  },
  data() {
    return {
      character: {
        isBasic: this.account.type !== "watcher" ? true : false, // Является ли создаваемый персонаж основным на аккаунте. Если на момент создания на аккаунте уже имеется персонаж с таким статусом - он его потеряет.
        nickname: "",
        profession: "",
        shopType: "", // Для
        items: [], // трейдеров
        watchFor: "" // Для палилок. В ней содержится название объекта наблюдения
      }
    };
  },
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  methods: {
    addCharacter(newCharacter) {
      const user = this.$store.getters["user/getUser"];
      let account = this.account;
      account.characters.push(newCharacter);
      this.$store
        .dispatch("accounts/update", { account, user })
        .then(res => {
          this.$snackbar.open({
            message: res.data.message,
            duration: 5000,
            queue: false
          });
          this.$emit("added");
        })
        .catch(e => {
          this.$snackbar.open({
            duration: 5000,
            message: `${e.response.data.error.message}`,
            type: "is-danger",
            position: "is-bottom-left",
            queue: false
          });
        });
    }
  }
};
</script>