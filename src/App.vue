<template>
  <div class="wrapper">
    <div class="containers">
      <h1>taxonomy</h1>
      <p>Corporations</p>
      <div class="container">
        <MyCard
          v-for="corp in corporations"
          :key="corp.id"
          @click="corpClicked(corp)"
          :id="corp.id"
          :height="corp.height"
          :name="corp.name"
          :type="corp.type"
          :class="selectedCorp.id == corp.id ? 'highlight' : ''"
        />
      </div>
      <h2 v-if="selectedCorp">{{ selectedCorp.name }}s children</h2>
      <p>Buildings</p>
      <div class="container">
        <MyCard
          v-for="building in buildings"
          :key="building.id"
          @click="buildingClicked(building)"
          :id="building.id"
          :height="building.height"
          :name="building.name"
          :type="building.type"
          :zipCode="building.zip_code"
          :class="selectedBuilding.id == building.id ? 'highlight' : ''"
        />
      </div>

      <h3 v-if="selectedBuilding">{{ selectedBuilding.name }}s children</h3>

      <p>Properties</p>
      <div class="container">
        <MyCard
          v-for="property in properties"
          :key="property.id"
          @click="propertyClicked(property)"
          :id="property.id"
          :height="property.height"
          :name="property.name"
          :type="property.type"
          :monthlyRent="property.monthly_rent"
          :class="selectedProperty.id == property.id ? 'highlight' : ''"
        />
      </div>
    </div>

    <div class="my-form">
      <div
        v-if="
          selectedNode.type === 'Property' || selectedNode.type === 'Building'
        "
      >
        <h3>Change parent on {{ selectedNode.name }}</h3>
        <form action="" @submit.prevent="changeParent">
          <div style="margin-bottom: 1em">
            New parent id:
            <select name="" id="" v-model="selectedNode.parent_id">
              <option
                v-for="parent in availableParents"
                :key="parent.id"
                :value="parent.id"
              >
                {{ parent.id }}, {{ parent.name }}
              </option>
            </select>
          </div>
          <input type="submit" value="change" />
        </form>
        <p v-if="apiMessage">Message: {{ apiMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import MyCard from "./components/MyCard.vue";
export default {
  name: "App",
  components: {
    MyCard,
  },
  setup() {
    const store = useStore();

    store.dispatch("fetchCorporations");

    const apiMessage = computed(() => {
      return store.getters.getApiMessage;
    });

    const availableParents = computed(() => {
      return store.getters.getAvailableParents;
    });

    const selectedCorp = ref({});
    const selectedBuilding = ref({});
    const selectedProperty = ref({});

    const selectedNode = ref({});

    const corporations = computed(() => {
      return store.getters.getCorporations;
    });

    const corpClicked = (corp) => {
      selectedCorp.value = corp;
      selectedBuilding.value = {};
      selectedProperty.value = {};
      selectedNode.value = corp;
      store.dispatch("clearProperties");
      store.dispatch("fetchChildNodes", corp);
    };

    const buildingClicked = (building) => {
      selectedBuilding.value = building;
      selectedNode.value = building;
      store.dispatch("fetchAvailableParents", building);
      store.dispatch("fetchChildNodes", building);
    };

    const propertyClicked = (property) => {
      selectedNode.value = property;
      selectedProperty.value = property;
      store.dispatch("fetchAvailableParents", property);
    };

    const buildings = computed(() => {
      return store.getters.getBuildings;
    });

    const properties = computed(() => {
      return store.getters.getProperties;
    });

    const changeParent = () => {
      store
        .dispatch("changeParent", selectedNode.value)
        .then(() => {
          store.dispatch("fetchChildNodes", selectedCorp.value);
        })
        .then(() => {
          store.dispatch("fetchChildNodes", selectedBuilding.value);
        })
        .then(() => {
          setTimeout(() => {
            store.dispatch("clearApiMessage");
          }, 2000);
        });
    };

    return {
      selectedCorp,
      selectedBuilding,
      selectedProperty,
      corporations,
      buildings,
      properties,
      corpClicked,
      buildingClicked,
      propertyClicked,
      selectedNode,
      availableParents,
      changeParent,
      apiMessage,
    };
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  gap: 1em;
  margin-bottom: 1em;
  border-bottom: 1px solid black;
  padding-bottom: 1em;
}
.wrapper {
  display: flex;
}
.my-form {
  border-left: 1px solid black;
  margin-left: 2em;
  padding-top: 4em;
  padding-left: 2em;
}

.highlight {
  box-shadow: 3px 3px 3px black;
}
</style>
