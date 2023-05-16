<template>
    <v-dialog v-model="value">
        <v-card>
            <v-card-title class="text-h5"> Confirm delete?</v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="secondary"
                    text
                    @click="
                        () => {
                            $emit('input', false);
                        }
                    "
                    >Cancel</v-btn
                >
                <v-btn
                    color="red"
                    text
                    @click="
                        () => {
                            $emit('confirm');
                            $emit('input', false);
                        }
                    "
                    >Delete</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "ConfirmDelete",
        props: {
            value: Boolean,
        },
        methods: {},
    });
</script>
