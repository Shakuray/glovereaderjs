<template>
    <div>
        <v-btn v-if="files.length == 0" @click="getFiles()"> Buscar </v-btn>
        <v-btn v-else @click="processFiles()"> Start </v-btn>
        
        <h1 v-for="(file, i) in files" :key="i">
            {{ file.toString() }}
        </h1>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import File from '@/Domain/File';
import RequestFiles from "@/Infrastructure/RequestFiles"
import ProcessFile from "@/Domain/ProcessFile"

export default Vue.extend({
    name: "AppContainer",
    data : () => ({
        files : [] as File[]
    }),
    methods : {
        async getFiles() {
            this.files = await RequestFiles();
        },
        async processFiles() {
            this.files.forEach(file => {
                ProcessFile(file).then(() => {
                    console.log(file);
                });
            })
        }
    }
})

</script>