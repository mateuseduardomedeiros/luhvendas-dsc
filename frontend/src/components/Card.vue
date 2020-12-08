<template>
  <v-col cols="12" sm="12" :md="md">
    <v-card :color="color" outlined dark>
      <v-card-title class="justify-center">{{titulo}}<v-spacer></v-spacer><v-icon>mdi-{{icon}}</v-icon></v-card-title>
      <div style="background-color: rgba(255, 255, 255, 0.18);"><v-card-text class="text-center white--text"><h2>R$ {{info}}</h2></v-card-text></div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "Card",
  props: ["titulo", "info", "color", "md", "icon"]
};
</script>
<style scoped>
</style>