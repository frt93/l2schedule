<template>
  <restore></restore>
</template>

<script>
import restore from "~/components/ui/auth/restore";
export default {
  name: "restorePasswordPage",
  middleware: "notAuth",
  components: {
    restore
  }
};
</script>
