<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">
          Изменить информацию о персонаже
          <span
            class="login"
            @click="$emit('copy')"
          >{{character.nickname}}</span>
        </p>
      </div>
    </div>
    <div class="content">
      <add :account="account" :character="character" :action="'edit'" @edit="editCharacter"></add>
    </div>
  </div>
</template>
<script>
import add from "./characterForm";
export default {
  name: "editCharacterComponent",
  components: {
    add
  },
  props: {
    account: {
      type: Object,
      required: true
    },
    character: {
      type: Object,
      required: true
    }
  },
  methods: {
    editCharacter(newCharacter) {
      const user = this.$store.getters["user/getUser"];
      let account = this.account;

      account.characters.forEach(function(part, index, theArray) {
        if (theArray[index].id === newCharacter.id) {
          theArray[index] = newCharacter;
        }
      });
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