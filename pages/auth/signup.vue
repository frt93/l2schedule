<template>
  <signup :prevRoute="prevRoute"></signup>
</template>
<script>
import signup from "~/components/ui/auth/signup";
export default {
  middleware: "notAuth",
  components: {
    signup
  },
  data() {
    return {
      prevRoute: null
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  }
};
</script>