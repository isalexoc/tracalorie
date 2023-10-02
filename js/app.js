class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesConsumed();
    this._displayCalorieLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById("limit").placeholder = this._calorieLimit;
  }

  // Public methods/API

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.resetStorage();
    this._render();
  }

  setLimit(value) {
    this._calorieLimit = value;
    Storage.setCalorieLimit(value);
    this._displayCalorieLimit();
    this._render();
  }

  displayItemsFromStorage() {
    if (localStorage.getItem("meals") !== -1) {
      const meals = JSON.parse(localStorage.getItem("meals"));
      if (meals) {
        meals.forEach((meal) => this._displayNewMeal(meal));
      }
    }
    if (localStorage.getItem("workouts") !== -1) {
      const workouts = JSON.parse(localStorage.getItem("workouts"));
      if (workouts) {
        workouts.forEach((workout) => this._displayNewWorkout(workout));
      }
    }
  }

  // Private Methods

  _displayCaloriesConsumed() {
    const caloriesCosumedEl = document.getElementById("calories-consumed");
    const caloriesConsumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesCosumedEl.innerText = caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    const caloriesBurned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerText = caloriesBurned;
  }

  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const total = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = total;

    if (total <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
    }
  }

  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById("calories-limit");
    calorieLimitEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesProgress() {
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    const progressBarEl = document.getElementById("calorie-progress");
    progressBarEl.style.width = `${width}%`;
    if (this._totalCalories >= this._calorieLimit) {
      progressBarEl.classList.remove("bg-success");
      progressBarEl.classList.add("bg-danger");
    } else {
      progressBarEl.classList.remove("bg-danger");
      progressBarEl.classList.add("bg-success");
    }
  }

  _displayNewMeal(meal) {
    const mealItemEl = document.createElement("div");
    mealItemEl.classList.add("card", "my-2");
    mealItemEl.setAttribute("data-id", meal.id);
    mealItemEl.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;
    document.getElementById("meal-items").appendChild(mealItemEl);
  }

  _displayNewWorkout(workout) {
    const workoutItemEl = document.createElement("div");
    workoutItemEl.classList.add("card", "my-2");
    workoutItemEl.setAttribute("data-id", workout.id);
    workoutItemEl.innerHTML = `
    <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                ${workout.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>
    `;
    document.getElementById("workout-items").appendChild(workoutItemEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 1800) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(limit) {
    localStorage.setItem("calorieLimit", limit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static resetStorage() {
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
    localStorage.removeItem("totalCalories");
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this.activateListeners();
    this._tracker.displayItemsFromStorage();
  }

  activateListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    //Validate Inputs

    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const item = new Meal(name.value, +calories.value);
      this._tracker.addMeal(item);
    } else {
      const item = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(item);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    bootstrap.Collapse.getInstance(collapseItem).hide();
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      const id = e.target.closest(".card").getAttribute("data-id");
      type === "meal"
        ? this._tracker.removeMeal(id)
        : this._tracker.removeWorkout(id);

      e.target.closest(".card").remove();
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((card) => {
      const name =
        card.firstElementChild.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();
    const newLimit = document.getElementById("limit");
    if (newLimit.value === "") {
      alert("Please add a limit");
    }
    this._tracker.setLimit(+newLimit.value);
    newLimit.placeholder = newLimit.value;
    newLimit.value = "";

    const modalEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
