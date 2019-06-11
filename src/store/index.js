import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

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

export default new Vuex.Store({
  state: {
    isConnect: false,
    username: '',
    currentAccount: null,
  },
  mutations: {
    login(state, data) {
      state.currentAccount = data.currentAccount
      state.isConnect = data.isConnect
      console.log(state.currentAccount, data)
    },
    logout(state) {
      state.currentAccount = null
    }
  },
  actions: {
    // 登陆
    async login ({commit}, symbol) {
      console.log(symbol)
      let currentAccount = null
      let isConnect = false

      const login = async () => {
        if (!isConnect) return // not connect don't login
        const requiredFields = { accounts:[network] };
        await ScatterJS.login(requiredFields)
          .then(id => {
            if(!id) return console.error('no identity');
            currentAccount = ScatterJS.account('eos');
          })
          .catch(error =>  console.error(error));
      }

      const setNetwork = async () => {
        try {
          eosClient = await ScatterJS.eos(network, Eos);
          console.log('setNetwork success')
        } catch (error) { console.log(`setNetwork error ${error}`)}
      }
      const autoLogin = async () => {
        if(ScatterJS.identity){
          currentAccount = ScatterJS.account('eos');
        } else await login()
      }

      const connect = async () => {
        await ScatterJS.connect("EOS-APP", {network}).then( async (connected) => {
          if(!connected) return console.error('no scatter');
          console.log(`connect success`)
          isConnect = true
          await setNetwork()
          await autoLogin()
        }).catch(error => console.log(`connect error: ${error}`))
      }

      await connect()

      await commit('login', {
        currentAccount,
        isConnect
      })
    },
    // 退出
    async logout ({commit}) {
      await ScatterJS.logout()
        .then(() => {
          commit('logout')
          console.log('logout success')
        })
        .catch(() => console.log('logout fail'))
    }
  }
});
