<template>
  <change :data="user"></change>
</template>

<script>
import change from "~/components/ui/me/change";
import { mapGetters } from "vuex";
export default {
  name: "updateAccountPage",
  middleware: "auth",
  components: { change },
  computed: {
    ...mapGetters({ user: "user/getUser" })
  }
};
</script>
