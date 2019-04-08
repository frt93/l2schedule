<template>
  <accounts></accounts>
</template>
<script>
import accounts from "~/components/accounts/list";
export default {
  name: "accountsListMainPage",
  middleware: "auth",
  components: {
    accounts
  }
};
</script>
