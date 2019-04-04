<template>
  <mainpage></mainpage>
</template>

<script>
import mainpage from "~/components/dashboard/mainpage";
export default {
  middleware: "auth",
  components: {
    mainpage
  }
};
</script>