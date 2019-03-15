export default ({ app }, inject) => {
  inject('defineGMT', (time, isSetTimeToMoscow) => {
    if (isSetTimeToMoscow) {
      return app.$moment(time).utcOffset(3);
    } else {
      return app.$moment(time).local();
    }
  });
  inject('composeTimeRangeFormat', (date1, date2, isMsc) => {
    //Проверяем две даты на совпадение дня, месяца и года
    const isSameDMY =
      app.$defineGMT(date1, isMsc).format('DD.MM.YYYY') ===
      app.$defineGMT(date2, isMsc).format('DD.MM.YYYY');

    //Если выбран московский часовой пояс - сформируем сноску (показывается рядом с временным промежутком) об этом
    let msc;
    if (isMsc) {
      msc = ' по МСК (GMT +3)';
    } else {
      msc = '';
    }

    // Формируем текст ответа. Если дата начала и конца временного промежутка находится в
    // пределах одного дня - ответ будет вида DD.MM.YYYY с HH::mm по HH::mm.
    // В противном случае - с DD.MM.YYYY, HH::mm по DD.MM.YYYY, HH::mm
    let response;
    if (!isSameDMY) {
      response = `с ${app.$defineGMT(date1, isMsc).format('DD.MM.YYYY, HH:mm')} по ${app
        .$defineGMT(date2, isMsc)
        .format('D.MM.YYYY, HH:mm') + msc}`;
    } else {
      response = `${app.$defineGMT(date1, isMsc).format('DD.MM.YYYY')} c ${app
        .$defineGMT(date1, isMsc)
        .format('HH:mm')} по ${app.$defineGMT(date2, isMsc).format('HH:mm') + msc}`;
    }
    return response;
  });
};
