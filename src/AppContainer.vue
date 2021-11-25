<template>
    <div>
        <v-btn @click="getFiles()" color="secondary"> <v-icon>mdi-magnify</v-icon> Buscar </v-btn>
        
        <div style="height:calc(100vh - 120px); overflow-y:auto">
            <FileComponent v-for="(file, i) in files" :key="i" :file="file" />
        </div>

        <v-btn class="mt-4" v-if="files.length > 0" :loading="loading" color="primary" @click="processFiles()"> Start </v-btn>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import File from '@/Domain/File';
import RequestFiles from "@/Infrastructure/RequestFiles"
import ProcessFile from "@/Domain/ProcessFile"
import FileComponent from "@/components/File.vue"

export default Vue.extend({
    name: "AppContainer",
    data : () => ({
        files : [] as File[],
        loading : false
    }),
    components: { FileComponent },
    methods : {
        async getFiles() {
            const files = await RequestFiles()
            this.files.push(...files)            
        },
        async processFiles() {
            this.loading = true;
            this.files.forEach(file => {
                if (!file.isProcessed()){
                    ProcessFile(file).then((name) => {
                        file.process(name)
                    }).catch(e => {
                        file.setError(e)
                    });
                }
            })
            this.loading = false;
        }
    }
})

</script>