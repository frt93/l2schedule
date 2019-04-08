<template>
  <div class="container">
    <groups></groups>
  </div>
</template>

<script>
import groups from "~/components/ui/me/groups";
export default {
  name: "profileMainPage",
  middleware: "auth",
  components: { groups }
};
</script>
