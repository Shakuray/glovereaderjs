<template>
    <v-card class="ma-3" outlined>
        <v-container>
            <v-alert v-if="file.error != ''" type="error">{{ file.error }}</v-alert>
            <v-icon v-if="file.error" color="error">mdi-close</v-icon>

            <v-icon v-if="file.isProcessed()" color="success">mdi-check</v-icon>

            <span>{{ file.toString() }}</span>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import Vue from "vue";
    import File from "@/Domain/File";

    export default Vue.extend({
        name: "File",
        props: {
            file: File,
        },
    });
</script>
