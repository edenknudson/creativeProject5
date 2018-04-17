<template>
  <center>
  <div class="column">
    <h1>Beautiful Mind</h1>
    <h2>Save all the pictures you want</h2>
    <form v-on:submit.prevent="register">
      <p>Username:</p><input class="narrow" v-model="username" placeholder="User Name">
      <p>Password:</p><input class="narrow" type="password" v-model="password" placeholder="Password">
      <br>
      <button class="alternate" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</center>
</template>

<script>
 export default {
   name: 'WelcomePage',
   data () {
     return {
       username: '',
       password: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
   },
   methods: {
     register: function() {
       this.$store.dispatch('register',{
	        username: this.username,
         password: this.password,
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 img {
     width: 100px;
 }

 h1 {
     margin-bottom: 0px;
 }
 h2 {
     margin-top: 0px;
     font-size: 1.2em;
     font-weight: normal;
     margin-bottom: 50px;
 }
 .narrow {
     width: 400px;
 }
 .wide {
     width: 370px;
 }
</style>
