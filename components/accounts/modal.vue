<template>
  <div class="card">
    <!-- <editItem
      v-if="action === 'update'"
      :account="account"
      @updated="updated"
      @copy="$emit('copy', `Логин аккаунта ${account.login} скопирован`, account.login)"
    ></editItem>-->
    <createAccount v-if="action === 'create'" @created="$parent.close"></createAccount>
  </div>
</template>
<script>
import createAccount from "./createAccount";
export default {
  name: "accountModalWindow",
  components: {
    createAccount
  },
  data() {
    return {
      action: this.initialAction,
      account: this.data
    };
  },
  props: {
    data: {
      type: Object
    },
    initialAction: {
      type: String,
      required: true
    }
  },
  methods: {
    updated() {}
  }
};
</script>


