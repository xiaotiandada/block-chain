<template>
  <div>
    <template v-if="currentAccount">
      <p>{{currentAccount.name}}</p>
    </template>
    <button @click="loginButton">login</button>
    <button @click="logoutButton">logout</button>
    <button @click="sendTransferButton">send</button>
    <button @click="getBalanceButton">getBalance</button>
    <button @click="getArbitrarySignatureButton">getArbitrarySignature</button>
  </div>
</template>

<script>
import { mapState ,mapActions } from "vuex";

export default {
  name: "home",
  data(){
    return{
    }
  },
  created(){
    // this.login()
  },
  computed: {
    ...mapState(['currentAccount']),
  },
  methods:{
    ...mapActions(['login', 'logout', 'sendTransfer', 'getBalance', 'getArbitrarySignature']),
    // ...mapActions({
    //   login: 'scatter/login'
    // }),
    loginButton() {
      this.login('eos')
    },
    logoutButton() {
      this.logout()      
    },
    sendTransferButton() {
      this.sendTransfer()
    },
    getBalanceButton() {
      this.getBalance()
    },
    getArbitrarySignatureButton() {
      this.getArbitrarySignature()
    },
  }
};
</script>
