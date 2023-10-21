<template>
  <div class="card">
    <p v-if="id">ID: {{ id }}</p>
    <p>Name: {{ name }}</p>
    <p>Type: {{ type }}</p>
    <p v-if="zipCode">Zip code: {{ zipCode }}</p>
    <p v-if="monthlyRent">Rent: {{ monthlyRent }}</p>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
    },
    height: {
      type: Number,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    monthlyRent: {
      type: String,
    },
  },
};
</script>

<style>
.card {
  border: 1px solid black;
  border-radius: 5px;
  padding: 0 0.5em 0 0.5em;
  cursor: pointer;
}
</style>
