<template>
  <div>
    <template v-if="currentAccount">
      <p>{{currentAccount.name}}</p>
    </template>
    <button @click="loginButton">login</button>
    <button @click="logoutButton">logout</button>
    <button @click="sendTransfer">send</button>
    <button @click="getBalance">getBalance</button>
    <button @click="getArbitrarySignature">getArbitrarySignature</button>
  </div>
</template>

<script>
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

import { mapState ,mapActions } from "vuex";

ScatterJS.plugins( new ScatterEOS() );

const network = ScatterJS.Network.fromJson({
    blockchain:'eos',
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https'
});


let eosClient = null

export default {
  name: "home",
  data(){
    return{
      isConnect: false, //  是否连接
    }
  },
  created(){
  },
  computed: {
    ...mapState(['currentAccount']),
  },
  methods:{
    ...mapActions(['login', 'logout']),
    async loginButton() {
      this.login('eos')
    },
    async logoutButton() {
      this.logout()      
    },
    async sendTransfer() {
      // error api show status 500 !!!
      if (!this.currentAccount) return // not login don't send transfer
      const account = ScatterJS.account('eos');
      const options = {authorization:[`${account.name}@${account.authority}`]};
      await eosClient.transfer(account.name, 'qinxiaowen11', '0.0001 EOS', account.name, options).then(res => {
          console.log('sent: ', res);
      }).catch(err => {
          console.error('error: ', err);
      });
    },
    async getBalance() {
      if (!this.currentAccount) return // not login don't get balance
      await eosClient
        .getCurrencyBalance("eosio.token", this.currentAccount.name, "EOS")
        .then(data => {
          console.log(data[0])
        }).catch(() => console.log('get balance error'))
    },
    getArbitrarySignature() {
      const publicKey = ScatterJS.identity.publicKey
      const data = this.currentAccount.name
      ScatterJS
        .getArbitrarySignature(publicKey, data)
        .then(signature => {
          console.log(signature)
        })
        .catch(error => { console.log(error) });
    },
  }
};
</script>
