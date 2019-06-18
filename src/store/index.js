import Vue from "vue";
import Vuex from "vuex";

import scatter from './scatter';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    scatter
  },
  state: {
    currentAccount: null
  },
  mutations: {
    setCurrentAccount(state, currentAccount) {
      state.currentAccount = currentAccount
      console.log(state.currentAccount)
    }
  },
  actions: {
    async login({ commit ,dispatch, rootState, rootGetters}, symbol) {
      console.log(symbol)
      const modulesAction = {
        'eos': 'scatter/login'
      }
      const modulesGetters = {
        'eos': 'scatter/getCurrentAccount'
      }
      await dispatch(modulesAction[symbol])
      await commit('setCurrentAccount', rootGetters[modulesGetters[symbol]])
      // console.log(rootState, rootGetters)
    }
  }
});
