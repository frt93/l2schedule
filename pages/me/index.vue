<template>
  <settings :data="user"></settings>
</template>

<script>
import settings from "~/components/ui/me/settings";
import { mapGetters } from "vuex";
export default {
  name: "accountSettingsPage",
  middleware: "auth",
  components: { settings },
  computed: {
    ...mapGetters({ user: "user/getUser" })
  }
};
</script>
