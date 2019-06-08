<template>
  <div>
    <template v-if="currentAccount">
      <p>{{currentAccount.name}}</p>
    </template>
    <button @click="login">login</button>
    <button @click="logout">logout</button>
    <button @click="sendTransfer">send</button>
  </div>
</template>

<script>
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import Eos from "eosjs";

ScatterJS.plugins(new ScatterEOS());

const network = {
  blockchain: "eos",
  protocol: "https",
  host: "nodes.get-scatter.com",
  port: 443,
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
};

const requiredFields = { accounts: [network] };
const eosOptions = { expireInSeconds:60 };
let eosClient = null

export default {
  name: "home",
  data(){
    return{
      currentAccount : null,
      scatter : null 
    }
  },
  created(){
    ScatterJS.scatter.connect("EOS-APP").then(connected => {
      if (!connected) return false;
      this.scatter = ScatterJS.scatter;
      console.log('ok')
      window.scatter = null;
      window.ScatterJS = null;
    });
  },
  methods:{
    async login() {
      let { scatter } = this;
      // 判断是否支持login方法 
      let scatterLogin = null
      if (scatter.login) scatterLogin = scatter.login
      else if (scatter.getIdentity) scatterLogin = scatter.getIdentity
      await scatterLogin(requiredFields)
        .then(() => {
          let account = scatter.identity.accounts.find(x => x.blockchain === "eos")
          this.currentAccount = account
          eosClient = scatter.eos(network, Eos, eosOptions);
        })
        .catch(error =>  console.error(error));
    },
    logout() {
      // 如果logout 不支持使用 forgetIdentity
      if (this.scatter.logout) this.scatter.logout()
      else if (this.scatter.forgetIdentity) this.scatter.forgetIdentity()
      this.currentAccount = null
      console.log('logout')
    },
    sendTransfer() {
      if (!this.currentAccount) return console.log('not login')
      const transactionOptions = { 
        authorization: [`${this.currentAccount.name}@${this.currentAccount.authority}`] 
      };

      eosClient
        .transfer(this.currentAccount.name, this.currentAccount.name, '0.001 EOS', 'memo', transactionOptions)
        .then(trx => {
          console.log(trx);
          console.log(`Transaction ID: ${trx.transaction_id}`);
        })
        .catch(error => console.error(error));
    }
  }
};
</script>
