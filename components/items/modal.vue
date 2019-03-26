<template>
  <div class="card">
    <viewItem
      v-if="action === 'view'"
      :item="item"
      @copy="$emit('copy', `Название предмета ${item.fullname} скопировано`, item.fullname)"
      @update="action = 'update'"
    ></viewItem>
    <editItem
      v-if="action === 'update'"
      :item="item"
      @updated="newItem"
      @copy="$emit('copy', `Название предмета ${item.fullname} скопировано`, item.fullname)"
    ></editItem>
    <createItem v-if="action === 'create'" @created="newItem"></createItem>
  </div>
</template>
<script>
import createItem from "./create";
import editItem from "./edit";
import viewItem from "./view";
export default {
  name: "itemModalWindow",
  components: {
    editItem,
    createItem,
    viewItem
  },
  data() {
    return {
      action: this.initialAction,
      item: this.data
    };
  },
  props: {
    data: {
      type: Object
    },
    initialAction: {
      type: String,
      required: true
    }
  },
  methods: {
    newItem(item) {
      this.item = item;
      this.action = "view";
    }
  }
};
</script>

<style>
.item-fullname {
  cursor: pointer;
}
</style>

