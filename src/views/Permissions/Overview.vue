<template>
    <v-container>
        <v-row>
            <v-col></v-col>
            <v-col v-for="subject in subjects" :key="subject">
                {{ t(`subject.${subject.title}`) }}
            </v-col>
        </v-row>
        <v-row v-for="action in actions" :key="action">
            <v-col>
                {{ t(`action.${action.title}`) }}
            </v-col>
            <v-col v-for="subject in subjects" :key="subject">
                <div v-if="hasPermission(action, subject)" class="d-flex">
                    <v-checkbox-btn :disabled="!can('update', role)" v-model="dummyTrue" @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                    <v-select :disabled="!can('update', role)" v-model="getPermission(action, subject).fields" :items="subject.fields" label="Fields" hide-details multiple :item-title="option => t(`field.${option}`)"></v-select>
                </div>
                <div v-else class="d-flex">
                    <v-checkbox-btn :disabled="!can('update', role)" @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
export default {
    setup() {
        const { can } = useAbility();
        const { t } = useI18n();
        return { can, t };
    },
    props: {
        permissions: Array,
        actions: Array,
        subjects: Array,
        role: Object
    },
    created () {

    },
    data () {
        return {
            dummyTrue: true
        }
    },
    methods: {
        hasPermission(action, subject) {
            return this.permissions.findIndex(p => p.subjectId == subject.value && p.actionId == action.value) >= 0;
        },
        getPermission(action, subject) {
            var index = this.permissions.findIndex(p => p.subjectId == subject.value && p.actionId == action.value);
            return this.permissions[index] ?? { fields: []};
        },
        onToggle(action, subject) {
            var permissionIndex = this.permissions.findIndex(p => p.subjectId == subject.value && p.actionId == action.value);
            if (permissionIndex < 0) {
                this.permissions.push({ actionId: action.value, subjectId: subject.value, fields: subject.fields });
            }
            else{
                this.permissions.splice(permissionIndex, 1);
            }
        }
    }
}
</script>