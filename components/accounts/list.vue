<template>
  <div class="container accounts">
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <div class="control" v-if="sortAccounts('main').length">
            <b-switch v-model="isMain">Мейны</b-switch>
          </div>
          <div class="control" v-if="sortAccounts('10+').length">
            <b-switch v-model="is10th">10+</b-switch>
          </div>
          <div class="control" v-if="sortAccounts('qa').length">
            <b-switch v-model="isQA">АК</b-switch>
          </div>
          <div class="control" v-if="sortAccounts('zaken').length">
            <b-switch v-model="isZaken">Закен</b-switch>
          </div>
          <div class="control" v-if="sortAccounts('trader').length">
            <b-switch v-model="isTraders">Трейдеры</b-switch>
          </div>
          <div class="control" v-if="sortAccounts('watcher').length">
            <b-switch v-model="isWatchers">Палилки</b-switch>
          </div>
        </b-field>
      </div>
      <div class="level-right">
        <a class="button is-success level-item" @click="createAccount">Добавить</a>
      </div>
    </div>
    <div class="accounts">
      <div id="main" v-if="isMain && sortAccounts('main').length">
        <section class="hero is-dark">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Мейн состав</h1>
            </div>
          </div>
        </section>

        <b-table
          per-page="50"
          :row-class="(row, index) => 'row account'"
          :data="sortAccounts('main')"
          :mobile-cards="true"
          :hoverable="true"
        >
          <template slot-scope="props">
            <b-table-column field="login" label="Логин">
              <span class="login" @click="copy(`Логин скопирован`,  props.row.login )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >{{ props.row.login }}</b-tooltip>
              </span>
              <span class="manage-icons">
                <b-tooltip
                  label="Изменить информацию об аккаунте"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i class="mdi mdi-pencil edit" @click="editAccount(props.row)"></i>
                </b-tooltip>
                <span v-if="!props.row.characters.length">
                  <b-tooltip label="Удалить аккаунт" position="is-bottom" type="is-dark" animated>
                    <i class="mdi mdi-delete remove" @click="removeAccount(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length">
                  <b-tooltip
                    label="Для начала удалите персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-delete disabled remove"></i>
                  </b-tooltip>
                </span>
              </span>
            </b-table-column>
            <b-table-column field="password" label="Пароль" centered>
              <span class="password" @click="copy(`Пароль скопирован`,  props.row.password )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-right"
                  type="is-dark"
                  animated
                >{{ props.row.password }}</b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="nickname" label="Персонаж" centered>
              <span class="manage-icons character" v-if="!props.row.characters.length">
                <b-tooltip label="Добавить персонажа" position="is-bottom" type="is-dark" animated>
                  <i class="mdi mdi-account-plus add" @click="newCharacter(props.row)"></i>
                </b-tooltip>
              </span>
              <span
                class="nickname"
                v-if="props.row.characters.length"
                @click="copy(`Никнейм скопирован`,  props.row.characters[0].nickname )"
              >
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-left"
                  type="is-dark"
                  animated
                >{{props.row.characters[0].nickname}}</b-tooltip>
              </span>
              <span class="manage-icons" v-if="props.row.characters.length">
                <b-tooltip
                  label="Изменить информацию о персонаже"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i
                    class="mdi mdi-account-edit edit"
                    @click="editCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
                <b-tooltip label="Удалить персонажа" position="is-bottom" type="is-dark" animated>
                  <i
                    class="mdi mdi-account-remove remove"
                    @click="removeCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="profession" label="Профа" centered>
              <span
                v-if="props.row.characters.length"
                class="profession"
              >{{props.row.characters[0].profession}}</span>
            </b-table-column>

            <b-table-column field="owner" label="Мембер" centered>{{props.row.owner}}</b-table-column>
          </template>
        </b-table>
      </div>

      <div id="10th" v-if="is10th && sortAccounts('10+').length">
        <section class="hero is-dark">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Персонажи состава 10+</h1>
            </div>
          </div>
        </section>
        <b-table
          per-page="50"
          detail-key="id"
          :row-class="(row, index) => 'row account'"
          :data="sortAccounts('10+')"
          :mobile-cards="true"
          :hoverable="true"
        >
          <template slot-scope="props">
            <b-table-column field="login" label="Логин">
              <span class="login" @click="copy(`Логин скопирован`,  props.row.login )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >{{ props.row.login }}</b-tooltip>
              </span>
              <span class="manage-icons">
                <b-tooltip
                  label="Изменить информацию об аккаунте"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i class="mdi mdi-pencil edit" @click="editAccount(props.row)"></i>
                </b-tooltip>
                <span v-if="!props.row.characters.length">
                  <b-tooltip label="Удалить аккаунт" position="is-bottom" type="is-dark" animated>
                    <i class="mdi mdi-delete remove" @click="removeAccount(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length">
                  <b-tooltip
                    label="Для начала удалите персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-delete disabled remove"></i>
                  </b-tooltip>
                </span>
              </span>
            </b-table-column>

            <b-table-column field="password" label="Пароль" centered>
              <span class="password" @click="copy(`Пароль скопирован`,  props.row.password )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-right"
                  type="is-dark"
                  animated
                >{{ props.row.password }}</b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="nickname" label="Персонаж" centered>
              <span class="manage-icons character" v-if="!props.row.characters.length">
                <b-tooltip label="Добавить персонажа" position="is-bottom" type="is-dark" animated>
                  <i class="mdi mdi-account-plus add" @click="newCharacter(props.row)"></i>
                </b-tooltip>
              </span>
              <span
                class="nickname"
                v-if="props.row.characters.length"
                @click="copy(`Никнейм скопирован`,  props.row.characters[0].nickname )"
              >
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-left"
                  type="is-dark"
                  animated
                >{{props.row.characters[0].nickname}}</b-tooltip>
              </span>
              <span class="manage-icons" v-if="props.row.characters.length">
                <b-tooltip
                  label="Изменить информацию о персонаже"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i
                    class="mdi mdi-account-edit edit"
                    @click="editCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
                <b-tooltip label="Удалить персонажа" position="is-bottom" type="is-dark" animated>
                  <i
                    class="mdi mdi-account-remove remove"
                    @click="removeCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="profession" label="Профа" centered>
              <span
                v-if="props.row.characters.length"
                class="profession"
              >{{props.row.characters[0].profession}}</span>
            </b-table-column>
          </template>
        </b-table>
      </div>

      <div id="qa" v-if="isQA && sortAccounts('qa').length">
        <section class="hero is-dark">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Твинки для Ант Квины</h1>
            </div>
          </div>
        </section>
        <b-table
          per-page="50"
          detail-key="id"
          :row-class="(row, index) => 'row account'"
          :data="sortAccounts('qa')"
          :mobile-cards="true"
          :hoverable="true"
        >
          <template slot-scope="props">
            <b-table-column field="login" label="Логин">
              <span class="login" @click="copy(`Логин скопирован`,  props.row.login )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >{{ props.row.login }}</b-tooltip>
              </span>
              <span class="manage-icons">
                <b-tooltip
                  label="Изменить информацию об аккаунте"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i class="mdi mdi-pencil edit" @click="editAccount(props.row)"></i>
                </b-tooltip>
                <span v-if="!props.row.characters.length">
                  <b-tooltip label="Удалить аккаунт" position="is-bottom" type="is-dark" animated>
                    <i class="mdi mdi-delete remove" @click="removeAccount(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length">
                  <b-tooltip
                    label="Для начала удалите персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-delete disabled remove"></i>
                  </b-tooltip>
                </span>
              </span>
            </b-table-column>

            <b-table-column field="password" label="Пароль" centered>
              <span class="password" @click="copy(`Пароль скопирован`,  props.row.password )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-right"
                  type="is-dark"
                  animated
                >{{ props.row.password }}</b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="nickname" label="Персонаж" centered>
              <span class="manage-icons character" v-if="!props.row.characters.length">
                <b-tooltip label="Добавить персонажа" position="is-bottom" type="is-dark" animated>
                  <i class="mdi mdi-account-plus add" @click="newCharacter(props.row)"></i>
                </b-tooltip>
              </span>
              <span
                class="nickname"
                v-if="props.row.characters.length"
                @click="copy(`Никнейм скопирован`,  props.row.characters[0].nickname )"
              >
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-left"
                  type="is-dark"
                  animated
                >{{props.row.characters[0].nickname}}</b-tooltip>
              </span>
              <span class="manage-icons" v-if="props.row.characters.length">
                <b-tooltip
                  label="Изменить информацию о персонаже"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i
                    class="mdi mdi-account-edit edit"
                    @click="editCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
                <b-tooltip label="Удалить персонажа" position="is-bottom" type="is-dark" animated>
                  <i
                    class="mdi mdi-account-remove remove"
                    @click="removeCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="profession" label="Профа" centered>
              <span
                v-if="props.row.characters.length"
                class="profession"
              >{{props.row.characters[0].profession}}</span>
            </b-table-column>
          </template>
        </b-table>
      </div>

      <div id="zaken" v-if="isZaken && sortAccounts('zaken').length">
        <section class="hero is-dark">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Твинки для закена</h1>
            </div>
          </div>
        </section>
        <b-table
          per-page="50"
          detail-key="id"
          :row-class="(row, index) => 'row account'"
          :data="sortAccounts('zaken')"
          :mobile-cards="true"
          :hoverable="true"
        >
          <template slot-scope="props">
            <b-table-column field="login" label="Логин">
              <span class="login" @click="copy(`Логин скопирован`,  props.row.login )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >{{ props.row.login }}</b-tooltip>
              </span>
              <span class="manage-icons">
                <b-tooltip
                  label="Изменить информацию об аккаунте"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i class="mdi mdi-pencil edit" @click="editAccount(props.row)"></i>
                </b-tooltip>
                <span v-if="!props.row.characters.length">
                  <b-tooltip label="Удалить аккаунт" position="is-bottom" type="is-dark" animated>
                    <i class="mdi mdi-delete remove" @click="removeAccount(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length">
                  <b-tooltip
                    label="Для начала удалите персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-delete disabled remove"></i>
                  </b-tooltip>
                </span>
              </span>
            </b-table-column>

            <b-table-column field="password" label="Пароль" centered>
              <span class="password" @click="copy(`Пароль скопирован`,  props.row.password )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-right"
                  type="is-dark"
                  animated
                >{{ props.row.password }}</b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="nickname" label="Персонаж" centered>
              <span class="manage-icons character" v-if="!props.row.characters.length">
                <b-tooltip label="Добавить персонажа" position="is-bottom" type="is-dark" animated>
                  <i class="mdi mdi-account-plus add" @click="newCharacter(props.row)"></i>
                </b-tooltip>
              </span>
              <span
                class="nickname"
                v-if="props.row.characters.length"
                @click="copy(`Никнейм скопирован`,  props.row.characters[0].nickname )"
              >
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-left"
                  type="is-dark"
                  animated
                >{{props.row.characters[0].nickname}}</b-tooltip>
              </span>
              <span class="manage-icons" v-if="props.row.characters.length">
                <b-tooltip
                  label="Изменить информацию о персонаже"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i
                    class="mdi mdi-account-edit edit"
                    @click="editCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
                <b-tooltip label="Удалить персонажа" position="is-bottom" type="is-dark" animated>
                  <i
                    class="mdi mdi-account-remove remove"
                    @click="removeCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="profession" label="Профа" centered>
              <span
                v-if="props.row.characters.length"
                class="profession"
              >{{props.row.characters[0].profession}}</span>
            </b-table-column>
          </template>
        </b-table>
      </div>

      <div id="traders" v-if="isTraders && sortAccounts('trader').length">
        <section class="hero is-dark">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Трейдеры</h1>
            </div>
          </div>
        </section>
        <b-table
          per-page="50"
          detail-key="id"
          detailed
          :row-class="(row, index) => 'row account'"
          :data="sortAccounts('trader')"
          :mobile-cards="true"
          :hoverable="true"
        >
          <template slot-scope="props">
            <b-table-column field="login" label="Логин">
              <span class="login" @click="copy(`Логин скопирован`,  props.row.login )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >{{ props.row.login }}</b-tooltip>
              </span>
              <span class="manage-icons">
                <b-tooltip
                  label="Изменить информацию об аккаунте"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i class="mdi mdi-pencil edit" @click="editAccount(props.row)"></i>
                </b-tooltip>
                <span v-if="!props.row.characters.length">
                  <b-tooltip label="Удалить аккаунт" position="is-bottom" type="is-dark" animated>
                    <i class="mdi mdi-delete remove" @click="removeAccount(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length">
                  <b-tooltip
                    label="Для начала удалите персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-delete disabled remove"></i>
                  </b-tooltip>
                </span>
              </span>
            </b-table-column>

            <b-table-column field="password" label="Пароль" centered>
              <span class="password" @click="copy(`Пароль скопирован`,  props.row.password )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-right"
                  type="is-dark"
                  animated
                >{{ props.row.password }}</b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="nickname" label="Персонаж" centered>
              <span class="manage-icons character" v-if="!props.row.characters.length">
                <b-tooltip label="Добавить персонажа" position="is-bottom" type="is-dark" animated>
                  <i class="mdi mdi-account-plus add" @click="newCharacter(props.row)"></i>
                </b-tooltip>
              </span>
              <span
                class="nickname"
                v-if="props.row.characters.length"
                @click="copy(`Никнейм скопирован`,  props.row.characters[0].nickname )"
              >
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-left"
                  type="is-dark"
                  animated
                >{{props.row.characters[0].nickname}}</b-tooltip>
              </span>
              <span class="manage-icons" v-if="props.row.characters.length">
                <b-tooltip
                  label="Изменить информацию о персонаже"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i
                    class="mdi mdi-account-edit edit"
                    @click="editCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
                <b-tooltip label="Удалить персонажа" position="is-bottom" type="is-dark" animated>
                  <i
                    class="mdi mdi-account-remove remove"
                    @click="removeCharacter(props.row, props.row.characters[0])"
                  ></i>
                </b-tooltip>
              </span>
            </b-table-column>
            <b-table-column field="shopType" label="Тип лавки" centered>
              <span
                v-if="props.row.characters.length"
                class="shopType"
              >{{props.row.characters[0].shopType}}</span>
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <article class="media" v-for="item in props.row.characters[0].items" :key="item.name">
              <figure class="media-left">
                <p class="image is-32x32">
                  <img :src="item.image">
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p class="trade-item">
                    <strong>{{item.name}}</strong>
                    <br>
                    <small>Кол-во: {{item.quantity}}</small>
                    <small>по {{item.price}} aden</small>
                    <br>
                  </p>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </div>

      <div id="watcher" v-if="isWatchers && sortAccounts('watcher').length">
        <section class="hero is-dark">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Палилки</h1>
            </div>
          </div>
        </section>
        <b-table
          per-page="50"
          detail-key="id"
          detailed
          :row-class="(row, index) => 'row account'"
          :data="sortAccounts('watcher')"
          :mobile-cards="true"
          :hoverable="true"
        >
          <template slot-scope="props">
            <b-table-column field="login" label="Логин">
              <span class="login" @click="copy(`Логин скопирован`,  props.row.login )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >{{ props.row.login }}</b-tooltip>
              </span>
              <span class="manage-icons">
                <b-tooltip
                  label="Изменить информацию об аккаунте"
                  position="is-bottom"
                  type="is-dark"
                  animated
                >
                  <i class="mdi mdi-pencil edit" @click="editAccount(props.row)"></i>
                </b-tooltip>
                <span v-if="!props.row.characters.length">
                  <b-tooltip label="Удалить аккаунт" position="is-bottom" type="is-dark" animated>
                    <i class="mdi mdi-delete remove" @click="removeAccount(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length < 7">
                  <b-tooltip
                    label="Добавить персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-account-plus add" @click="newCharacter(props.row)"></i>
                  </b-tooltip>
                </span>
                <span v-if="props.row.characters.length">
                  <b-tooltip
                    label="Для начала удалите персонажа"
                    position="is-bottom"
                    type="is-dark"
                    animated
                  >
                    <i class="mdi mdi-delete disabled remove"></i>
                  </b-tooltip>
                </span>
              </span>
            </b-table-column>

            <b-table-column field="password" label="Пароль" centered>
              <span class="password" @click="copy(`Пароль скопирован`,  props.row.password )">
                <b-tooltip
                  label="Кликни, чтобы скопировать"
                  position="is-right"
                  type="is-dark"
                  animated
                >{{ props.row.password }}</b-tooltip>
              </span>
            </b-table-column>

            <b-table-column field="nickname" label="Цели наблюдения" centered>
              <span class="targets" v-if="props.row.characters.length">
                <span
                  class="targets"
                  v-for="character in props.row.characters"
                  :key="character.id"
                >{{character.watchFor}}</span>
              </span>
            </b-table-column>
          </template>

          <template slot="detail" slot-scope="props">
            <article class="media" v-for="character in props.row.characters" :key="character.id">
              <div class="media-content">
                <div class="content">
                  <p class="character">
                    <span
                      class="nickname"
                      @click="copy(`Никнейм скопирован`,  character.nickname )"
                    >
                      <b-tooltip
                        label="Кликни, чтобы скопировать"
                        position="is-bottom"
                        type="is-dark"
                        animated
                      >{{character.nickname}}</b-tooltip>
                    </span>
                    <span class="manage-icons">
                      <b-tooltip
                        label="Изменить информацию о персонаже"
                        position="is-bottom"
                        type="is-dark"
                        animated
                      >
                        <i
                          class="mdi mdi-account-edit edit"
                          @click="editCharacter(props.row, character)"
                        ></i>
                      </b-tooltip>
                      <b-tooltip
                        label="Удалить персонажа"
                        position="is-bottom"
                        type="is-dark"
                        animated
                      >
                        <i
                          class="mdi mdi-account-remove remove"
                          @click="removeCharacter(props.row, character)"
                        ></i>
                      </b-tooltip>
                    </span>
                    <br>
                    <small>Палилка за: {{character.watchFor}}</small>
                    <br>
                  </p>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </div>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" :canCancel="['x', 'outside']">
      <modal
        :account="accountToManage"
        :character="characterToManage"
        :initialAction="modalAction"
        @copy="copy"
      ></modal>
    </b-modal>
    <accountRemove
      :account="accountToManage"
      v-if="isRemoveAccount"
      @removed="isRemoveAccount=false"
    ></accountRemove>
    <characterRemove
      :account="accountToManage"
      :character="characterToManage"
      v-if="isRemoveCharacter"
      @removed="isRemoveCharacter=false"
    ></characterRemove>
  </div>
