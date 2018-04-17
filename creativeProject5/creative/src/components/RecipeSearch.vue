<template>


<div id="recipeApp">
  <div id="background" v-bind:style="{ 'background-image': 'url(' + source + ')' }">
    <div id="main" >

    <center>

      <h1>Food for Thought</h1>
      <p>We might have access to hundreds upon thousands of recipes today because of our friend google, but sometimes too much information is worse than no information at all. Use our database to not only search for recipes, but also sort those recipes to always get the best of the best for your health.</p>
    </center>


    <br>

    <div class="container">
      <form class="col">
        <center>
        <b><h3>Diet:</h3></b>
      </center>

        <ul>
          <li>
            <input v-model="dietRadio" type="radio" id="balanced" value="balanced" checked>
            <label for="balanced" title="Protein/Fat/Carb values in 15/35/50 ratio">Balanced</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="dietRadio" type="radio" id="high-protein" value="high-protein">
            <label for="high-protein" title="More than 50% of total calories from proteins">High-protein</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="dietRadio" type="radio" id="low-fat" value="low-fat">
            <label for="low-fat" title="Less than 15% of total calories from fat">Low-fat</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="dietRadio" type="radio" id="low-carb" value="low-carb">
            <label for="low-carb" title="Less than 20% of total calories from carbs">Low-carb</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="dietRadio" type="radio" id="noneDiet" value="">
            <label for="noneDiet">None</label>
            <div class="check"></div>
          </li>
      </ul>
      </form>


      <form class="col">
        <center>
        <b><h3>Health:</h3></b>
      </center>
        <ul>
          <li>
            <input v-model="healthRadio" type="radio" id="alcohol-free" value="alcohol-free" checked>
            <label for="alcohol-free" title="No alcohol used or contained">Alcohol-free</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="healthRadio" type="radio" id="peanut-free" value="peanut-free">
            <label for="peanut-free" title="No peanuts or products containing peanuts">Peanut-free</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="healthRadio" type="radio" id="sugar-conscious" value="sugar-conscious">
            <label for="sugar-conscious" title="Less than 4g of sugar per serving">Sugar-conscious</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="healthRadio" type="radio" id="vegan" value="vegan">
            <label for="vegan" title="No meat, poultry, fish, dairy, eggs or honey">Vegan</label>
            <div class="check"></div>
          </li>
          <li>
            <input v-model="healthRadio" type="radio" id="noneHealth" value="">
            <label for="noneHealth">None</label>
            <div class="check"></div>
          </li>
        </ul>

      </form>
    </div>

      <br>
      <br>

      <center>

        <form v-on:submit.prevent="submitSearch" id="submitArea">
          <b><label>Search for Recipes</label></b>
          <input v-model="value" id="foodInput" type="text"></input>
          <br>
          <br>
          <button  class="coolButton">Submit</button>
        </form>
        <!-- <form v-on:submit.prevent="randomSearch" id="submitArea">
          <button  class="coolButton">Random</button>
        </form> -->
        <form v-on:submit.prevent="showFavorites" id="submitArea">
          <button  class="coolButton">Favorites</button>
        </form>

      </center>

      <br>
      <center v-if="items == 0 && favorite">
        <h2>No Favorite Recipes Chosen</h2>
      </center>

      <center v-if="items > 0 && favorite">
        <h2>Favorites: </h2>
      </center>

      <center v-if="count > 0 && favorite == false">
        <hr>
        <h2 v-if="value !== ''">Search: {{value}}</h2>
        <h2 v-if="choice !== ''">Search: {{choice}}</h2>
        <h2>Number of recipes: {{count}}</h2>
      </center>

      <center>
      <div v-for="result in items">
      	  <hr>

          <h3>{{result.label}}</h3>
          <img :src=result.image>
          <br>
          <a :href=result.url><b>Link to recipe</b></a>
          <p><b>Calories</b>: {{result.calories}}</p>
          <p><b>Servings</b>: {{result.servings}}</p>
          <p><b>Calories per Serving</b>: {{result.cps}}</p>

          <p><b>Ingredients</b>:</p>
          <p>
          <div v-for="ing in result.ingredients">
            {{ing.text}}
          </div>
          </p>

          <p><b>Cautions</b>:</p>
          <p>
          <div v-for="cau in result.cautions">
            {{cau}}
          </div>
          </p>

          <form v-on:submit.prevent="chooseFavorite(result.id)" id="submitArea">
            <button  v-if="!favorite" class="coolButton">Add To Favorites</button>
          </form>

	    </div>
      </center>

    <center>
      <div id="foodDisplay">
      </div>
    </center>


    <center>
      <button v-if="items.length > 0 && !favorite" v-on:click="choosePrev"  type="button" id="PrevButton" class="coolButton">Previous</button>
      <button v-if="items.length > 0 && !favorite" v-on:click="chooseNext"  type="button" id="NextButton" class="coolButton">Next</button>
    </center>

    <br>

    <footer>
      <center><a href="https://github.com/edenknudson/creativeProject5">Visit my Github</a></center>
    </footer>
    </div>
  </div>
