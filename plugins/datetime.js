export default ({ app }, inject) => {
  inject('defineGMT', (time, isSetTimeToMoscow) => {
    if (isSetTimeToMoscow) {
      return app.$moment.unix(time).utcOffset(3);
    } else {
      return app.$moment.unix(time).local();
    }
  });

  inject('timeRange', (date1, date2, isMsc) => {
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
    if (date1 === date2) {
      response = `${app.$defineGMT(date1, isMsc).format('DD.MM.YYYY ровно в HH:mm') + msc}`;
    } else if (!isSameDMY) {
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

  inject('timeleftToRespawn', (s, e) => {
    if (s === null || e === null) return `Информация о респе отсутствует`;
    // Определяем текущий момент времени и переводим дату начала и конца респа из unix формата
    const now = app.$moment();
    const start = app.$moment.unix(s);
    const end = app.$moment.unix(e);
    // Получаем разницу во времени между текущим временем и нужным событием.
    // Результат приводим в положительное число и переводим в минуты
    let diff;
    if (now > start) {
      // Если респ пошел - выясняем сколько осталось до его конца
      diff = Math.abs(now.diff(end, 'minutes'));
    } else if (now < start) {
      // Респ еще не начался. Выясняем сколько осталось
      diff = Math.abs(now.diff(start, 'minutes'));
    }

    // Определим кол-во минут, получив остаток от деления переменной diff на 60
    // (в результате целое число будет кол-вом часов, а значение после запятой - кол-вом минут, которое и запишется в переменную)
    const minutes = diff % 60;

    // Далее отнимаем от переменной diff полученные выше минуты.
    // Затем делим это на 60 и получаем остаток от деления на 24
    // (т.е. получим кол-во дней целым числом и кол-во целых часов после запятой, которое и запишем в переменную)
    const hours = ((diff - minutes) / 60) % 24;

    // Ну и наконец от переменной diff отнимаем полученное выше кол-во целых часов
    // (параллельно умножая их на 60, т.к. значение переменной diff в минутах) и кол-во минут.
    // И, наконец, делим все это на 1440 (кол-во минут в сутках) получая целое кол-во дней между событием b и a
    const days = (diff - hours * 60 - minutes) / 1440;

    let minutesEndings;
    if (now < end) minutesEndings = ['минута', 'минуты', 'минут'];
    else if (now > end) minutesEndings = ['минуту', 'минуты', 'минут'];
    const hoursEndings = ['час', 'часа', 'часов']; // Варианты возможных склонений слов
    const daysEndings = ['день', 'дня', 'дней']; // в зависимости от значений дней/часов/минут

    const cases = [2, 0, 1, 1, 1, 2]; //

    const minuteEnding =
      minutesEndings[
        minutes % 100 > 4 && minutes % 100 < 20 ? 2 : cases[minutes % 10 < 5 ? minutes % 10 : 5]
      ];

    const hourEnding =
      hoursEndings[
        hours % 100 > 4 && hours % 100 < 20 ? 2 : cases[hours % 10 < 5 ? hours % 10 : 5]
      ];

    const dayEnding =
      daysEndings[days % 100 > 4 && days % 100 < 20 ? 2 : cases[days % 10 < 5 ? days % 10 : 5]];

    let result;
    if (diff > 1439) {
      result = `${days} ${dayEnding} ${hours} ${hourEnding} ${minutes} ${minuteEnding}`;
    } else if (diff > 59) {
      result = `${hours} ${hourEnding} ${minutes} ${minuteEnding}`;
    } else if (diff === 0) {
      if (now < end) result = `меньше минуты`; // До конца респа меньше минуты
    } else {
      result = `${minutes} ${minuteEnding}`;
    }
    let response;
    if (now > start && now < end) {
      response = `До макс. респа ${result}`;
    } else if (now > end) {
      response =
        minutes === 0 && hours === 0 && days === 0
          ? `Респ закончился только что`
          : `Респ закончился ${result} назад`;
    } else if (now < start) {
      response = `До начала респа ${result}`;
    }
    return response;
  });
};
