<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <div class="modal-card-title">
        <span class="item-fullname" @click="$emit('copy')">{{item.fullname}}</span>
      </div>
    </header>
    <section class="modal-card-body">
      <b-field label="Изображение">
        <div>
          <img :src="item.image" alt>
        </div>
      </b-field>
      <b-field label="Ранг предмета">
        <p>{{item.grade}}</p>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-info" type="button" @click="$emit('update')">Изменить</button>
    </footer>
  </div>
</template>
<script>
export default {
  name: "viewItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>