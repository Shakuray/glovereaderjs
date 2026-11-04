<template>
    <v-list-item :title="file.toString()" :subtitle="subtitle">
        <template v-slot:prepend>
            <v-icon :color="status.color">{{ status.icon }}</v-icon>
        </template>
    </v-list-item>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import File from "@/Domain/File";

    export default defineComponent({
        name: "FileItem",
        props: {
            file: { type: Object as PropType<File>, required: true },
        },
        computed: {
            status(): { icon: string; color?: string } {
                if (this.file.error) return { icon: "mdi-alert-circle", color: "error" };
                if (this.file.isProcessed()) return { icon: "mdi-check-circle", color: "success" };
                return { icon: "mdi-file-excel-outline" };
            },
            subtitle(): string | undefined {
                if (this.file.error) return String(this.file.error);
                if (this.file.isProcessed()) return `${this.file.fileName} · downloaded`;
                return undefined;
            },
        },
    });
</script>
