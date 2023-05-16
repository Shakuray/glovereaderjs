<template>
    <div>
        <v-tabs v-model="tab" bg-color="primary">
            <v-tab :value="0"> <v-icon left>mdi-file</v-icon> Reader</v-tab>
            <v-tab :value="1"> <v-icon left>mdi-cog</v-icon> Config</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item :value="0"><Reader /></v-window-item>
            <v-window-item :value="1"> <ConfigPanel /> </v-window-item>
        </v-window>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Reader from "@/components/Reader.vue";
    import ConfigPanel from "@/components/ConfigPanel.vue";

    export default Vue.extend({
        name: "AppContainer",
        data: () => ({
            tab: 0,
        }),
        components: { Reader, ConfigPanel },
    });
</script>
