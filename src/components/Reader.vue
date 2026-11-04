<template>
    <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
            <v-card>
                <v-card-item title="Mass import" subtitle="Generates the report for every file and downloads it">
                    <template v-slot:prepend><v-icon size="large">mdi-file-multiple-outline</v-icon></template>
                    <template v-slot:append>
                        <v-btn class="mr-2" variant="tonal" prepend-icon="mdi-magnify" @click="getFiles()">Browse</v-btn>
                        <v-btn :disabled="pendingFiles == 0" :loading="loading" color="primary" prepend-icon="mdi-play" @click="processFiles()">
                            Start
                        </v-btn>
                    </template>
                </v-card-item>
                <v-divider />

                <v-list v-if="files.length > 0" style="max-height: calc(100vh - 200px); overflow-y: auto">
                    <FileComponent v-for="(file, i) in files" :key="i" :file="file" />
                </v-list>
                <div v-else class="text-center text-medium-emphasis pa-12">
                    <v-icon size="64" class="mb-4">mdi-tray-arrow-up</v-icon>
                    <div>Click Browse to add Excel files</div>
                </div>
            </v-card>
        </v-col>
    </v-row>
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
        computed: {
            pendingFiles(): number {
                return this.files.filter((file) => !file.isProcessed()).length;
            },
        },
        methods: {
            async getFiles() {
                const files = await RequestFiles();
                this.files.push(...files);
            },
            async processFiles() {
                this.loading = true;
                const repository = new ExcelSalesFileRepository();
                await Promise.all(
                    this.files
                        .filter((file) => !file.isProcessed())
                        .map((file) =>
                            ProcessFile(repository, file)
                                .then((name) => {
                                    file.setError("");
                                    file.process(name);
                                })
                                .catch((e) => {
                                    file.setError(String(e));
                                })
                        )
                );
                this.loading = false;
            },
        },
    });
</script>
