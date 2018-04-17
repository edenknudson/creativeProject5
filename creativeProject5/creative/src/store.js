import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loggedIn: false,
    loginError: '',
    registerError: '',
    favorites: [],
    items: [],
    foodValue: {diet: "", health: "", word: ""},
    feed: [],
  },
  getters: {
    user: state => state.user,
    loggedIn: state => state.loggedIn,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    favorites: state => state.favorites,
    items: state => state.items,
    foodValue: state => state.foodValue,
    feed: state => state.feed,
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },
    setLogin (state, status) {
      state.loggedIn = status;
    },
    setLoginError (state, message) {
      state.loginError = message;
    },
    setRegisterError (state, message) {
      state.registerError = message;
    },
    setFavorites (state, favorites) {
      state.favorites = favorites;
    },
    setItems (state, items) {
      state.items = items;
    },
    setFoodValue (state, foodValue) {
      console.log("setter: " + foodValue);
      state.foodValue = foodValue;
    },
    setFeed (state, feed) {
      state.feed = feed;
    },
  },
  actions: {
    // Add pictures //
    getFeed(context) {
      axios.get("/api/users/" + context.state.user.id + "/pictureposts").then(response => {
        console.log(response.data.pictureposts);
    context.commit('setFeed',response.data.pictureposts);
      }).catch(err => {
    console.log("getFeed failed:",err);
      });

    },
    getCategory(context,category){
      console.log("store category: " + category.category);
      axios.get("/api/users/" + context.state.user.id + "/category/" + category.category,category).then(response => {
        console.log(response.data.pictureposts);
    context.commit('setFeed',response.data.pictureposts);
      }).catch(err => {
    console.log("getCategory failed:",err);
      });
    },
    addPicture(context,picture) {
      axios.post("/api/users/" + context.state.user.id + "/pictureposts",picture).then(response => {
    return context.dispatch('getFeed');
      }).catch(err => {
    console.log("addPicture failed:",err);
      });
    },
    // Registration, Login //
    register(context,user) {
      axios.post("/api/users",user).then(response => {
      context.commit('setUser', response.data.user);
      context.commit('setLogin',true);
      context.commit('setRegisterError',"");
      context.commit('setLoginError',"");
        }).catch(error => {
      context.commit('setLoginError',"");
      context.commit('setLogin',false);
      if (error.response) {
      if (error.response.status === 409)
        context.commit('setRegisterError',"That user name is already taken.");
      return;
      }
      context.commit('setRegisterError',"Sorry, your request failed. We will look into it.");
      });
    },
    login(context,user) {
      axios.post("/api/login",user).then(response => {
    context.commit('setUser', response.data.user);
    context.commit('setLogin',true);
    context.commit('setRegisterError',"");
    context.commit('setLoginError',"");
      }).catch(error => {
    context.commit('setRegisterError',"");
    if (error.response) {
    if (error.response.status === 403 || error.response.status === 400)
      context.commit('setLoginError',"Invalid login.");
    context.commit('setRegisterError',"");
    return;
    }
    context.commit('setLoginError',"Sorry, your request failed. We will look into it.");
      });
    },
    logout(context,user) {
      context.commit('setUser', {});
      context.commit('setLogin',false);
    },
    // favorites //
    getFavorites(context) {
      axios.get("/api/users/" + context.state.user.id + "/favorites").then(response => {
        context.commit('setFavorites',response.data.favorites);
      }).catch(err => {
        console.log("getFavorites failed:",err);
      });
    },
    addFavorite(context,itemId) {
      //TODO work on this

      axios.post("/api/users/" + context.state.user.id + "/favorites",label,image,url,calories,servings,cps,ingredients,cautions).then(response => {
    return context.dispatch('getFavorites');
      }).catch(err => {
    console.log("addFavorite failed:",err);
      });
    },
    // items //
    getItems(context) {
      axios.get("/api/users/" + context.state.user.id + "/items").then(response => {
        context.commit('setItems',response.data.items);
      }).catch(err => {
        console.log("getItems failed:",err);
      });
    },
    deleteItems(context) {
      axios.delete("/api/users/" + context.state.user.id + "/items").then(response => {
        context.commit('setItems',response.data.items);
      }).catch(err => {
        console.log("deleteItems failed:",err);
      });
    },
    addItem(context,label,image,url,calories,servings,cps,ingredients,cautions) {
      axios.post("/api/users/" + context.state.user.id + "/items",label,image,url,calories,servings,cps,ingredients,cautions).then(response => {
    return context.dispatch('getItems');
      }).catch(err => {
    console.log("addItem failed:",err);
      });
    },
    // food value
    changeFoodValue(context,foodValue){
      axios.delete("/api/users/" + context.state.user.id + "/foodValue").then(response => {
    return context.dispatch('getFoodValue');
      }).catch(err => {
    console.log("deleteItem failed:",err);
      });
      console.log("changeFoodValue: " + foodValue.word);
      axios.post("/api/users/" + context.state.user.id + "/foodValue",foodValue).then(response => {
    return context.dispatch('getFoodValue');
      }).catch(err => {
    console.log("addItem failed:",err);
      });


    },
    getFoodValue(context) {
      console.log("Got to get Food Value");
      axios.get("/api/users/" + context.state.user.id + "/foodValue").then(response => {
        let answer;
        if(response.data.foodValue == undefined || response.data.foodValue == null){
          answer = {};
          answer.health = "";
          answer.diet = "";
        }else{
          answer = response.data.foodValue;
          if(answer.health == undefined){
            answer.health = "";
          }
          if(answer.diet == undefined){
            answer.diet = "";
          }
          console.log("response:" + response.data.foodValue);

        }
        console.log("answer:" + answer);
        context.commit('setFoodValue',answer);

      }).catch(err => {
        console.log("getFoodValue failed:",err);

      });

      if(this.getters.foodValue == undefined){
        let answer = {};
        answer.health = "";
        answer.diet = "";
        context.commit('setFoodValue',answer);
        console.log("answer:" + answer);
      }
      console.log("foodValue story:" + this.getters.foodValue);

    },
  }
});
