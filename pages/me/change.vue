<template>
  <change :data="user"></change>
</template>

<script>
import change from "~/components/me/change";
import { mapGetters } from "vuex";
export default {
  name: "updateAccountPage",
  middleware: "auth",
  components: { change },
  computed: {
    ...mapGetters({ user: "auth/getUser" })
  }
};
</script>