</div>


</template>


 <script>

import axios from 'axios';

export default {
  name: 'recipeApp',
  data () {
    return{
      healthRadio: "alcohol-free",
      dietRadio: "balanced",
      value: "",
      word: {},
      choice: "",
      first: 0,
      last: 10,
      count: 0,
      submit:true,
      source: "",
      favorite: false,
    }
  },
  created: function() {
    this.getItems();
    this.getFoodValue();
    this.getFavorites();
    console.log("items: " + this.items);
    console.log("food value: " + this.foodValue);



  },
  computed:{
    items: function() {
      if(this.favorite){
        return this.$store.getters.items;
      }else{
        return this.$store.getters.favorites;
      }

    },
    foodValue: function(){
    //  console.log("food value computed: " + foodValue);
      return this.$store.getters.foodValue;
    },
  },
  methods:{
    getFavorites: function(){
      this.$store.dispatch('getFavorites');

      // axios.get("/api/favorite").then(response => {
      //   this.favorite = response.data;
      //   if(this.favorite){
      //     this.showFavorites();
      //   }
    	//    return true;
      //     }).catch(err => {
      //     });
    },
    setFavorite: function(bool){
      this.favorite = bool;
      // axios.post("/api/favorite", {
      // show: bool,
      //     }).then(response => {
      // return true;
      //     }).catch(err => {
      //     });
    },
    showFavorites: function(){
      // this.setFavorite(true);
      // this.deleteItems();
      // this.getFoodValue();
      // axios.get("/api/favorites").then(response => {
      //   this.results = response.data;
      //   this.source = this.results[0].image;
    	//    return true;
      //     }).catch(err => {
      //     });
    },
    chooseFavorite: function(itemId){
      this.$store.dispatch('addFavorite',{
        itemId: this.itemId,
      });
      // axios.put("/api/items/" + id, {
      //     }).then(response => {
      //       alert("Added to Favorites");
    	//        return true;
      //     }).catch(err => {
      //     });
    },
    deleteItems: function(item) {
      this.$store.dispatch('deleteItems');
      // axios.delete("/api/items").then(response => {
    	// return true;
      //     }).catch(err => {
      //     });
    },
    getItems: function() {
      this.$store.dispatch('getFavorites');

      // axios.get("/api/items").then(response => {
    	// this.results = response.data;
      // this.source = this.results[0].image;
      // return true;
      // }).catch(err => {
      // });
    },
    getFoodValue: function() {
      this.$store.dispatch('getFoodValue');
      // axios.get("/api/value").then(response => {
      //   this.word = response.data;
      //   this.choice = this.word.choice;
      //   this.first = this.word.first;
      //   this.last = this.word.last;
      //   this.healthRadio = this.word.health;
      //   this.dietRadio = this.word.diet;
      //   this.count = this.word.count;
      //
    	// return true;
      //     }).catch(err => {
      //     });

    },
    chooseNext: function(){
      this.getFoodValue();
      this.deleteItems();

      let first = this.foodValue.first + 10;
      let last = this.foodValue.last + 10;

      this.$store.dispatch('changeFoodValue',{
        word: value,
        first: first,
        last: last,
        health: healthRadio,
        diet: dietRadio,
        count: word.count
      }).then(foodValue => {
        //this.text = "";
      });

    //  console.log(this.choice);

      this.getFoodValue();


      if(this.foodValue.health == "" && this.foodValue.diet == ""){
        this.searchNone(this.foodValue.word, this.first, this.last);
      }else if(this.foodValue.health == ""){
        this.searchDiet(this.foodValue.word, this.foodValue.diet, this.first, this.last);
      }else if(this.foodValue.diet == ""){
        this.searchHealth(this.foodValue.word, this.foodValue.health, this.first, this.last);
      }else {
        this.searchAll(this.foodValue.word, this.foodValue.diet, this.foodValue.health, this.first, this.last);
      }

      //searchForThis(this.foodValue.word, this.foodValue.diet, this.foodValue.health, this.first, this.last);

    },
    choosePrev: function(){
      if(this.foodValue.first > 0){


      this.deleteItems();
      this.getFoodValue();

      let first = this.foodValue.first - 10;
      let last = this.foodValue.last - 10;

      this.$store.dispatch('changeFoodValue',{
        choice: this.foodValue.choice,
        first: first,
        last: last,
        health: this.foodValue.health,
        diet: this.foodValue.diet,
        count: this.foodValue.count
      }).then(foodValue => {
        //this.text = "";
      });

      // axios.post("/api/value", {
      // choice: this.choice,
      // first: this.first,
      // last: this.last,
      // health: this.healthRadio,
      // diet: this.dietRadio,
      // count: this.count
      //     }).then(response => {
      // return true;
      //     }).catch(err => {
      //     });

    //  this.getFoodValue();


        if(this.foodValue.health == "" && this.foodValue.diet == ""){
          this.searchNone(this.foodValue.word, this.first, this.last);
        }else if(this.foodValue.health == ""){
          this.searchDiet(this.foodValue.word, this.foodValue.diet, this.first, this.last);
        }else if(this.foodValue.diet == ""){
          this.searchHealth(this.foodValue.word, this.foodValue.health, this.first, this.last);
        }else {
          this.searchAll(this.foodValue.word, this.foodValue.diet, this.foodValue.health, this.first, this.last);
        }

        //searchForThis(this.foodValue.word, this.foodValue.diet, this.foodValue.health, this.first, this.last);
      }
    },
    // randomSearch: function(){
    //   this.setFavorite(false);
    //   axios.get("/api/random").then(response => {
    // 	var randomFood = response.data;
    //   this.value = "";
    //   this.value = randomFood;
    //   this.submitSearch();
    //   return true;
    //   }).catch(err => {
    //   });
    // },
    submitSearch: function(){
      if(this.foodValue.word !== ""){
      this.setFavorite(false);
      this.deleteItems();
      // this.first = 0;
      // this.last = 10;
      // this.results = {};
      // this.count = 0;
      // this.choice = this.value;

      this.$store.dispatch('changeFoodValue',{
        word: this.foodValue.choice,
        first: 0,
        last: 10,
        health: this.foodValue.health,
        diet: this.foodValue.diet,
        count: 0
      }).then(foodValue => {
        //this.text = "";
      });

        if(this.foodValue.health == "" && this.foodValue.diet == ""){
          this.searchNone(this.foodValue.word, this.first, this.last);
        }else if(this.foodValue.health == ""){
          this.searchDiet(this.foodValue.word, this.foodValue.diet, this.first, this.last);
        }else if(this.foodValue.diet == ""){
          this.searchHealth(this.foodValue.word, this.foodValue.health, this.first, this.last);
        }else {
          this.searchAll(this.foodValue.word, this.foodValue.diet, this.foodValue.health, this.first, this.last);
        }
      }else{
        alert("Input a search word");
      }

    },
    searchNone: function(value, first, last){
      $.ajax({

        type: "GET",
        data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", from: first, to: last},
        dataType: 'json',
        url: "https://api.edamam.com/search",
          //url : myurl,
          //dataType : "json",
          success : function(json) {
            console.log(json);
            this.publishIt(json);
          }
      });
    },
    searchDiet: function(value, diet, first, last){
      $.ajax({

        type: "GET",
        data: { q:value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", diet:diet, from: first, to:last},
        dataType: 'json',
        url: "https://api.edamam.com/search",
          //url : myurl,
          //dataType : "json",
          success : function(json) {
            this.publishIt(json);
          }
      });
    },
    searchHealth: function(value, health, first, last){
      $.ajax({

        type: "GET",
        data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", health:health, from: first, to: last},
        dataType: 'json',
        url: "https://api.edamam.com/search",
          //url : myurl,
          //dataType : "json",
          success : function(json) {
            this.publishIt(json);
          }
      });
    },
    searchAll: function(value, diet, health, first, last){

      $.ajax({

        type: "GET",
        data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", diet: diet, health: health, from: first, to: last},
        dataType: 'json',
        url: "https://api.edamam.com/search",
          //url : myurl,
          //dataType : "json",
          success : function(json) {
            this.publishIt(json);
          }
      });
    },
    publishIt: function(json){
      console.log("got to publish");
      this.count = json.count;
      if(json.count == 0){
        alert("No Recipes Found")
      }
      for(i=0;i<json.hits.length;i++){
        var number = this.first + i + 1;
        var ingredients = {};
        if(json.hits[i].recipe.ingredients.length == 0){
          ingredients[0] = ({text: "None Listed"});
        }
        for(j=0;j<json.hits[i].recipe.ingredients.length;j++){
          ingredients[j] = ({text: json.hits[i].recipe.ingredients[j].text});
        }
        var cautions = {};
        if(json.hits[i].recipe.cautions.length == 0){
          cautions[0] = ("None Listed");
        }
        for(j=0;j<json.hits[i].recipe.cautions.length;j++){
          cautions[j] = (json.hits[i].recipe.cautions[j]);
        }
        this.$store.dispatch('addItem',{
          label: json.hits[i].recipe.label,
          image: json.hits[i].recipe.image,
          url: json.hits[i].recipe.url,
          cps: Math.round(json.hits[i].recipe.calories / json.hits[i].recipe.yield),
          calories: Math.round(json.hits[i].recipe.calories),
          servings: json.hits[i].recipe.yield,
          ingredients: ingredients,
          cautions: cautions
        }).then(foodValue => {
          //this.text = "";
        });
        axios.post("/api/items", {
      	num: number,
      	label: json.hits[i].recipe.label,
        image: json.hits[i].recipe.image,
        url: json.hits[i].recipe.url,
        cps: Math.round(json.hits[i].recipe.calories / json.hits[i].recipe.yield),
        calories: Math.round(json.hits[i].recipe.calories),
        servings: json.hits[i].recipe.yield,
        ingredients: ingredients,
        cautions: cautions
            }).then(response => {
      	this.getItems();
      	return true;
            }).catch(err => {
            });

      }
      // axios.post("/api/value", {
      // choice: this.choice,
      // first: this.first,
      // last: this.last,
      // health: this.healthRadio,
      // diet: this.dietRadio,
      // count: this.count
      //     }).then(response => {
      //   //    console.log(this.value);
      // this.value = "";
      // return true;
      //     }).catch(err => {
      //     });
      //
      //     this.getFoodValue();
    }
  },
}

function publishIt(json){
  recipeApp.publish(json);
}

// function searchForThis(value, diet, health, first, last){
//   let heathValue = "";
//   if(health != ""){
//       healthValue = "&health=" + health;
//   }
//   let dietValue = "";
//   if(diet != ""){
//     dietValue = "&diet=" + diet;
//   }
//
//   let url = "https://api.edamam.com/search?q=" + value + "&app_id=$050813a5&app_key=$183e04e475c1a815625e45eec3be9ab7&from=" + first + "&to=" + last + dietValue + healthValue;
//   axios.get(url, {
//     type: 'GET',
//     mode: 'no-cors',
//     headers: {
//       'Access-Control-Allow-Origin': true,
//       'Content-Type': 'application/json',
//     },
//     withCredentials: true,
//     credentials: 'same-origin',
//   }).then(response => {
//     recipes.publishItJson(response);
//   });
// }

// function searchAll(value, diet, health, first, last){
//
//   $.ajax({
//
//     type: "GET",
//     data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", diet: diet, health: health, from: first, to: last},
//     dataType: 'json',
//     url: "https://api.edamam.com/search",
//       //url : myurl,
//       //dataType : "json",
//       success : function(json) {
//         recipeApp.publishItJson(json);
//       }
//   });
// }

// function searchNone(value, first, last){
//   $.ajax({
//
//     type: "GET",
//     data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", from: first, to: last},
//     dataType: 'json',
//     url: "https://api.edamam.com/search",
//       //url : myurl,
//       //dataType : "json",
//       success : function(json) {
//         console.log(json);
//         recipeApp.publishIt(json);
//       }
//   });
// }

// function searchDiet(value, diet, first, last){
//   $.ajax({
//
//     type: "GET",
//     data: { q:value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", diet:diet, from: first, to:last},
//     dataType: 'json',
//     url: "https://api.edamam.com/search",
//       //url : myurl,
//       //dataType : "json",
//       success : function(json) {
//         recipeApp.publishIt(json);
//       }
//   });
// }

function searchHealth(value, health, first, last){
  $.ajax({

    type: "GET",
    data: { q: value, app_id: "35a5939d", app_key: "351ac21caa15c6db8eb6b10cec10a3d2", health:health, from: first, to: last},
    dataType: 'json',
    url: "https://api.edamam.com/search",
      //url : myurl,
      //dataType : "json",
      success : function(json) {
        this.publishIt(json);
      }
  });
}
 </script>

<style scoped>
https://fonts.googleapis.com/css?family=Raleway
https://fonts.googleapis.com/css?family=Berkshire+Swash
body{
  font-family: 'Raleway', sans-serif;
  background-color: black;
}

#foodPicture{
  max-width: 100%;
  height: auto;
}

