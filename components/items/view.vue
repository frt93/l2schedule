<template>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4 item-fullname" @click="$emit('copy')"></p>
      </div>
    </div>
    <div class="content">
      <b-field label="Изображение">
        <div>
          <img :src="item.image" alt>
        </div>
      </b-field>
      <b-field label="Ранг предмета">
        <p>{{item.grade}}</p>
      </b-field>
      <button class="button is-info" type="button" @click="$emit('update')">Изменить</button>
    </div>
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