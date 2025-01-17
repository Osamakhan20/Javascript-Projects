const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealInfoEl = document.getElementById("meal-info");
const mealPopup = document.getElementById("meal-popup");
const popupCloseBTn = document.getElementById("close-popup");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}

async function getMealBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const respData = await resp.json();
  const meals = respData.meals;
  return meals;
}
searchTerm.addEventListener('keyup', function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === 'Enter') {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      searchBtn.click();
  }
});

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
      
    
    <div class="meal-header">
    ${random ? `<span class="random">Random Recipe</span>` : ""}
        
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn "><i class="fas fa-heart"></i></button>
    </div>
`;

  const btn = meal.querySelector(".meal-body .fav-btn");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add("active");
    }

    // clean the meals container
    mealsEl.innerHTML = "";

    getRandomMeal();
    fetchFavMeals();
  });

  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  meals.appendChild(meal);
}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  favoriteContainer.innerHTML = "";
  const mealIds = getMealsLS();

  for (i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealFav(meal);
  }
  console.log(meals);
}

function addMealFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt = "${mealData.strMeal}"/>
    <span>${mealData.strMeal}</span>
    <button class ="clear"><i class = "fas fa-window-close"></i></button>
    
    `;

  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeMealLS(mealData.idMeal);

    // remove the meal from the DOM
    favoriteContainer.removeChild(favMeal);

    fetchFavMeals();
  });

  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
  });
  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = "";

  // update the meal info
  const mealEl = document.createElement("div");

  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />

    <p>
      ${mealData.strInstructions}
    </p>

    <h3>Ingredients:</h3>
        <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
        </ul>

       `;
  mealInfoEl.appendChild(mealEl);

  //show the popup
  mealPopup.classList.remove("hidden");
}
searchBtn.addEventListener("click", async () => {
  // clean container
  meals.innerHTML = "";
  const search = searchTerm.value;
  const mealsData = await getMealBySearch(search);

  if (mealsData) {
    mealsData.forEach((meal) => {
      addMeal(meal);
    });
  }
});

popupCloseBTn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
