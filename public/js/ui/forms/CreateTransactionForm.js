/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const current = User.current();
    Account.list(current, (err, response) => {
      const select = this.element.querySelector(".accounts-select");

      select.innerHTML = response.data.reduce((accumulator, current) => {
        accumulator += `<option value="${current.id}"> ${current.name} </option>`;
        return accumulator;
      }, "");
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      console.log(response);
      console.log(data)
      if (response.success) {
        App.getModal( 'newIncome' ).close();
        App.getModal( 'newExpense' ).close();
        const selectIncome = this.element.querySelector("#income-accounts-list");
        const selectExpense = this.element.querySelector("#expense-accounts-list");
        
        if (selectIncome){
          selectIncome.textContent = "";
        }
        if (selectExpense) {
          selectExpense.textContent = "";
        }

        App.update();
      }
    });

    this.element.reset();
  }
}