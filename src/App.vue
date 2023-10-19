<template>
  <div class="wrapper">
    <div class="containers">
      <h1>taxonomy</h1>
      <div class="container">
        <MyCard
          v-for="corp in corporations"
          :key="corp.id"
          @click="corpClicked(corp)"
          :id="corp.id"
          :height="corp.height"
          :name="corp.name"
          :type="corp.type"
        />
      </div>
      <h2 v-if="selectedCorpName !== ''">{{ selectedCorpName }}s children</h2>
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
        />
      </div>

      <h3 v-if="selectedBuildingName !== ''">
        {{ selectedBuildingName }}s children
      </h3>

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
        />
      </div>
    </div>

    <div class="my-form">
      <div
        v-if="
          selectedNode.type === 'Property' || selectedNode.type === 'Building'
        "
      >
        <h3>Change parent on node</h3>
        <form action="" @submit.prevent="changeParent">
          <div style="margin-bottom: 1em">
            new parent id:
            <input type="number" v-model="selectedNode.parent_id" />
          </div>
          <input type="submit" value="change" />
        </form>
        <p>Message: {{ apiMessage }}</p>
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

    const apiMessage = computed(() => {
      return store.getters.getApiMessage;
    });

    const selectedCorpName = ref("");
    const selectedBuildingName = ref("");

    const selectedNode = ref({});

    store.dispatch("fetchCorporations");

    const corporations = computed(() => {
      return store.getters.getCorporations;
    });

    const corpClicked = (corp) => {
      selectedCorpName.value = corp.name;
      store.dispatch("clearProperties");
      selectedBuildingName.value = "";
      store.dispatch("fetchChildNodes", corp);
      selectedNode.value = corp;
    };

    const buildingClicked = (building) => {
      selectedBuildingName.value = building.name;
      store.dispatch("fetchChildNodes", building);
      console.log(building);
      selectedNode.value = building;
    };

    const propertyClicked = (property) => {
      console.log(property);
      selectedNode.value = property;
    };

    const buildings = computed(() => {
      return store.getters.getBuildings;
    });

    const properties = computed(() => {
      return store.getters.getProperties;
    });

    const changeParent = () => {
      store.dispatch("changeParent", selectedNode.value);
    };

    setInterval(() => {
      store.dispatch("clearApiMessage");
    }, 2000);

    return {
      selectedCorpName,
      selectedBuildingName,
      corporations,
      buildings,
      properties,
      corpClicked,
      buildingClicked,
      propertyClicked,
      selectedNode,
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
</style>
