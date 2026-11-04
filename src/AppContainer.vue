<template>
    <v-app-bar color="primary" density="comfortable" flat>
        <v-tabs v-model="tab">
            <v-tab :value="0" prepend-icon="mdi-file-excel-outline">Import</v-tab>
            <v-tab :value="1" prepend-icon="mdi-file-multiple-outline">Mass import</v-tab>
        </v-tabs>
    </v-app-bar>

    <v-main>
        <v-container class="mx-auto" style="max-width: 1600px">
            <v-window v-model="tab">
                <v-window-item :value="0"><Importer /></v-window-item>
                <v-window-item :value="1"><Reader /></v-window-item>
            </v-window>
        </v-container>
    </v-main>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import Reader from "@/components/Reader.vue";
    import Importer from "@/components/Importer.vue";

    export default defineComponent({
        name: "AppContainer",
        components: { Reader, Importer },
        data: () => ({
            tab: 0,
        }),
    });
</script>
