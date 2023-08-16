<template>
    <v-container>
        <v-btn :to="{ name: 'CreateGroup' }">{{ t('create') }}</v-btn>
        <c-data-table :items="groups" :headers="headers" @click:row="onRowClick">

    </c-data-table>
    </v-container>
    
</template>

<script>
import CDataTable from '@/components/common/CDataTable.vue';
import { useAuthenticationStore } from '@/plugins/pinia';
import { useI18n } from 'vue-i18n';

export default {
    components: {
        CDataTable
    },
    created () {
        this.getGroups();
    },
    setup() {
        const authStore = useAuthenticationStore();
        const { t } = useI18n();

        return { authStore, t };
    },
    data() {
        return {
            headers: [
                { field: 'name' },
                { field: 'description' },
                { field: 'tags' }
            ],
            groups: [],
            loading: false
        }
    },
    methods: {
        getGroups () {
            this.loading = true;
            const searchRef = this.$refs.search;
            var search = {};
            if (searchRef && searchRef.search){
                search = searchRef.search;
            }
            this.$api.getGroups()
                .then(resp => {
                    this.groups = resp.data.items;
                })
                .finally(() => this.loading = false);
        },

        onRowClick (item) {
            console.log(item);
            this.$router.push({ name: 'EditGroup', params: {
                id: item.id
            }})
        }
    }
}
</script>