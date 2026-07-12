/*
    Recipe Studio
    Vanilla JavaScript Application

    Features:
    - Async recipe loading
    - Search + category filtering
    - Recipe modal
    - Favorites using localStorage
    - Weekly meal planner
    - Shopping list generator
    - Cooking timer
    - Dark mode
    - Random recipe
    - Recently viewed
*/



// ===============================
// Mock Async Recipe Database
// ===============================


const recipeData = [

{
id:1,
name:"Berry Pancake",
category:"Breakfast",
time:20,
image:"https://images.unsplash.com/photo-1528207776546-365bb710ee93",
ingredients:[
"Flour",
"Milk",
"Eggs",
"Strawberries",
"Blueberries"
],
steps:[
"Mix flour, milk and eggs",
"Cook pancakes on pan",
"Add fresh berries"
]

},


{
id:2,
name:"Creamy Pasta",
category:"Lunch",
time:35,
image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
ingredients:[
"Pasta",
"Cheese",
"Milk",
"Garlic"
],
steps:[
"Boil pasta",
"Prepare creamy sauce",
"Mix everything together"
]

},


{
id:3,
name:"Garden Salad",
category:"Lunch",
time:15,
image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
ingredients:[
"Lettuce",
"Tomato",
"Cucumber",
"Olives"
],
steps:[
"Cut vegetables",
"Add dressing",
"Serve fresh"
]

},


{
id:4,
name:"Chocolate Cake",
category:"Dessert",
time:50,
image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587",
ingredients:[
"Cocoa",
"Flour",
"Sugar",
"Eggs"
],
steps:[
"Prepare batter",
"Bake cake",
"Decorate"
]

},


{
id:5,
name:"Veggie Burger",
category:"Dinner",
time:40,
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
ingredients:[
"Bun",
"Vegetable Patty",
"Lettuce",
"Cheese"
],
steps:[
"Prepare patty",
"Toast bun",
"Build burger"
]

}

];





// ===============================
// App State
// ===============================


let recipes=[];

let favorites =
JSON.parse(localStorage.getItem("favorites"))
|| [];


let mealPlan =
JSON.parse(localStorage.getItem("mealPlan"))
|| {};



let recent =
JSON.parse(localStorage.getItem("recent"))
|| [];



let currentRecipe=null;



let timer;

let seconds=0;





// ===============================
// Async Fetch Simulation
// ===============================


async function loadRecipes(){

try{


showLoader();


const response =
await new Promise(resolve=>{

setTimeout(()=>{

resolve(recipeData);

},1200);


});


recipes=response;


displayRecipes(recipes);

setupPlanner();


updateHero();


hideLoader();


}

catch(error){

console.log(error);

}


}





// ===============================
// Loader
// ===============================


function showLoader(){

document.getElementById("loader")
.style.display="flex";

}


function hideLoader(){

document.getElementById("loader")
.style.display="none";

}







// ===============================
// Display Recipes
// ===============================


function displayRecipes(data){


const grid=
document.getElementById("recipeGrid");


grid.innerHTML="";



data.map(recipe=>{


grid.innerHTML+=`


<div class="recipe-card">


<img src="${recipe.image}">


<h3>${recipe.name}</h3>


<p>
${recipe.category}
•
${recipe.time} min
</p>


<button onclick="openRecipe(${recipe.id})">
View
</button>


<button onclick="toggleFavorite(${recipe.id})">
❤️
</button>


</div>


`;


});


}







// ===============================
// Search
// ===============================


document
.getElementById("searchInput")
.addEventListener("input",(e)=>{


const value=
e.target.value.toLowerCase();



const filtered=
recipes.filter(recipe=>

recipe.name
.toLowerCase()
.includes(value)

);



displayRecipes(filtered);


});






// ===============================
// Category Filter
// ===============================


document
.querySelectorAll(".filter")
.forEach(button=>{


button.onclick=()=>{


document
.querySelectorAll(".filter")
.forEach(btn=>
btn.classList.remove("active")
);


button.classList.add("active");



const category=
button.dataset.category;



const result =
category==="All"
?
recipes
:
recipes.filter(r=>
r.category===category
);



displayRecipes(result);


};


});







// ===============================
// Recipe Modal
// ===============================


function openRecipe(id){


const recipe =
recipes.find(r=>r.id===id);



currentRecipe=recipe;



document
.getElementById("modalImage")
.src=recipe.image;



document
.getElementById("modalTitle")
.innerText=recipe.name;



document
.getElementById("modalTime")
.innerText=
`Cooking Time : ${recipe.time} minutes`;




document
.getElementById("ingredients")
.innerHTML=
recipe.ingredients
.map(i=>`<li>${i}</li>`)
.join("");



document
.getElementById("steps")
.innerHTML=
recipe.steps
.map(s=>`<li>${s}</li>`)
.join("");



document
.getElementById("recipeModal")
.classList.add("show");



addRecent(recipe);


}







