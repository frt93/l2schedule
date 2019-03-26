export default ({ app }, inject) => {
  inject('getFulldrop', items => {
    return items.filter(item => {
      return item.type === 'weapon' || item.type === 'armor' || item.type === 'jewelry';
    });
  });

  inject('getPiecesAndConsumables', items => {
    return items.filter(item => {
      return item.type === 'pieces' || item.type === 'сonsumables';
    });
  });

  inject('getSoulCrystals', items => {
    return items.filter(item => {
      return item.type === 'sa';
    });
  });

  inject('filterByFullAndShortNames', (items, value) => {
    return items.filter(item => {
      return (
        item.fullname
          .toString()
          .toLowerCase()
          .indexOf(value.toLowerCase()) >= 0 ||
        item.shortname
          .toString()
          .toLowerCase()
          .indexOf(value.toLowerCase()) >= 0
      );
    });
  });

  inject('filterByFullname', (items, value) => {
    return items.filter(item => {
      return (
        item.fullname
          .toString()
          .toLowerCase()
          .indexOf(value.toLowerCase()) >= 0
      );
    });
  });

  inject('sortByFullname', array => {
    let byName = array.slice(0);
    return byName.sort(function(a, b) {
      var x = a.fullname.toLowerCase();
      var y = b.fullname.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  });

  inject('sortByMaxResp', array => {
    const now = app.$moment().unix();

    // Отберем рб, у которых в данный момент идет окно респа
    const inWindow = array.filter(rb => {
      return now > rb.respawn_start && rb.respawn_end > now;
    });
    // Теперь отсортируем. Первыми в списке будут те, у которых макс. респ заканчивается раньше
    inWindow.slice(0);
    inWindow.sort(function(a, b) {
      var x = a.respawn_end;
      var y = b.respawn_end;
      return x - y;
    });
    // Отберем рб, которые сейчас находятся в респе (окно респа еще не началось)
    const inResp = array.filter(rb => {
      return rb.respawn_start > now;
    });
    // Сортируем. Первыми в списке будут те, у которых окно респа начинается раньше
    inResp.slice(0);
    inResp.sort(function(a, b) {
      var x = a.respawn_end;
      var y = b.respawn_end;
      return x - y;
    });
    // Отберем рб у которых прошел макс респ или информация о респе отсутствует в приницпе
    const lostResp = array.filter(rb => {
      return now > rb.respawn_end;
    });
    // Сортируем. Первыми в списке будут те, у которых макс. респ закончился позже (чем раньше закончился макс. респ - тем дальше в списке)
    lostResp.slice(0);
    lostResp.sort(function(a, b) {
      var x = a.respawn_end;
      var y = b.respawn_end;
      return y - x;
    });
    // Соберем все в один массив
    let all = [];
    inWindow.forEach(rb => {
      return all.push(rb);
    });
    inResp.forEach(rb => {
      return all.push(rb);
    });
    lostResp.forEach(rb => {
      return all.push(rb);
    });
    return { all, inWindow, inResp, lostResp };
  });
};
