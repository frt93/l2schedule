<template>
  <signin :prevRoute="prevRoute"></signin>
</template>
<script>
import signin from "~/components/ui/auth/signin";
export default {
  name: "signInPage",
  middleware: "notAuth",
  components: {
    signin
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