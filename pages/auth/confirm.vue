<template>
  <div></div>
</template>
<script>
export default {
  name: "confirmUserAuthDataPage",
  data() {
    return {
      response: ""
    };
  },
  methods: {
    send(credential, token) {
      this.$axios
        .post(`/me/confirm/${credential}`, { token })
        .then(res => {
          this.$snackbar.open({
            duration: 5000,
            message: `${res.data.message}`,
            type: "is-success",
            position: "is-bottom-right",
            queue: false
          });
          if (credential === "email") {
            this.$store.commit("user/set_user", res.data.user);
            this.$router.replace("/");
          }
          if (credential === "password") {
            this.$store.dispatch("user/signOut");
            this.$router.push("/user/signin");
          }
        })
        .catch(e => {
          this.$snackbar.open({
            duration: 5000,
            message: `${e.response.data.error.message}`,
            type: "is-danger",
            position: "is-bottom-right",
            queue: false
          });
          this.$router.push("/");
        });
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query.token && query.credential) {
      this.send(query.credential, query.token);
    }
  }
};
</script>