import {
	Storage,
	budget
} from "./core.js";
import {
	HTML
} from "./core.js";

const html = new HTML();
const storage = new Storage();

// Variables
const budgetField = document.querySelector("#your-budget"),
	confirmBudgetBtn = document.querySelector("#confirm-budget"),
	resetBtn = document.querySelector("#reset-budget"),
	userBudgetSpan = document.querySelector("span#choosen-of-budget"),
	leftBudgetSpan = document.querySelector("span#rest-of-budget"),
	addExpenseBtn = document.querySelector("#add-to-budget"),
	spendingContanier = document.querySelector(".list-of-spending__container"),
	expenseName = document.querySelector("#spend-name"),
	expenseValue = document.querySelector("#spend-price"),
	expenseAmount = document.querySelector("#spend-amount");

let userBudget;

// Functions
function budgetModification() {
	if (isNaN(budgetField.value)) {
		html.borderBudgetField("#FF0033");
	} else if (budgetField.value == "") {
		html.borderBudgetField("#FF0033");
	} else {
		html.borderBudgetField("#c2c2c2");
		userBudget = parseFloat(budgetField.value);

		storage.createBudget(userBudget);
		storage.addBudgetToLocalStorage(userBudget, userBudget);

		html.insertBudget(budget.budget, budget.budget);

		budgetField.value = "";

		expenseName.disabled = false;
		expenseValue.disabled = false;
		expenseAmount.disabled = false;
		addExpenseBtn.disabled = false;
		resetBtn.disabled = false;
		budgetField.disabled = true;
		confirmBudgetBtn.disabled = true;
	}
}

// Listeners
addExpenseBtn.addEventListener("click", html.newExpense);
confirmBudgetBtn.addEventListener("click", budgetModification);
document.addEventListener("DOMContentLoaded", storage.totalStorageOnLoad);
resetBtn.addEventListener("click", html.resetBudget);
spendingContanier.addEventListener("click", html.removeExpense);

export {
	storage,
	html,
	userBudget,
	leftBudgetSpan,
	userBudgetSpan,
	budgetField,
	confirmBudgetBtn,
	addExpenseBtn,
	expenseName,
	expenseValue,
	expenseAmount,
	resetBtn,
	spendingContanier
};