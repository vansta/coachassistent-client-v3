<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col>
                        <v-text-field v-model="search.search" label="Name" @input="emitSearch"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-select v-model="search.tags" label="Tags" :items="tags" multiple append-inner-icon="mdi-refresh" @click:appendInner="getTags" @update:modelValue="emitSearch">
                            <!-- <template v-slot:append>
                                <v-btn icon="mdi-refresh" size="30"></v-btn>
                            </template> -->
                        </v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import { reactive } from '@vue/reactivity'
var searchTimeOut;
export default {
    // setup() {
    //     const search = reactive({ name: '' })

    //     return {
    //         search
    //     }
    // },
    created () {
        this.getTags();
    },

    data() {
        return {
            search: { search: '', tags: [] },
            tags: []
        }
    },

    methods: {
        emitSearch() {
            clearTimeout(searchTimeOut);
            searchTimeOut = setTimeout(() => {
                this.$emit('search');
            }, 500);
        },
        getTags() {
            this.$api.getTags()
                .then(resp => this.tags = resp.data);
        }
    }
}
</script>