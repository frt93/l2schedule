<template>
  <div>
    <navbar></navbar>
    <div></div>
    <nuxt/>
  </div>
</template>
<script>
import navbar from "~/components/ui/navbar";
export default {
  components: {
    navbar
  }
};
</script>

<style>
.form .control input {
  transition: 0.3s linear;
}
.form .control .icon.is-left i,
.form .control .icon .mdi-eye {
  color: #dbdbdb;
  line-height: 100%;
}

.icon.is-right i:not(.mdi-eye) {
  -webkit-animation: scale 0.2s ease-out;
  animation: scale 0.2s ease-out;
}
.form .control .icon .mdi-eye-off {
  color: #7a7a7a !important;
}
.form .control.is-large .icon i:before {
  font-size: 24px;
}

.form .control .icon i:before {
  font-size: 16px;
}

button {
  transition: 0.5s;
}

@-webkit-keyframes scale {
  0% {
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
  }
  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
}

@keyframes scale {
  0% {
    -webkit-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
  }
  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
}
</style>


