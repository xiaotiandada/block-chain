<template>
  <div>
    <template v-if="currentAccount">
      <p>{{currentAccount.name}}</p>
    </template>
    <button @click="login">login</button>
    <button @click="logout">logout</button>
    <button @click="sendTransfer">send</button>
    <button @click="getBalance">getBalance</button>
  </div>
</template>

<script>
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

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
      currentAccount : null,
      isConnect: false, //  是否连接

    }
  },
  created(){
    this.connect()
  },
  methods:{
    async connect() {
      await ScatterJS.connect("EOS-APP", {network}).then(connected => {
        if(!connected) return console.error('no scatter');
        console.log('connect success')
        this.isConnect = true
        this.setNetwork()
      }).catch(error => console.log(`connect error: ${error}`))
    },
    async setNetwork() {
      try {
        eosClient = await ScatterJS.eos(network, Eos);
        console.log('setNetwork success')
      } catch (error) { console.log(`setNetwork error ${error}`)}
    },
    async login() {
      if (!this.isConnect) return // not connect don't login
      const requiredFields = { accounts:[network] };
      await ScatterJS.login(requiredFields)
        .then(id => {
          if(!id) return console.error('no identity');
          this.currentAccount = ScatterJS.account('eos');
          console.log(this.currentAccount)
        })
        .catch(error =>  console.error(error));
    },
    async logout() {
      await ScatterJS.logout()
        .then(() => {
          this.currentAccount = null
          console.log('logout success')
        })
        .catch(() => console.log('logout fail'))
    },
    async sendTransfer() {
      // error api show status 500 !!!
      if (!this.currentAccount) return // not login don't send transfer
      const account = ScatterJS.account('eos');
      const options = {authorization:[`${account.name}@${account.authority}`]};
      await eosClient.transfer(account.name, account.name, '0.0001 EOS', account.name, options).then(res => {
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
    }
  }
};
</script>
