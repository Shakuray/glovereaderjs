<template>
    <div>
        <v-btn @click="getFiles()" style="margin-top: 20px" color="secondary" prepend-icon="mdi-magnify">Buscar</v-btn>

        <div style="height: calc(100vh - 190px); overflow-y: auto">
            <FileComponent v-for="(file, i) in files" :key="i" :file="file" />
        </div>

        <v-btn class="mt-4" :disabled="files.length == 0" :loading="loading" color="primary" prepend-icon="mdi-play" @click="processFiles()">
            Start
        </v-btn>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import File from "@/Domain/File";
    import RequestFiles from "@/Infrastructure/RequestFiles";
    import ProcessFile from "@/Application/ProcessFile";
    import ExcelSalesFileRepository from "@/Infrastructure/ExcelSalesFileRepository";
    import FileComponent from "@/components/File.vue";

    export default defineComponent({
        name: "Reader",
        data: () => ({
            files: [] as File[],
            loading: false,
        }),
        components: { FileComponent },
        methods: {
            async getFiles() {
                const files = await RequestFiles();
                this.files.push(...files);
            },
            async processFiles() {
                this.loading = true;
                const repository = new ExcelSalesFileRepository();
                this.files.forEach((file) => {
                    if (!file.isProcessed()) {
                        ProcessFile(repository, file)
                            .then((name) => {
                                file.process(name);
                            })
                            .catch((e) => {
                                file.setError(e);
                            });
                    }
                });
                this.loading = false;
            },
        },
    });
</script>
