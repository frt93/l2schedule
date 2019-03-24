<template>
  <section>
    <b-table
      ref="table"
      paginated
      per-page="50"
      detailed
      detail-key="id"
      :data="items"
      :opened-detailed="defaultOpenedDetails"
      :show-detail-icon="showDetailIcon"
      :mobile-cards="true"
      :hoverable="true"
      default-sort-direction="asc"
      default-sort="fullname"
    >
      <template slot-scope="props">
        <b-table-column field="fullname" label="Наименование" sortable>
          <template v-if="showDetailIcon">
            <img :src="props.row.image" alt>
            <span
              class="account"
              @click="$emit('copy',`Наименование ${props.row.fullname} скопировано`, props.row.fullname)"
            >
              <b-tooltip
                label="Кликни, чтобы скопировать"
                position="is-bottom"
                type="is-dark"
                animated
              >{{ props.row.fullname }}</b-tooltip>
            </span>
          </template>
        </b-table-column>

        <b-table-column field="grade" label="Ранг" sortable>{{ props.row.grade }}</b-table-column>
        <b-table-column field="type" label="Тип предмета" sortable>{{itemType(props.row)}}</b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <article class="media">
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{props.row.shortname}}</strong>
                <br>
                <small v-if="props.row.grade">{{props.row.grade}}-grade</small>
                <br>
                <small>{{itemType(props.row)}}</small>
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
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      defaultOpenedDetails: ["15530240018"],
      showDetailIcon: true,
      loading: this.isLoading
    };
  },
  computed: {
    ...mapGetters({ items: "items/getAll" })
  },
  methods: {
    itemType(item) {
      let response = item.type;
      if (item.weaponType) response = response + ` (${item.weaponType})`;
      if (item.armorType) response = response + ` (${item.armorType})`;
      if (item.jewelryType) response = response + ` (${item.jewelryType})`;
      return response;
    }
  }
};
</script>