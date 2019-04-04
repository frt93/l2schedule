const { Router } = require('express');
const router = Router();

const toLowerCaseAndReplaceSpaces = require('../plugins/mixins');

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const bosses = new FileAsync('db/bosses.json');

low(bosses).then(db => {
  db._.mixin({
    // Проверяем уникальность Рейдового Босса, путем поиска среди уже существующих идентичного полного имени,
    // короткого имени (предварительно прогнав их через метод toLowerCaseAndReplaceSpaces) или ID.
    // Эти три миксина вызываются в функции create() после получения коллекции РБ и перед попыткой сохранить в ней нового
    isUniqueFullname: function(bosses, fullname) {
      if (
        bosses.findIndex(
          boss =>
            toLowerCaseAndReplaceSpaces(boss['fullname']) === toLowerCaseAndReplaceSpaces(fullname)
        ) === -1
      ) {
        return bosses;
      } else {
        throw {
          name: 'Fullname already taken',
          message: `Рейдовый босс с именем ${fullname} уже сушествует`,
        };
      }
    },
    isUniqueShortname: function(bosses, shortname) {
      if (
        bosses.findIndex(
          boss =>
            toLowerCaseAndReplaceSpaces(boss['shortname']) ===
            toLowerCaseAndReplaceSpaces(shortname)
        ) === -1
      ) {
        return bosses;
      } else {
        throw {
          name: 'Shortname already taken',
          message: `Рейдовый босс с коротким именем ${shortname} уже сушествует`,
        };
      }
    },
    isUniqueID: function(bosses, id) {
      if (bosses.findIndex(boss => boss['id'] === id) === -1) {
        return bosses;
      } else {
        throw {
          name: 'Raid Boss with specified ID already exists',
          message: `Рейдовый босс с идентификатором ${id} уже сушествует`,
        };
      }
    },
  });

  router.get('/rb/all', (req, res) => {
    try {
      const raidbosses = getAllRaidbosses(db);
      res.send(raidbosses);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  router.get('/rb/:id', (req, res) => {
    const id = req.params.id;
    const rb = findRaidbossByID(db, id);
    return res.send(rb);
  });

  router.post('/rb/create', (req, res) => {
    const boss = req.body;
    create(db, boss, res);
  });

  router.post('/rb/update', (req, res) => {
    const boss = req.body;
    update(db, boss, res);
  });

  router.post('/rb/remove', (req, res) => {
    const boss = req.body;
    remove(db, boss, res);
  });
});

/**
 * Получаем всех Рейдовых Боссов из БД
 * @param db                Объект доступа к БД
 * @return Array
 */
const getAllRaidbosses = db => {
  return db.get('raidbosses').value();
};

/**
 * Поиск Рейдового Босса в БД по ID
 * @param db                Объект доступа к БД
 * @param id                ID искомого РБ
 * @return Raidboss Object
 */
const findRaidbossByID = (db, id) => {
  const boss = db
    .get('raidbosses')
    .find({ id: id })
    .value();
  return boss;
};

/**
 * Поиск Рейдового Босса в БД по полному имени
 * @param db                Объект доступа к БД
 * @param fullname          Полное имя искомого РБ
 * @return Raidboss Object
 */
const findRaidbossByFullname = (db, fullname) => {
  const rb = db
    .get('raidbosses')
    .find(function(rb) {
      return toLowerCaseAndReplaceSpaces(rb.fullname) === toLowerCaseAndReplaceSpaces(fullname);
    })
    .value();

  return rb;
};

/**
 * Поиск Рейдового Босса в БД по полному имени
 * @param db                Объект доступа к БД
 * @param shortname         Короткое имя искомого РБ
 * @return Raidboss Object
 */
const findRaidbossByShortname = (db, shortname) => {
  const rb = db
    .get('raidbosses')
    .find(function(rb) {
      return toLowerCaseAndReplaceSpaces(rb.shortname) === toLowerCaseAndReplaceSpaces(shortname);
    })
    .value();

  return rb;
};

/**
 * Создаем нового Рейдового Босса
 * @param db                Объект доступа к БД
 * @param boss              Экземпляр создаваемого РБ
 * @param res               Объект ответа сервера
 * @return Promise          Промис с созданным РБ или ошибкой
 */
const create = (db, boss, res) => {
  db.get('raidbosses')
    .isUniqueID(boss.id)
    .isUniqueFullname(boss.fullname)
    .isUniqueShortname(boss.shortname)
    .push(boss)
    .write()
    .then(bosses => {
      res.send({
        message: `Рейдовый босс ${boss.fullname} успешно создан и добавлен в базу данных`,
        boss,
      });
    })
    .catch(e => res.status(500).send(e));
};

/**
 * Изменяем информацию о Рейдовом Боссе
 * @param db                Объект доступа к БД
 * @param boss              Экземпляр изменяемого РБ
 * @param res               Объект ответа сервера
 * @return Promise          Промис с измененным РБ или ошибкой
 */
const update = (db, boss, res) => {
  const isFullnamelUnique = findRaidbossByFullname(db, boss.fullname);
  if (isFullnamelUnique && isFullnamelUnique.id !== boss.id)
    throw {
      name: 'Fullname already taken',
      message: `РБ с полным именем ${boss.fullname} уже сушествует`,
    };

  const isShortnamelUnique = findRaidbossByShortname(db, boss.shortname);
  if (isShortnamelUnique && isShortnamelUnique.id !== boss.id)
    throw {
      name: 'Shortname already taken',
      message: `РБ с коротким именем ${boss.shortname} уже сушествует`,
    };

  db.get('raidbosses')
    .chain()
    .find({ id: boss.id })
    .assign(boss)
    .write()
    .then(boss => {
      res.send({ message: `Информация о РБ ${boss.fullname} изменена`, boss });
    })
    .catch(e => res.status(500).send(e));
};

/**
 * Удаляем информацию о Рейдовом Боссе
 * @param db                Объект доступа к БД
 * @param boss              Экземпляр изменяемого РБ
 * @param res               Объект ответа сервера
 * @return Promise
 */
const remove = (db, boss, res) => {
  const raidBossToDelete = findRaidbossByID(db, boss.id);

  if (!raidBossToDelete)
    throw {
      name: 'Raidboss not found',
      message: `РБ с заданным идентификатором не найден в базе данных`,
    };

  db.get('raidbosses')
    .remove({ id: boss.id })
    .write()
    .then(rb => {
      res.send({ message: `РБ ${boss.fullname} успешно удален` });
    })
    .catch(e => res.status(500).send(e));
};
module.exports = router;
