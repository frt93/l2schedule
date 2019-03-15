<template>
  <RBform :boss="boss" :page="'add'" @addBoss="addBoss"></RBform>
</template>

<script>
import RBform from "~/components/ui/raidbossForm";
export default {
  components: { RBform },
  data() {
    return {
      boss: {
        filteredItems: "",
        filteredPieces: "",
        filteredSa: "",
        items: [],
        pieces: [],
        sa: [],
        isSA: false,
        enchantConditions: "",
        fullname: "",
        shortname: "",
        account: "",
        min_respawn: "",
        max_respawn: "",
        tod: "",
        respawn_start: "",
        respawn_end: "",
        account: "",
        lvl: "",
        hp: "",
        p_atk: "",
        p_def: "",
        m_atk: "",
        m_def: "",
        type: "regular"
      },
      errors: ""
    };
  },
  methods: {
    addBoss(boss) {
      boss.tod = "";
      console.log(boss);
    },
    saveBoss(form) {
      const boss = {
        fullname: this.fullname,
        shortname: this.shortname,
        min_respawn: this.min_respawn,
        max_respawn: this.max_respawn,
        tod: "",
        respawn_start: "",
        respawn_end: "",
        account: "",
        lvl: this.lvl,
        hp: this.hp,
        p_atk: this.p_atk,
        p_def: this.p_def,
        m_atk: this.m_atk,
        m_def: this.m_def,
        type: "regular",
        items: this.items,
        pieces: this.pieces,
        isSA: this.isSA,
        sa: this.sa,
        enchantConditions: this.enchantConditions
      };
      this.$axios
        .post("/rb/add", boss)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          this.errors = [];
          this.errors.push(err.response.data);
        });
    }
  },

  computed: {
    isEncahntSA() {
      return this.isSA == true ? "Да, качаются" : "Нет";
    }
  }
};
</script>


