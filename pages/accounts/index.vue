<template>
  <accounts></accounts>
</template>
<script>
import accounts from "~/components/accounts/list";
export default {
  name: "accountsListMainPage",
  middleware: ["auth", "group"],
  components: {
    accounts
  },
  async fetch({ store, params }) {
    await store.dispatch("accounts/fetch");
  }
};
</script>
