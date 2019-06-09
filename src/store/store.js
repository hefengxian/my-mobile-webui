import Vue from "vue";
import Vuex from "vuex";
import global from "./global";

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        global
    }
});