document
.getElementById("closeModal")
.onclick=()=>{

document
.getElementById("recipeModal")
.classList.remove("show");

};







// ===============================
// Favorites
// ===============================


function toggleFavorite(id){


if(favorites.includes(id)){


favorites=
favorites.filter(item=>item!==id);


}

else{


favorites.push(id);


}


localStorage
.setItem(
"favorites",
JSON.stringify(favorites)
);


displayFavorites();

}



function displayFavorites(){


const box=
document.getElementById("favoriteGrid");


box.innerHTML="";



recipes
.filter(r=>favorites.includes(r.id))
.map(r=>{


box.innerHTML+=`

<div class="recipe-card">

<img src="${r.image}">

<h3>${r.name}</h3>

<button onclick="openRecipe(${r.id})">
View
</button>

</div>

`;

});


}








// ===============================
// Weekly Planner
// ===============================


function setupPlanner(){


document
.querySelectorAll("select")
.forEach(select=>{


select.innerHTML=
`
<option value="">
Choose Meal
</option>
`
+
recipes.map(r=>
`
<option value="${r.id}">
${r.name}
</option>
`
)
.join("");



select.value =
mealPlan[select.dataset.day] || "";



select.onchange=()=>{


mealPlan[
select.dataset.day
]=select.value;



localStorage.setItem(
"mealPlan",
JSON.stringify(mealPlan)
);


generateShoppingList();


};


});


}








// ===============================
// Shopping List using reduce()
// ===============================


function generateShoppingList(){


const ids=
Object.values(mealPlan);



const ingredients =
ids.map(id=>

recipes.find(r=>
r.id==id)

)
.filter(Boolean)
.reduce(
(acc,item)=>

[
...acc,
...item.ingredients
],

[]
);



const unique =
[...new Set(ingredients)];



document
.getElementById("shoppingList")
.innerHTML=
unique
.map(i=>
`
<li>☐ ${i}</li>
`
)
.join("");

}





// ===============================
// Random Recipe
// ===============================


document
.getElementById("randomRecipe")
.onclick=()=>{


const random =
recipes[
Math.floor(
Math.random()*recipes.length
)
];


openRecipe(random.id);


};







// ===============================
// Recently Viewed
// ===============================


function addRecent(recipe){


recent=
[
recipe,
...recent.filter(r=>r.id!==recipe.id)

].slice(0,5);



localStorage.setItem(
"recent",
JSON.stringify(recent)
);


displayRecent();


}



function displayRecent(){


document
.getElementById("recentRecipes")
.innerHTML=

recent.map(r=>`

<div class="recipe-card">

<img src="${r.image}">

<h4>${r.name}</h4>

</div>

`).join("");

}








// ===============================
// Timer
// ===============================


function updateTimer(){

let min=
Math.floor(seconds/60);

let sec=
seconds%60;



document
.getElementById("timerDisplay")
.innerText=

`${String(min).padStart(2,"0")}:
${String(sec).padStart(2,"0")}`;

}



document
.getElementById("startTimer")
.onclick=()=>{


clearInterval(timer);


timer=setInterval(()=>{


seconds++;

updateTimer();


},1000);


};



document
.getElementById("pauseTimer")
.onclick=()=>{

clearInterval(timer);

};



document
.getElementById("resetTimer")
.onclick=()=>{


clearInterval(timer);

seconds=0;

updateTimer();

};







// ===============================
// Share Recipe
// ===============================


document
.getElementById("shareBtn")
.onclick=async()=>{


if(navigator.share){


navigator.share({

title:currentRecipe.name,

text:"Check this recipe!",

url:location.href

});


}

else{


navigator.clipboard.writeText(location.href);


alert("Recipe link copied!");

}


};








// ===============================
// Theme Toggle
// ===============================


const theme =
localStorage.getItem("theme");



if(theme==="dark")
document.body.classList.add("dark");




document
.getElementById("themeToggle")
.onclick=()=>{


document
.body.classList.toggle("dark");


localStorage.setItem(

"theme",

document.body.classList.contains("dark")
?
"dark"
:
"light"

);


};







// ===============================
// Hero Update
// ===============================


function updateHero(){


const recipe=recipes[3];


document
.getElementById("heroImage")
.src=recipe.image;


document
.getElementById("heroTitle")
.innerText=recipe.name;


document
.getElementById("heroCategory")
.innerText=recipe.category;


document
.getElementById("openHeroRecipe")
.onclick=()=>openRecipe(recipe.id);


}







// Initial Load

loadRecipes();

displayFavorites();

displayRecent();