<template>
  <section>
    <b-table
      ref="table"
      paginated
      per-page="50"
      detailed
      detail-key="id"
      :data="data"
      :loading="loading"
      :show-detail-icon="showDetailIcon"
      :mobile-cards="true"
      :hoverable="true"
      default-sort-direction="desc"
      default-sort="respawn_end"
    >
      <template slot-scope="props">
        <b-table-column field="shortname" label="Имя РБ">
          <template v-if="showDetailIcon">{{ props.row.shortname }}</template>
        </b-table-column>

        <b-table-column field="lvl" label="Уровень" sortable>{{ props.row.lvl }}</b-table-column>
        <b-table-column field="id" label="Аккаунт палилки">
          <span
            class="account"
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

        <b-table-column field="respawn_end" label="Статус респа" sortable centered>
          <span
            class="tag"
            :class="tagClass(props.row.respawn_start, props.row.respawn_end)"
          >{{ timeleftToRespawn[props.row.id] }}</span>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img src="https://buefy.org/static/img/placeholder-128x128.png">
            </p>
          </figure>
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
          <div class="level-right">
            <a class="button is-info" @click="$emit('update', props.row)">Редактировать</a>
            <a class="button is-danger" @click="$emit('remove', props.row)">Удалить</a>
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
    }
  }
};
</script>

<style>
.rb-fullname,
.account {
  cursor: pointer;
}

span.account {
  border-bottom: 1px dashed #b5b5b5;
}

a.button {
  margin-left: 10px;
}
</style>
