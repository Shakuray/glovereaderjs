<template>
    <v-app>
        <AppContainer />
    </v-app>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import AppContainer from "./AppContainer.vue";

    export default defineComponent({
        name: "App",
        components: { AppContainer },
    });
</script>

<style lang="css">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
