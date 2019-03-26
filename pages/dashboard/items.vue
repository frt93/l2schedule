<template>
  <div>
    <n-link to="/">Главная</n-link>
    <n-link to="/dashboard/">ПУ</n-link>
    <n-link to="/dashboard/rb">РБ</n-link>
    <a
      class="button is-success"
      @click="isModalActive = true; modalAction = 'create'"
    >Добавить предмет</a>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <modal :initialAction="modalAction" :data="item" @copy="copy"></modal>
    </b-modal>

    <itemsTable @remove="remove" @update="update" @copy="copy"></itemsTable>
    <remove :item="item" v-if="isRemove" @removed="isRemove = false"></remove>
  </div>
</template>

<script>
import modal from "~/components/items/modal";
import itemsTable from "~/components/items/table";
import remove from "~/components/items/remove";

export default {
  components: {
    modal,
    itemsTable,
    remove
  },
  data() {
    return {
      isModalActive: false,
      modalAction: null,
      item: null,
      isRemove: false
    };
  },

  // async fetch({ store, params }) {
  //   await store.dispatch("items/fetch");
  // },

  async asyncData({ $axios, store, params }) {
    let { data } = await $axios.get(`/items/all`);
    return store.commit("items/SET_ITEMS_LIST", data);
  },

  methods: {
    remove(item) {
      this.item = item;
      this.isRemove = true;
    },
    update(item) {
      this.isModalActive = true;
      this.modalAction = "update";
      this.item = item;
    },
    async copy(message, textToCopy) {
      try {
        await this.$copyText(textToCopy);
        this.$toast.open({
          message: message,
          type: "is-success",
          duration: 3000
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
