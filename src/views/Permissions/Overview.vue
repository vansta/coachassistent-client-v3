<template>
    <v-container>
        <v-row>
            <v-col></v-col>
            <v-col v-for="subject in subjects" :key="subject">
                {{ t(`subject.${subject.title}`) }}
            </v-col>
        </v-row>
        <v-row v-for="action in actions" :key="action">
            <v-col cols="1" class="text--break">
                {{ t(`action.${action.title}`) }}
            </v-col>
            <v-col v-for="subject in subjects" :key="subject">
                <div v-if="hasPermission(action, subject)" class="d-flex">
                    <v-checkbox-btn :disabled="!can('update', role)" v-model="dummyTrue" @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                    <v-select :disabled="!can('update', role)" v-model="getPermission(action, subject).fields" :items="subject.fields" label="Fields" hide-details multiple>
                        <template v-slot:prepend-item>
                            <v-list-item
                                :title="t('select_all')"
                                @click="toggleAll(action, subject)"
                            >
                                <template v-slot:prepend>
                                <v-checkbox-btn
                                    :indeterminate="isIndeterminate(action, subject)"
                                    :model-value="getPermission(action, subject).fields.length > 0"
                                ></v-checkbox-btn>
                                </template>
                            </v-list-item>

                            <v-divider class="mt-2"></v-divider>
                        </template>

                        <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index < (xlAndUp ? 2 : 1)">
                                <span>{{ t(`field.${item.title}`) }}</span>
                            </v-chip>
                            <span
                                v-if="index === (xlAndUp ? 2 : 1)"
                                class="text-grey text-caption align-self-center"
                            >
                                (+{{ getPermission(action, subject).fields.length - (xlAndUp ? 2 : 1) }})
                            </span>
                        </template>
                    </v-select>
                </div>
                <div v-else class="d-flex">
                    <v-checkbox-btn :disabled="!can('update', role)" @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useAbility } from '@casl/vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { ref } from 'vue';

const { can } = useAbility();
const { t } = useI18n();
const { xlAndUp } = useDisplay();

const props = defineProps({
    permissions: Array,
    actions: Array,
    subjects: Array,
    role: Object
});

const dummyTrue = ref(true);

const hasPermission = (action, subject) => {
    return props.permissions.findIndex(p => p.subjectId == subject.value && p.actionId == action.value) >= 0;
};
const getPermission = (action, subject) => {
    var index = props.permissions.findIndex(p => p.subjectId == subject.value && p.actionId == action.value);
    return props.permissions[index] ?? { fields: []};
};
const onToggle = (action, subject) => {
    var permissionIndex = this.permissions.findIndex(p => p.subjectId == subject.value && p.actionId == action.value);
    if (permissionIndex < 0) {
        props.permissions.push({ actionId: action.value, subjectId: subject.value, fields: subject.fields.map(f => f.value) });
    }
    else{
        props.permissions.splice(permissionIndex, 1);
    }
}
const toggleAll = (action, subject) => {
    var permission = getPermission(action, subject);
    if (permission.fields.length === subject.fields.length) {
        permission.fields = [];
    }
    else {
        permission.fields = subject.fields.map(f => f.value);
    }
}
const isIndeterminate = (action, subject) => {
    var permission = getPermission(action, subject);
    return permission.fields.length > 0 && permission.fields.length !== subject.fields.length;
}
</script>
