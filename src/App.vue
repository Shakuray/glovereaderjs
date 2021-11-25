<template>
    <v-app>
        <v-main class="height:calc(100vh)">           
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>

        <!-- <v-footer app>
            
        </v-footer> -->

    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: { }
})

export default class App extends Vue {
    data() {
        return{

        }
    }
}

</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
