/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;

    if (element) {
      this.registerEvents();
    } else {
      throw new Error("Отсутствует элемент");
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const createButton = this.element.querySelector(".create-income-button");
    createButton.addEventListener("click", () => {
      App.getModal( 'newIncome' ).open();
    })
    const createExpense = this.element.querySelector(".create-expense-button");
    createExpense.addEventListener("click", () => {
      App.getModal( 'newExpense' ).open();
    })
    
  }
}
