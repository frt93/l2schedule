<template>
  <div class="container accounts">
    <div class="accounts">
      <a class="button is-success" @click="create">Добавить</a>
      <span>Мейн состав</span>
      <b-table
        per-page="50"
        detail-key="id"
        :row-class="(row, index) => 'row'"
        :data="sortAccounts('main')"
        :mobile-cards="true"
        :hoverable="true"
        default-sort-direction="desc"
        default-sort="type"
      >
        <template slot-scope="props">
          <b-table-column field="login" label="Логин" centered>
            <span class="manage-icons left">
              <i class="mdi mdi-pencil edit"></i>
              <i class="mdi mdi-delete remove" @click="remove(props.row)"></i>
            </span>
            <span
              class="login"
              @click="copy(`Логин скопирован`,  props.row.login )"
            >{{ props.row.login }}</span>
          </b-table-column>
          <b-table-column field="password" label="Пароль" centered>
            <span
              class="password"
              @click="copy(`Пароль скопирован`,  props.row.password )"
            >{{ props.row.password }}</span>
          </b-table-column>
          <b-table-column field="profecy" label="Профа" centered>
            <span v-if="props.row.characters.length">{{props.row.characters[0].profecy}}</span>
          </b-table-column>

          <b-table-column field="nickname" label="Ник" centered>
            <span
              class="nickname"
              v-if="props.row.characters.length"
              @click="copy(`Никнейм скопирован`,  props.row.characters[0].nickname )"
            >{{props.row.characters[0].nickname}}</span>
          </b-table-column>
          <b-table-column field="owner" label="Мембер" centered>{{props.row.owner}}</b-table-column>
        </template>
      </b-table>

      <span>Твинки</span>
      <b-table
        per-page="50"
        detail-key="id"
        :data="sortAccounts('tvink')"
        :mobile-cards="true"
        :hoverable="true"
        default-sort-direction="desc"
        default-sort="type"
      >
        <template slot-scope="props">
          <b-table-column field="login" label="Логин" centered>
            <span
              class="login"
              @click="copy(`Логин скопирован`,  props.row.login )"
            >{{ props.row.login }}</span>
          </b-table-column>

          <b-table-column field="password" label="Пароль" centered>
            <span
              class="password"
              @click="copy(`Пароль скопирован`,  props.row.password )"
            >{{ props.row.password }}</span>
          </b-table-column>

          <b-table-column field="profecy" label="Профа" centered>{{props.row.characters[0].profecy}}</b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
          <article class="media">
            <figure class="media-left">
              <p class="image is-64x64">
                <img src="https://buefy.org/static/img/placeholder-128x128.png">
              </p>
            </figure>
            <div class="media-content">
              <div class="content"></div>
            </div>
            <div class="level-right">
              <a class="button is-info" @click="$emit('update', props.row)">Редактировать</a>
              <a class="button is-danger" @click="$emit('remove', props.row)">Удалить</a>
            </div>
          </article>
        </template>
      </b-table>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <modal :data="accountToManage" :initialAction="modalAction" @copy="copy"></modal>
    </b-modal>
    <remove :account="accountToManage" v-if="isRemove" @removed="isRemove=false"></remove>
  </div>
</template>

<script>
import modal from "./modal";
import remove from "./removeAccount";
import { mapGetters } from "vuex";
export default {
  name: "accountsListComponent",
  components: {
    modal,
    remove
  },
  data() {
    return {
      showDetailIcon: true,
      accountToManage: null,
      isRemove: false,
      modalAction: null,
      isModalActive: false
    };
  },
  computed: {
    ...mapGetters({
      accounts: "accounts/getAll"
    })
  },
  methods: {
    sortAccounts(type) {
      return this.accounts.filter(account => {
        return account.type === type;
      });
    },
    create() {
      this.isModalActive = true;
      this.modalAction = "create";
    },
    remove(account) {
      this.accountToManage = account;
      this.isRemove = true;
    },
    async copy(message, textToCopy) {
      try {
        await this.$copyText(textToCopy);
        this.$toast.open({
          message: message,
          type: "is-success",
          duration: 3000,
          queue: false
        });
      } catch (e) {
        this.$toast.open({
          message: e,
          type: "is-danger",
          duration: 3000,
          queue: false
        });
      }
    }
  }
};
</script>