<template>
  <div class="card">
    <createAccount v-if="action === 'createAccount'" @created="$parent.close"></createAccount>
    <editAccount
      v-if="action === 'editAccount'"
      :account="account"
      @updated="$parent.close"
      @copy="$emit('copy', `Логин скопирован`,  account.login )"
    ></editAccount>

    <addCharacter
      v-if="action === 'newCharacter'"
      :account="account"
      @copy="$emit('copy', `Логин скопирован`,  account.login)"
      @added="$parent.close"
    ></addCharacter>
    <editCharacter
      v-if="action === 'editCharacter'"
      :account="account"
      :character="character"
      @copy="$emit('copy', `Никнейм скопирован`,  character.nickname)"
      @added="$parent.close"
    ></editCharacter>
  </div>
</template>
<script>
import createAccount from "./createAccount";
import editAccount from "./editAccount";
import addCharacter from "./addCharacter";
import editCharacter from "./editCharacter";
export default {
  name: "accountModalWindow",
  components: {
    createAccount,
    editAccount,
    addCharacter,
    editCharacter
  },
  data() {
    return {
      action: this.initialAction
    };
  },
  props: {
    account: {
      type: Object,
      required: false
    },
    character: {
      type: Object,
      required: false
    },
    initialAction: {
      type: String,
      required: true
    }
  }
};
</script>