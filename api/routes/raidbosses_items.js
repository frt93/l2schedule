const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const bosses_items = new FileAsync('db/bosses_items.json');

function goconsole() {
  low(bosses_items).then(db => {
    const ppp = db.get('bosses_items').value();
    console.log(ppp);
  });
}

function addRaidBossesItems(boss) {
  // Параметром rb получаем ID РБ
  // Параметром items получаем массив всех итемов, которые можно дропнуть с РБ
  // Переберем его и для каждого элемента записываем в переменную значения вида "boss:rb; item:item.id"
  let data = [];
  boss.drop.filter(item => {
    return data.push({ boss: boss.id, item: item.id });
  });

  //Затем для каждого предмета создадим запись в сводной таблице вида "ID РБ":"ID предмета"
  low(bosses_items).then(db => {
    data.forEach(function(item, data) {
      try {
        db.get('bosses_items')
          .push(item)
          .write();
      } catch (e) {
        throw Error('Возникла ошибка при добавлении данных в сводную таблицу');
      }
    });
  });
}

module.exports = { goconsole, addRaidBossesItems };
