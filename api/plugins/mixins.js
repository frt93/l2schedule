/**
 * Форматируем строку для проверки на совпадение
 * @param value             Значение, которая надо отфарматировать
 * @return String
 */
const toLowerCaseAndReplaceSpaces = value => {
  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '');
};

module.exports = toLowerCaseAndReplaceSpaces;