#top{

    position: relative;
    display: inline-block;
}

h1{
  font-family: 'Berkshire Swash', cursive;
}

h3{
  font-family: 'Berkshire Swash', cursive;
}

#main{
  padding: 10px;
  background-color: white;
  position:relative;
  width: 800px;
  margin-left: auto;
  margin-right: auto;
}

#submitArea{
  float:none;
  position: relative;
}

.container{
  margin-left: 145px;
}

.container ul{
  list-style: none;
  margin: 0;
  padding: 0;
	overflow: auto;
}


ul li{
  color: #AAAAAA;
  display: block;
  position: relative;
  float: left;
  width: 100%;
  height: 70px;
}

ul li input[type=radio]{
  position: absolute;
  visibility: hidden;
}

ul li label{
  display: block;
  position: relative;
  font-size: 1em;
  padding: 20px 5px 5px 50px;
  margin: 10px auto;

  z-index: 9;
  cursor: pointer;
  -webkit-transition: all 0.25s linear;
}
ul li:hover label{
	color: #000000;
}

ul li .check{
  display: block;
  position: absolute;
  border: 5px solid #AAAAAA;
  border-radius: 100%;
  height: 10px;
  width: 10px;
  top: 30px;
  left: 20px;
	z-index: 5;
	transition: border .25s linear;
	-webkit-transition: border .25s linear;
}

ul li:hover .check {
  border: 5px solid #000000;
}

  #NextButton{
    width: 200px;
  }

  input[type=radio]:checked ~ .check {
    border: 5px solid #000080;
  }

  input[type=radio]:checked ~ .check::before{
    background: #000080;
  }

  input[type=radio]:checked ~ label{
    color: #000080;
  }

.coolButton{
  margin-top: 15px;
  width: 150px;
  background-color: black;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.col{
  width: 200px;
  float: left;
  margin-right:80px;
  padding: 10px;
  border: 1px solid black;
  margin-bottom: 30px;
}

#PrevButton{
  width: 200px;
}

</style>
