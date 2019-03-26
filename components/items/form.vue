<template>
  <form class="items" method="POST">
    <b-field label="Полное наименование предмета">
      <b-input placeholder="Полное наименование предмета" v-model="fullname" required></b-input>
    </b-field>
    <b-field label="Сокращенное наименование предмета">
      <b-input placeholder="Сокращенное наименование предмета" v-model="shortname" required></b-input>
    </b-field>
    <b-field label="Изображение предмета">
      <b-input placeholder="Вставьте ссылку" v-model="image"></b-input>
    </b-field>
    <span @click="image='/items/pieces/'">Кусок,</span>
    <span @click="image='/items/full/'">Целый</span>
    <b-field label="Тип предмета">
      <div class="block">
        <b-radio v-model="type" native-value="weapon">Оружие</b-radio>
        <b-radio v-model="type" native-value="armor">Броня</b-radio>
        <b-radio v-model="type" native-value="jewelry">Бижутерия</b-radio>
        <b-radio v-model="type" native-value="pieces">Куски</b-radio>
        <b-radio v-model="type" native-value="сonsumables">Расходники</b-radio>
        <b-radio v-model="type" native-value="sa">SA</b-radio>
      </div>
    </b-field>

    <b-field label="Ранг предмета" v-if="type && type !=='pieces' && type !=='sa'">
      <b-select placeholder="Выберите ранг" v-model="grade">
        <option v-for="grade in grades" :key="grade.value" :value="grade.value">{{grade.name}}</option>
      </b-select>
    </b-field>

    <b-field label="Тип оружия" v-if="type && type === 'weapon'">
      <b-select placeholder="Выберите тип" v-model="weaponType">
        <option v-for="type in weaponTypes" :key="type.value" :value="type.value">{{type.name}}</option>
      </b-select>
    </b-field>

    <b-field label="Тип брони" v-if="type && type === 'armor'">
      <b-select placeholder="Выберите тип" v-model="armorType">
        <option v-for="type in armorTypes" :key="type.value" :value="type.value">{{type.name}}</option>
      </b-select>
    </b-field>

    <b-field label="Тип бижутерии" v-if="type && type === 'jewelry'">
      <b-select placeholder="Выберите тип" v-model="jewelryType">
        <option v-for="type in jewelryTypes" :key="type.value" :value="type.value">{{type.name}}</option>
      </b-select>
    </b-field>
    <button
      v-if="action === 'update'"
      class="button is-danger"
      type="button"
      @click="$emit('back', $event)"
    >Назад</button>
    <button
      v-if="action ==='update'"
      class="button is-success"
      type="button"
      @click="$emit('update', composeItemData())"
    >Сохранить</button>
    <button
      v-if="action ==='create'"
      class="button is-success"
      type="button"
      @click="$emit('create', composeItemData())"
    >Создать</button>
  </form>
</template>

<script>
export default {
  name: "itemsForm",
  data() {
    return {
      id: this.item.id,
      fullname: this.item.fullname,
      shortname: this.item.shortname,
      image: this.item.image,
      type: this.item.type, //full or piece,
      grade: this.item.grade,
      weaponType: this.weaponType,
      armorType: this.armorType,
      jewelryType: this.jewelryType,
      grades: [
        { value: "NG", name: "no-grade" },
        { value: "D", name: "D-grade" },
        { value: "C", name: "C-grade" },
        { value: "B", name: "B-grade" },
        { value: "A", name: "A-grade" },
        { value: "S", name: "S-grade" },
        { value: "S80", name: "S80-grade" },
        { value: "S84", name: "S84-grade" }
      ],
      weaponTypes: [
        { value: "blunt", name: "Ударное / Blunt" },
        { value: "bow", name: "Лук / Bow" },
        { value: "dagger", name: "Кинжал / Dagger" },
        { value: "dual", name: "Дуалы / Dual" },
        { value: "fist", name: "Кастеты / Fist" },
        { value: "pole", name: "Пика / Pole" },
        { value: "sword", name: "Меч / Sword" },
        { value: "rapier", name: "Рапира / Rapier" },
        { value: "arbalest", name: "Арбалет / arbalest" }
      ],
      armorTypes: [
        { value: "chest", name: "Верх / Chest" },
        { value: "legs", name: "Низ / Legs" },
        { value: "fullbody", name: "Цельное / Fullbody" },
        { value: "boots", name: "Ботинки / Boots" },
        { value: "gloves", name: "Перчатки / Gloves" },
        { value: "helmet", name: "Шлем / Helmet" },
        { value: "shield", name: "Щит / Shield" },
        { value: "cloak", name: "Плащ / Cloak" }
      ],
      jewelryTypes: [
        { value: "ring", name: "Кольцо / Ring" },
        { value: "earning", name: "Серьга / Earning" },
        { value: "necklace", name: "Некля / Necklace" }
      ]
    };
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    }
  },
  methods: {
    composeItemData() {
      let item = {
        id: this.id,
        fullname: this.fullname,
        type: this.type
      };
      if (this.shortname) item.shortname = this.shortname;
      if (this.image) item.image = this.image;
      if (this.grade) item.grade = this.grade;
      if (this.type === "weapon") item.weaponType = this.weaponType;
      if (this.type === "armor") item.armorType = this.armorType;
      if (this.type === "jewelry") item.jewelryType = this.jewelryType;
      return item;
    }
  }
};
</script>

<style>
.modal-form {
  padding: 0;
}
</style>
