<template>
    <v-app>
        <v-main>
            <v-container fluid>
                <AppContainer />
            </v-container>
        </v-main>
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
    html,
    body {
        overflow-y: hidden;
    }

    .scrollbar-hidden::-webkit-scrollbar {
        display: none;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }

    .v-container {
        padding: 0px !important;
    }
</style>
