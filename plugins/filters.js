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
};
