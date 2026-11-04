<template>
    <div>
        <v-tabs v-model="tab" bg-color="primary" grow>
            <v-tab :value="0" prepend-icon="mdi-file">Reader</v-tab>
            <v-tab :value="1" prepend-icon="mdi-calendar-range">Importar</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item :value="0"><Reader /></v-window-item>
            <v-window-item :value="1"><Importer /></v-window-item>
        </v-window>
    </div>
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
