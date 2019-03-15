const { Router } = require('express');
const router = Router();
const fs = require('fs');

router.get('/rb/getall', (req, res, next) => {
  const data = getAllRB();
  res.json(data);
});

router.post('/rb/add', (req, res, next) => {
  addRB(req.body, res);
});

router.get('/rb/:name', (req, res, next) => {
  const name = req.params.name;

  const bosses = getAllRB();
  const boss = bosses.filter(boss => {
    return boss.fullname === name;
  });
  res.json(boss);
});

router.post('/rb/:name/save', (req, res, next) => {
  const name = req.params.name;

  //Получаем массив со всеми РБ
  const bosses = getAllRB();

  //Сначала получаем объект с рб, которого хотим изменить
  let boss = bosses.filter(boss => {
    return boss.fullname === name;
  });

  //Затем удаляем его и получаем массив с оставшимися рб
  const keepedBosses = deleteRB(name);

  //Изменяем
  const editedBoss = req.body;

  //Добавляем к массиву keepedBosses измененный экземпляр нашего рб
  keepedBosses.push(editedBoss);
  //И сохраняем его
  saveRB(keepedBosses, editedBoss, res);
});

const getAllRB = () => {
  try {
    const dataBuffer = fs.readFileSync('api/db/rb.json');
    const dataString = dataBuffer.toString();
    const data = JSON.parse(dataString);
    return data;
  } catch (e) {
    return e;
  }
};

const addRB = async (newboss, res) => {
  const bosses = getAllRB();

  const duplicate = bosses.filter(boss => {
    return boss.name === newboss.name;
  });

  if (duplicate.length === 0) {
    bosses.push(newboss);
    return saveRB(bosses, newboss, res);
  } else {
    res.status(500).send('Рб с таким именем уже существует');
  }
};

const saveRB = (bosses, newboss, res) => {
  const dataJSON = JSON.stringify(bosses);
  try {
    fs.writeFileSync('api/db/rb.json', dataJSON);
    res.json(newboss);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const deleteRB = name => {
  const bosses = getAllRB();
  const BossToKeep = bosses.filter(boss => {
    return boss.fullname !== name;
  });
  return BossToKeep;
};
module.exports = router;
