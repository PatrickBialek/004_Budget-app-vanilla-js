import {
	Budget
} from "./budget.js";
import {
	storage,
	html,
	leftBudgetSpan,
	userBudgetSpan,
	budgetField,
	confirmBudgetBtn,
	expenseName,
	expenseValue,
	expenseAmount,
	addExpenseBtn,
	resetBtn,
	spendingContanier
} from "./app.js";

let budget;

class Storage {
	addExpenseToTheLocalStorage(name, price, amount, dateID) {
		let expenses = storage.getExpensesFromLocalStorage();
		const expense = {
			name: name,
			price: price,
			amount: amount,
			dateID: dateID
		};

		expenses.push(expense);
		localStorage.setItem("expenses", JSON.stringify(expenses));
	}

	addBudgetToLocalStorage(userBudget, budgetLeft) {
		let budget = storage.getBudgetFromStorage();
		budget.budget = userBudget;
		budget.budgetLeft = budgetLeft;

		localStorage.setItem("budget", JSON.stringify(budget));
	}

	createBudget(userBudget) {
		budget = new Budget(userBudget);
		return budget;
	}

	updateBudgetToLocalStorage(budgetLeft) {
		let budget = storage.getBudgetFromStorage();
		budget = JSON.parse(budget);
		budget.budgetLeft = budgetLeft;

		localStorage.setItem("budget", JSON.stringify(budget));
	}

	removeExpenseFromBudget(totalExpense) {
		let budget = storage.getBudgetFromStorage();
		budget = JSON.parse(budget);
		budget.budgetLeft = budget.budgetLeft + totalExpense;

		localStorage.setItem("budget", JSON.stringify(budget));
	}

	getExpensesFromLocalStorage() {
		let expenses;
		const expensesFromLocalStorage = localStorage.getItem("expenses");

		if (expensesFromLocalStorage === null) {
			expenses = [];
		} else {
			expenses = JSON.parse(expensesFromLocalStorage);
		}

		return expenses;
	}

	getBudgetFromStorage() {
		let budget;
		const budgetFromLocalStorage = localStorage.getItem("budget");

		if (budgetFromLocalStorage === null) {
			budget = {
				budget: "",
				budgetLeft: ""
			};
		} else {
			budget = budgetFromLocalStorage;
		}

		return budget;
	}

	removFromLocalStorage(dateID) {
		const expenses = storage.getExpensesFromLocalStorage();
		dateID = Number(dateID);
		const newArrayOfExpenses = expenses.filter(expense => expense.dateID !== dateID);
		localStorage.setItem("expenses", JSON.stringify(newArrayOfExpenses));
	}

	totalStorageOnLoad() {
		const budgetFromStorage = JSON.parse(storage.getBudgetFromStorage());
		const expenses = storage.getExpensesFromLocalStorage();
		const startingBudgetFromStorage = budgetFromStorage.budget;
		const leftBudgetFromStorage = budgetFromStorage.budgetLeft;

		html.insertBudget(startingBudgetFromStorage, leftBudgetFromStorage);
		html.changeColor(startingBudgetFromStorage, leftBudgetFromStorage);
		storage.createBudget(startingBudgetFromStorage);

		budget.updateBudgetLeft(leftBudgetFromStorage);

		if (budget.budget != "" || budget.budgetLeft != "") {
			budgetField.disabled = true;
			confirmBudgetBtn.disabled = true;
			expenseName.disabled = false;
			expenseValue.disabled = false;
			expenseAmount.disabled = false;
			addExpenseBtn.disabled = false;
			resetBtn.disabled = false;
		}

		expenses.forEach(expense => {
			html.createTable(expense.name, expense.price, expense.amount, expense.dateID);
		});
	}
}

class HTML {
	addExpenseToBudget(name, price, amount) {
		const dateID = Date.now();
		html.createTable(name, price, amount, dateID);
		storage.addExpenseToTheLocalStorage(name, price, amount, dateID);
	}

