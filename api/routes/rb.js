const { Router } = require('express');
const router = Router();

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const bosses = new FileAsync('db/bosses.json');

low(bosses).then(db => {
  router.get('/rb/all', (req, res) => {
    try {
      const raidbosses = getAllRaidBosses(db);
      res.send(raidbosses);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  router.get('/rb/:id', (req, res) => {
    const id = req.params.id;
    getRaidBossById(db, id, res);
  });

  router.post('/rb/:id/update', (req, res) => {
    const id = req.params.id;
    const updatedRaidBoss = req.body;
    //Составляем массив с РБ без учета исправляемого
    const withoutUpdatedRaidBoss = getAllRaidBosses(db).filter(boss => {
      return boss.id !== id;
    });
    //Проверяем, чтобы РБ, который подвергся изменению не был переименован в уже существующего РБ
    checkFullnameDuplicate(withoutUpdatedRaidBoss, updatedRaidBoss.fullname);
    //Обновляем
    updateRaidBoss(db, id, updatedRaidBoss, res);
  });

  router.post('/rb/create', (req, res) => {
    const newRaidBoss = req.body;
    createRaidBoss(db, newRaidBoss, res);
  });

  router.post('/rb/:id/remove', (req, res) => {
    const id = req.params.id;
    removeRaidBoss(db, id, res);
  });
});

// Получаем всех рейдовых боссов
const getAllRaidBosses = db => {
  return db.get('raidbosses').value();
};

// Получаем конкретного рейдового босса по id
const getRaidBossById = (db, id, res) => {
  try {
    const rb = db
      .get('raidbosses')
      .find({ id: id })
      .value();
    res.send(rb);
  } catch (e) {
    res.status(500).send(e);
  }
};

// Изменяем информацию о конкретном рейдовом боссе по его id
const updateRaidBoss = (db, id, newdata, res) => {
  return db
    .get('raidbosses')
    .chain()
    .find({ id: id })
    .assign(newdata)
    .write()
    .then(boss => res.send(`Информация о ${boss.fullname} успешно изменена`))
    .catch(e => res.status(500).send(e));
};

// Создаем нового рейдового босса
const createRaidBoss = (db, newRaidBoss, res) => {
  const id = newRaidBoss.id;
  const fullname = newRaidBoss.fullname;
  const existingRaidBosses = getAllRaidBosses(db);
  //Исключаем создание РБ с уже существующим ID и полным именем
  checkIdDuplicate(existingRaidBosses, id);
  checkFullnameDuplicate(existingRaidBosses, fullname);

  db.get('raidbosses')
    .push(newRaidBoss)
    .write()
    .then(boss => {
      res.send(`Рейдовый босс ${newRaidBoss.fullname} успешно создан и добавлен в базу данных`);
    })
    .catch(e => res.status(500).send(e));
};

// Удаляем рейдового босса
const removeRaidBoss = (db, id, res) => {
  const raidBossToDelete = db.get('raidbosses').find({ id: id });
  //Проверяем существование РБ с заданным идентификатором в БД
  if (!raidBossToDelete.value())
    throw Error(`РБ с заданным идентификатором не найден в базе данных`);
  //Если РБ существует - удаляем
  db.get('raidbosses')
    .remove({ id: id })
    .write()
    .then(rb => {
      res.send(`РБ ${rb[0].fullname} успешно удален`);
    })
    .catch(e => res.status(500).send(e));
};

// Проверяем существование рейдового босса с указанным ID в переданном массиве
const checkIdDuplicate = (array, id) => {
  const idDuplicate = array.filter(i => {
    return i.id === id;
  });
  if (idDuplicate.length) throw Error('РБ с заданным идентификатором уже существует');
};

// Проверяем существование рейдового босса с указанным fullname в переданном массиве
const checkFullnameDuplicate = (array, fullname) => {
  const fullnameDuplicate = array.filter(i => {
    return i.fullname === fullname;
  });
  if (fullnameDuplicate.length) throw Error(`РБ с именем '${fullname}' уже существует`);
};
module.exports = router;
