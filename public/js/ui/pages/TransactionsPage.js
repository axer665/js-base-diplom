/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */

  constructor( element ) {
    this.element = element;
    this.accountId;
    if (element) {
      this.registerEvents();
    } else {
      throw new Error("отсутствует элемент");
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions)
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const remove = this.element.querySelector(".remove-account");
    remove.addEventListener("click", (e) => {
      this.removeAccount(remove.dataset.id);
    });

    this.element.addEventListener("click", (event) => {
      if (event.target.classList.contains("transaction__remove")) {
        this.removeTransaction(event.target.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      let remove = confirm("Вы уверены, что хотите удалить счет?");
      if (remove) {

        Account.remove({id: this.accountId}, (err, response) => {
          if (response.success) {
            App.updateWidgets(); 
            App.updateForms();
          }
        });

        this.clear();
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    let remove = confirm("Вы уверены, что хоите удалить транзакцию?");
    if (remove) {
      Transaction.remove({id: id}, (err, response) => {
        if (response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    this.clear();

    if (options) {
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        }
      });

      this.lastOptions = options;
      Transaction.list(options, (err, response) => {
        if (response.success) {
          this.accountId = options.account_id;
          response.data.forEach(item => {
            this.renderTransactions(item);
          });
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions()
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const contentTitle = document.querySelector(".content-title")
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const dateBefore = new Date(date).toLocaleString("ru-RU",{
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) 

    const timebefore = new Date(date).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    })

    return dateBefore + " в " + timebefore;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    
    const transactionContainer = this.element.querySelector(".content")
    const transaction = `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">

            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
    `;
    transactionContainer.innerHTML += transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
      if (data) {
        this.getTransactionHTML(data);
      } else {
        const transactionContainer = this.element.querySelector(".content");
        transactionContainer.textContent = "";
      }
    
  }
}