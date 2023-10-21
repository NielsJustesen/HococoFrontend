// store/store.js
import { createStore } from "vuex";
import axios from "axios";

const endpoint = "http://127.0.0.1:8000/api/node";

export default createStore({
  state: {
    corporations: {},
    buildings: {},
    properties: {},
    availableParents: {},
    apiMessage: "",
  },

  mutations: {
    setCorporations(state, data) {
      state.corporations = data;
    },
    setBuildings(state, data) {
      state.buildings = data;
    },
    setProperties(state, data) {
      state.properties = data;
    },
    setAvailableParents(state, data) {
      state.availableParents = data;
    },
    setApiMessage(state, data) {
      state.apiMessage = data;
    },
  },
  actions: {
    async fetchCorporations({ commit }) {
      return await axios
        .get(endpoint)
        .then((response) => {
          commit("setCorporations", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async fetchChildNodes({ commit }, parentNode) {
      if (parentNode.type === "Property") return;
      if (parentNode.type === "Corporation") {
        return await axios
          .get(endpoint + `/${parentNode.type}/${parentNode.id}`)
          .then((response) => {
            commit("setBuildings", response.data);
          })
          .catch((error) => {
            console.log(error);
            commit("setApiMessage", error.response.data.message);
          });
      }
      if (parentNode.type === "Building") {
        return await axios
          .get(endpoint + `/${parentNode.type}/${parentNode.id}`)
          .then((response) => {
            commit("setProperties", response.data);
          })
          .catch((error) => {
            console.log(error);
            commit("setApiMessage", error.response.data.message);
          });
      }
    },

    async fetchAvailableParents({ commit }, node) {
      return await axios
        .get(endpoint + `/availableParents/${node.type}/${node.id}`)
        .then((response) => {
          console.log(response);
          commit("setAvailableParents", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async changeParent({ commit }, node) {
      return await axios
        .put(endpoint + `/changeParent/${node.id}`, node)
        .then((response) => {
          commit("setApiMessage", response.data.message);
        })
        .catch((error) => {
          console.log(error);
          commit("setApiMessage", error.response.data.message);
        });
    },

    async clearProperties({ commit }) {
      commit("setProperties", undefined);
    },

    async clearApiMessage({ commit }) {
      commit("setApiMessage", "");
    },
  },
  getters: {
    getCorporations: (state) => state.corporations,
    getBuildings: (state) => state.buildings,
    getProperties: (state) => state.properties,
    getAvailableParents: (state) => state.availableParents,
    getApiMessage: (state) => state.apiMessage,
  },
});
