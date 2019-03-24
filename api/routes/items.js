const { Router } = require('express');
const router = Router();
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const items = new FileAsync('db/items.json');

low(items).then(db => {
  router.get('/items/all', (req, res) => {
    try {
      const items = getAllItems(db);
      res.send(items);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  router.get('/item/:id', (req, res) => {
    const id = req.params.id;
    getItemById(db, id, res);
  });

  router.post('/item/:id/update', (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    //Составляем массив с предметами без учета исправляемого
    const withoutUpdatedItem = getAllItems(db).filter(item => {
      return item.id !== id;
    });
    //Проверяем, чтобы предмет, который подвергся изменению не был переименован в уже существующий
    checkFullnameDuplicate(withoutUpdatedItem, updatedItem.fullname);
    //Обновляем
    updateItem(db, id, updatedItem, res);
  });

  router.post('/item/create', (req, res) => {
    const newItem = req.body;
    createItem(db, newItem, res);
  });

  router.post('/item/:id/remove', (req, res) => {
    const id = req.params.id;
    removeItem(db, id, res);
  });
});

// Получаем все итемы
const getAllItems = db => {
  return db.get('items').value();
};

// Получаем конкретный предмет по его id
const getItemById = (db, id, res) => {
  try {
    const item = db
      .get('items')
      .find({ id: id })
      .value();
    res.send(item);
  } catch (e) {
    res.status(500).send(e);
  }
};

// Изменяем информацию о конкретном предмете по его id
const updateItem = (db, id, newdata, res) => {
  return db
    .get('items')
    .chain()
    .find({ id: id })
    .assign(newdata)
    .write()
    .then(item => res.send(`Информация о ${item.fullname} успешно изменена`))
    .catch(e => res.status(500).send(e));
};

// Создаем новый предмет
const createItem = (db, newItem, res) => {
  const id = newItem.id;
  const fullname = newItem.fullname;
  const existingItems = getAllItems(db);
  //Исключаем создание предмета с уже существующим ID и именем
  checkIdDuplicate(existingItems, id);
  checkFullnameDuplicate(existingItems, fullname);

  db.get('items')
    .push(newItem)
    .write()
    .then(item => res.send(`Предмет ${newItem.fullname} успешно создан и добавлен в базу данных`))
    .catch(e => res.status(500).send(e));
};

// Удаляем предмет
const removeItem = (db, id, res) => {
  const ItemToDelete = db.get('items').find({ id: id });
  //Проверяем существование предмета с заданным идентификатором в БД
  if (!ItemToDelete.value())
    throw Error(`Предмет с заданным идентификатором не найден в базе данных`);
  //Если предмет существует - удаляем
  db.get('items')
    .remove({ id: id })
    .write()
    .then(item => {
      res.send(`Предмет ${item[0].fullname} успешно удален`);
    })
    .catch(e => res.status(500).send(e));
};

// Проверяем существование предмета с указанным ID в переданном массиве
const checkIdDuplicate = (array, id) => {
  const idDuplicate = array.filter(i => {
    return i.id === id;
  });
  if (idDuplicate.length) throw Error('Предмет с заданным идентификатором уже существует');
};

// Проверяем существование предмета с указанным fullname в переданном массиве
const checkFullnameDuplicate = (array, fullname) => {
  const fullnameDuplicate = array.filter(i => {
    return i.fullname === fullname;
  });
  if (fullnameDuplicate.length) throw Error(`Предмет с наименованием '${fullname}' уже существует`);
};
module.exports = router;
