export default ({ app, store }, inject) => {
  inject('defineGMT', (time, isMsk) => {
    const isSetTimeToMoscow = isMsk ? isMsk : store.state.user.isSetTimeToMoscow;

    if (isSetTimeToMoscow === 'true') {
      return app.$moment.unix(time).utcOffset(3);
    } else {
      return app.$moment.unix(time).local();
    }
  });

  inject('todMessage', tod => {
    const todTime = app.$defineGMT(tod).format('D.MM.YYYY в HH:mm');
    const isSetTimeToMoscow = store.getters['user/isSetTimeToMoscow'];
    const response = isSetTimeToMoscow === 'true' ? `${todTime} по МСК (GMT +3)` : `${todTime}`;
    return response;
  });

  inject('respawnWindowMessage', (date1, date2) => {
    const isSetTimeToMoscow = store.getters['user/isSetTimeToMoscow'];
    //Проверяем две даты на совпадение дня, месяца и года
    const isSameDMY =
      app.$defineGMT(date1).format('DD.MM.YYYY') === app.$defineGMT(date2).format('DD.MM.YYYY');

    //Если выбран московский часовой пояс - сформируем сноску (показывается рядом с временным промежутком) об этом
    const msc = isSetTimeToMoscow === 'true' ? ' по МСК (GMT +3)' : '';

    // Формируем текст ответа. Если дата начала и конца временного промежутка находится в
    // пределах одного дня - ответ будет вида DD.MM.YYYY с HH::mm по HH::mm.
    // В противном случае - с DD.MM.YYYY, HH::mm по DD.MM.YYYY, HH::mm
    let response;
    if (date1 === date2) {
      response = `${app.$defineGMT(date1).format('DD.MM.YYYY ровно в HH:mm') + msc}`;
    } else if (!isSameDMY) {
      response = `с ${app.$defineGMT(date1).format('DD.MM.YYYY, HH:mm')} по ${app
        .$defineGMT(date2)
        .format('D.MM.YYYY, HH:mm') + msc}`;
    } else {
      response = `${app.$defineGMT(date1).format('DD.MM.YYYY')} c ${app
        .$defineGMT(date1)
        .format('HH:mm')} по ${app.$defineGMT(date2).format('HH:mm') + msc}`;
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
    let minutes = diff % 60;

    // Далее отнимаем от переменной diff полученные выше минуты.
    // Затем делим это на 60 и получаем остаток от деления на 24
    // (т.е. получим кол-во дней целым числом и кол-во целых часов после запятой, которое и запишем в переменную)
    let hours = ((diff - minutes) / 60) % 24;

    // Ну и наконец от переменной diff отнимаем полученное выше кол-во целых часов
    // (параллельно умножая их на 60, т.к. значение переменной diff в минутах) и кол-во минут.
    // И, наконец, делим все это на 1440 (кол-во минут в сутках) получая целое кол-во дней между событием b и a
    let days = (diff - hours * 60 - minutes) / 1440;

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

    //Переобпределим переменные прибавив к числовому значению словесное определение временного промежутка
    const minutesWithEnding = minutes !== 0 ? `${minutes} ${minuteEnding}` : ``;
    const hoursWithEnding = hours !== 0 ? `${hours} ${hourEnding}` : ``;
    const daysWithEnding = days !== 0 ? `${days} ${dayEnding}` : ``;

    let result;
    switch (true) {
      case diff > 1439: // Если разница дат сутки и более
        result = `${daysWithEnding} ${hoursWithEnding} ${minutesWithEnding}`;
        break;
      case diff > 59: //Если разница дат 1 час и более
        result = `${hoursWithEnding} ${minutesWithEnding}`;
        break;
      case diff === 0: // Если разница дат составляет менее минуты
        result = `меньше минуты`;
        break;
      case diff < 60: // Если разница дат меньше 60 минут
        result = `${minutesWithEnding}`;
        break;
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
