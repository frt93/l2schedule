<template>
  <mainpage></mainpage>
</template>

<script>
import mainpage from "~/components/dashboard/mainpage";
export default {
  name: "dashboardMainPage",
  middleware: "auth",
  components: {
    mainpage
  }
};
</script>