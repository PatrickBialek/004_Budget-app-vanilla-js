export { Budget };

class Budget {
	constructor(budget) {
		this.budget = budget;
		this.budgetLeft = this.budget;
	}

	substractFromBudget(amount) {
		return (this.budgetLeft -= amount);
	}

	addToBudget(amount) {
		return (this.budgetLeft += amount);
	}

	updateBudgetLeft(amount) {
		return (this.budgetLeft = amount);
	}
}
