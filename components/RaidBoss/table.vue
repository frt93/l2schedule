<template>
  <section>
    <b-table
      ref="table"
      :paginated="isPaginated()"
      per-page="50"
      detailed
      detail-key="id"
      :row-class="(row, index) => 'row'"
      :data="data"
      :loading="loading"
      :show-detail-icon="showDetailIcon"
      :mobile-cards="true"
      :hoverable="true"
    >
      <template slot-scope="props">
        <b-table-column field="shortname" label="Имя РБ">
          <template v-if="showDetailIcon">{{ props.row.shortname }}</template>
          <span class="manage-icons">
            <b-tooltip
              label="Изменить информацию о РБ"
              position="is-bottom"
              type="is-dark"
              animated
            >
              <i class="mdi mdi-pencil edit" @click="$emit('update', props.row)"></i>
            </b-tooltip>
            <b-tooltip label="Удалить РБ" position="is-bottom" type="is-dark" animated>
              <i class="mdi mdi-delete remove" @click="$emit('remove', props.row)"></i>
            </b-tooltip>
          </span>
        </b-table-column>

        <b-table-column field="lvl" label="Уровень">{{ props.row.lvl }}</b-table-column>
        <b-table-column field="account" label="Аккаунт палилки">
          <span class="subtitle-child" v-if="!props.row.account">Нет палилки</span>
          <span
            v-else
            class="login"
            @click="$emit('copy',`Логин аккаунта ${props.row.account} с палилкой скопирован`, props.row.account)"
          >
            <b-tooltip
              label="Кликни, чтобы скопировать"
              position="is-bottom"
              type="is-dark"
              animated
            >{{ props.row.account }}</b-tooltip>
          </span>
        </b-table-column>

        <b-table-column field="respawn_end" label="Статус респа" centered>
          <span
            class="tag"
            :class="tagClass(props.row.respawn_start, props.row.respawn_end)"
          >{{ timeleftToRespawn[props.row.id] }}</span>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <article class="media">
          <figure class="media-left"></figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong
                  class="rb-fullname"
                  @click="$emit('copy', `Имя РБ ${props.row.fullname} скопировано`,  props.row.fullname)"
                >{{ props.row.fullname }}</strong>
                <br>
                <small></small>
                <br>
                Начало респа: {{$moment.unix(props.row.respawn_start).format('DD MM YYYY HH:mm')}}
                <br>
                Конец респа: {{$moment.unix(props.row.respawn_end).format('DD MM YYYY HH:mm')}}
              </p>
            </div>
          </div>
        </article>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showDetailIcon: true,
      loading: this.isLoading
    };
  },

  props: {
    data: {
      type: Array,
      required: true
    },
    timeleftToRespawn: {
      type: Object,
      required: true
    }
  },
  computed: {
    isLoading() {
      return this.data.length ? false : true;
    }
  },
  methods: {
    tagClass(start, end) {
      const now = this.$moment().unix();
      if (start === null || end === null) return "is-light";
      else if (start > now) return "is-warning";
      else if (now >= start && now < end) return "is-success";
      else if (now > end) return "is-danger";
    },
    isPaginated() {
      return this.data.length > 50 ? true : false;
    }
  },
  watch: {
    data() {
      this.isPaginated();
    }
  }
};
</script>

<style>
a.button {
  margin-left: 10px;
}
</style>
