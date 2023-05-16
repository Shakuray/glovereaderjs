<template>
    <div>
        <div style="height: calc(100vh - 48px); overflow-y: auto">
            <div v-if="currentConfig == undefined">
                <v-btn color="primary" class="ma-3" @click="() => editFile(element.name)" outlined v-for="(element, i) in configs" :key="i">
                    <v-icon left>mdi-cog</v-icon>
                    <span class="text-h6 mt-1 mr-2"> {{ element.name }}</span>
                </v-btn>
            </div>
            <div v-else>
                <ConfigEditor @back="() => (currentConfig = undefined)" :config="currentConfig" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Config from "@/Domain/Config";
    import ConfigFileRepository from "@/Infrastructure/ConfigFileRepository";
    import ConfigEditor from "@/components/ConfigEditor.vue";
    import Vue from "vue";

    export default Vue.extend({
        name: "ConfigPanel",
        data: () => ({
            configs: [] as { data: Config[]; name: string }[],
            currentConfig: undefined as undefined | { name: string; data: Config[] },
        }),
        components: { ConfigEditor },
        mounted() {
            const repo = new ConfigFileRepository();
            this.configs = repo.get();
        },
        methods: {
            editFile(name: string) {
                const content = this.configs.find((config) => config.name == name)!;
                this.currentConfig = content;
            },
        },
    });
</script>
