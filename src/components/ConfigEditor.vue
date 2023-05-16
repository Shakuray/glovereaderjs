<template>
    <div>
        <ConfirmDelete v-model="deleteDialog" @confirm="deleteMachine()" />
        <div class="d-flex my-5">
            <v-btn icon class="mx-2" @click="$emit('back')"><v-icon>mdi-arrow-left</v-icon></v-btn>
            <span class="text-h6 text-uppercase" style="color: white">{{ config.name }}</span>
        </div>
        <v-card v-for="(machine, i) in config.data" :key="i" class="mb-9">
            <v-text-field placeholder="Machine" class="pa-4" hide-details dense outlined v-model="machine.id"></v-text-field>

            <draggable v-model="machine.items" group="people" handle=".handle">
                <transition-group>
                    <v-card class="ma-3" outlined v-for="(element, i) in machine.items" :key="i">
                        <div class="d-flex">
                            <v-icon class="handle" style="cursor: move">mdi-drag-vertical</v-icon>
                            <span class="text-h6 mt-1 mr-2"> {{ i + 1 }}</span>
                            <v-text-field placeholder="Product" hide-details dense outlined v-model="element.name"></v-text-field>
                            <v-btn icon @click="() => deleteItem(machine.id, element.line)">
                                <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                </transition-group>
            </draggable>

            <v-btn outlined class="mr-4 my-6" color="primary" @click="addItem(machine.id)"> <v-icon left>mdi-plus</v-icon> Add product row</v-btn>
            <v-btn outlined color="red" @click="requestDelete(machine.id)"> <v-icon left>mdi-trash-can</v-icon> Remove Machine</v-btn>
        </v-card>

        <div class="mb-7">
            <v-btn outlined color="primary" @click="addMachine()"> <v-icon>mdi-plus</v-icon> Add Machine</v-btn>
            <v-btn class="ml-4" :loading="loading" color="primary" @click="saveConfig()"> <v-icon left>mdi-content-save</v-icon> Save </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import Config from "@/Domain/Config";
    import Vue, { PropType } from "vue";
    import draggable from "vuedraggable";
    import ConfirmDelete from "./ConfirmDelete.vue";
    import ConfigFileRepository from "@/Infrastructure/ConfigFileRepository";

    export default Vue.extend({
        name: "ConfigEditor",
        props: {
            config: Object as PropType<{
                name: string;
                data: Config[];
            }>,
        },
        data: () => ({
            loading: false,
            deleteDialog: false,
            itemToDelete: undefined as string | undefined,
        }),
        components: { draggable, ConfirmDelete },
        methods: {
            saveConfig() {
                const repo = new ConfigFileRepository();
                repo.save(this.config);
                this.$emit("back");
            },
            addMachine() {
                this.config.data.push({ id: "", items: [] });
            },
            addItem(machine_id: string) {
                const machine = this.config.data.find((machine) => machine.id == machine_id)!;
                machine.items.push({ line: (machine.items.length + 1).toString(), name: "" });
            },
            requestDelete(machine_id: string) {
                this.itemToDelete = machine_id;
                this.deleteDialog = true;
            },
            deleteMachine() {
                const machine = this.config.data.find((machine) => machine.id == this.itemToDelete)!;
                this.config.data.splice(this.config.data.indexOf(machine), 1);
            },
            deleteItem(machine_id: string, line: string) {
                const machine = this.config.data.find((machine) => machine.id == machine_id)!;
                const itemToDelete = machine.items.find((item) => item.line == line)!;
                machine.items.splice(machine.items.indexOf(itemToDelete), 1);
            },
        },
    });
</script>
