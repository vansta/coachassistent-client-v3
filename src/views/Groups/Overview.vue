<template>
    <v-container>
        <v-btn :to="{ name: 'CreateGroup' }">{{ t('action.create') }}</v-btn>
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
                { header: 'field.name', field: 'name' },
                { header: 'field.description', field: 'description' },
                { header: 'field.tags', field: 'tags' },
                { header: 'members', field: 'members' },
                { header: 'membership_requests', field: 'membershipRequests' }
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
            this.$router.push({ name: 'EditGroup', params: {
                id: item.id
            }})
        }
    }
}
</script>