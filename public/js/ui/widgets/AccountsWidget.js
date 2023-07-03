/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    if (element) {
      this.registerEvents();
      this.update();
    } else {
      throw new Error("отсутствует элемент виджета счетов");
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createButton = this.element.querySelector(".create-account");
    createButton.addEventListener("click", () => {
      const modal = App.getModal( 'createAccount' ).open();
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const current = User.current();
    if (current) {
      Account.list( current, ( err, response ) => {
        if (response.success) {
          this.clear();
          const list = response.data;
          list.forEach(item => {
            this.renderItem(item);
          });
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll(".account");
    accounts.forEach(account => {
      account.remove();
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const selectedAccount = this.element.querySelector(".account.active");
    if (selectedAccount) {
      selectedAccount.classList.remove("active");
    }

    element.classList.add("active");
    if (element.dataset.id) {
      App.showPage( 'transactions', { 
        account_id: element.dataset.id 
      });
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const widget = document.querySelector(".accounts-panel");
    const itemHTML = document.createElement("li");
    itemHTML.className = "account";
    itemHTML.setAttribute("data-id", item.id);

    const itemLink = document.createElement("a");
    itemLink.setAttribute("href", "#");

    const itemName = document.createElement("span");
    itemName.textContent = item.name + " / ";

    const itemSum = document.createElement("span");
    itemSum.textContent = item.sum + "₽";

    itemLink.append(itemName);
    itemLink.append(itemSum);
    itemHTML.append(itemLink);

    itemHTML.addEventListener("click", () => {
      itemLink.removeAttribute("href"); 
      this.onSelectAccount(itemHTML);
    })
    
    widget.append(itemHTML);
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    this.getAccountHTML(data);
  }
}