	borderBudgetField(color) {
		budgetField.style.borderColor = `${color}`;
	}

	changeColor(startingBudget, budgetLeftInPln) {
		if (startingBudget / 4 > budgetLeftInPln) {
			leftBudgetSpan.style.color = "#ff0033";
		} else if (startingBudget / 2 > budgetLeftInPln) {
			leftBudgetSpan.style.color = "#FFA500";
		} else {
			leftBudgetSpan.style.color = "#000";
		}
	}

	createTable(name, price, amount, dateID) {
		const expensesTable = document.querySelector("#spendings-table");
		const templateHTML = `
			<tr id="${dateID}">
				<td>${name}</td>
				<td data-price="${price}">${price} zł</td>
				<td data-amount="${amount}">${amount} sztuk</td>
				<td><img class="list-of-spending__remove-icon" src="images/rubbish-bin.svg" alt="Delete icon"></td>
			</tr>
		`;

		expensesTable.innerHTML += templateHTML;
	}

	insertBudget(budget, budgetLeft) {
		userBudgetSpan.innerHTML = `${budget} PLN`;
		leftBudgetSpan.innerHTML = `${budgetLeft} PLN`;
	}

	newExpense() {
		const inputs = document.querySelectorAll(".add-spending__content input[type=text]"),
			name = expenseName.value,
			price = expenseValue.value,
			amount = Number(expenseAmount.value);

		inputs.forEach(input => {
			if (input.value === "") {
				input.style.borderColor = "#FF0033";
			} else {
				input.style.borderColor = "#c2c2c2";
			}
		});

		if (name != "" && price != "" && isNaN(price) === false) {
			html.addExpenseToBudget(name, price, amount);
			html.updateBudgetAdd(price, amount);
		} else {
			expenseValue.style.borderColor = "#FF0033";
		}

		expenseName.value = "";
		expenseValue.value = "";
		expenseAmount.value = 1;
	}

	updateBudgetAdd(price, amount) {
		const totalCost = price * amount;
		const budgetLeft = budget.substractFromBudget(totalCost);

		leftBudgetSpan.innerHTML = `${budgetLeft} PLN`;
		const userBudget = Number(budget.budget);

		html.changeColor(userBudget, budgetLeft);
		storage.updateBudgetToLocalStorage(budgetLeft);
	}

	updateBudgetSub(totalExpense) {
		const budgetLeftInPln = budget.addToBudget(totalExpense);
		leftBudgetSpan.innerHTML = `${budgetLeftInPln} PLN`;
		const startingBudget = parseFloat(budget.budget);

		html.changeColor(startingBudget, budgetLeftInPln);
		storage.removeExpenseFromBudget(totalExpense);
	}

	removeExpense(e) {
		if (e.target.classList.contains("list-of-spending__remove-icon")) {
			const row = e.target.parentElement.parentElement,
				dateID = row.id,
				priceCell = document.querySelector("td[data-price]"),
				price = Number(priceCell.dataset.price),
				amountCell = document.querySelector("td[data-amount]"),
				amount = Number(amountCell.dataset.amount),
				totalExpense = price * amount;

			storage.removFromLocalStorage(dateID);
			html.updateBudgetSub(totalExpense);
			row.remove();
		}
	}

	resetBudget() {
		const defaultTable = `
			<table class="list-of-spending__spendings-table" id="spendings-table">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Remove</th>
        </tr>
      </table>
		`;

		userBudgetSpan.innerHTML = "";
		leftBudgetSpan.innerHTML = "";
		spendingContanier.innerHTML = defaultTable;

		localStorage.clear();

		expenseName.disabled = true;
		expenseValue.disabled = true;
		addExpenseBtn.disabled = true;
		resetBtn.disabled = true;
		confirmBudgetBtn.disabled = false;
		budgetField.disabled = false;
	}
}

export {
	Storage,
	HTML,
	budget
};