</template>

<script>
import modal from "./modal";
import accountRemove from "./removeAccount";
import characterRemove from "./removeCharacter";
import { mapGetters } from "vuex";
export default {
  name: "accountsListComponent",
  components: {
    modal,
    accountRemove,
    characterRemove
  },
  data() {
    return {
      isMain: true,
      is10th: true,
      isQA: true,
      isZaken: true,
      isTraders: true,
      isWatchers: true,
      showDetailIcon: true,
      accountToManage: {},
      characterToManage: {},
      isRemoveAccount: false,
      isRemoveCharacter: false,
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
    /**
     * Выбираем из массива со всеми аккаунту только те, которую соответствуют нужному типу
     *
     * @param type              Тип искомых аккаунтов
     */
    sortAccounts(type) {
      return this.accounts.filter(account => {
        return account.type === type;
      });
    },

    /**
     * Запускаем процесс создания аккаунту
     */
    createAccount() {
      this.isModalActive = true;
      this.modalAction = "createAccount";
    },

    /**
     * Запускаем процесс изменения информации об аккаунте.
     *
     * @param account           Экземпляр обновляемого аккаунта
     */
    editAccount(account) {
      this.accountToManage = account;
      this.isModalActive = true;
      this.modalAction = "editAccount";
    },

    /**
     * Запускаем процесс удаления аккаунта.
     *
     * @param account           Экземпляр удаляемого аккаунта
     */
    removeAccount(account) {
      this.accountToManage = account;
      this.isRemoveAccount = true;
    },

    /**
     * Запускаем процесс добавления персонажа к аккаунту
     *
     * @param account           Экземпляр аккаунта, к которому будет добавляться персонаж
     */
    newCharacter(account) {
      this.accountToManage = account;
      this.isModalActive = true;
      this.modalAction = "newCharacter";
    },

    /**
     * Запускаем процесс изменения информации о персонаже.
     *
     * @param account           Экземпляр аккаунта, к которому привязан редактируемый персонаж
     * @param character         Экземпляр редактируемого персонажа
     */
    editCharacter(account, character) {
      this.accountToManage = account;
      this.characterToManage = character;
      this.isModalActive = true;
      this.modalAction = "editCharacter";
    },

    /**
     * Запускаем процесс удаление персонажа с аккаунта.
     *
     * @param account           Аккаунт, к которому привязан удаляемый персонаж
     * @param character         Экземпляр удаляемого персонажа
     */
    removeCharacter(account, character) {
      this.accountToManage = account;
      this.characterToManage = character;
      this.isRemoveCharacter = true;
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
<style scoped>
.hero-body {
  padding: 1rem 1.5rem;
  text-align: center;
}

.b-table {
  margin-bottom: 40px;
}
.manage-icons.character {
  position: inherit;
  margin: 0;
}

.character:hover .manage-icons {
  visibility: inherit;
  -webkit-animation: scale 0.1s ease-out;
  animation: scale 0.1s ease-out;
}
.character .manage-icons i {
  opacity: 0.5;
}
.character .manage-icons i:hover {
  opacity: 1;
}

.accounts table td {
  max-width: 100px;
}

.trade-item {
  font-size: 12px;
  line-height: 16px;
}

.targets span:before {
  content: ", ";
}

.targets span:first-child:before {
  content: "";
}
</style>