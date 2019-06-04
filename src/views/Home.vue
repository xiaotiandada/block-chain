<template>
  <div class="home">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <button @click="login">login</button>
    <button>logout</button>
  </div>
</template>

<script>

import scatter from "@/api/ScatterJS.js";
import { constants } from 'crypto';

export default {
  name: "home",
  methods:{
    async login() {
      const res = await scatter.scatterLogin()
      console.log(res)
    }
  }
};
</script>
