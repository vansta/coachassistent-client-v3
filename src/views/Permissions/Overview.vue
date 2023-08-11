<template>
    <!-- <v-table>
        <thead>
            <tr>
                <th></th>
                <th v-for="subject in subjects" :key="subject">
                    {{ subject.title }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="action in actions" :key="action">
                <td>
                    {{ action.title }}
                </td>
                <td v-for="subject in subjects" :key="subject">
                    <div class="d-flex">
                        <v-checkbox-btn v-if="hasPermission(action, subject)" v-model="dummyTrue" @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                        <v-checkbox-btn v-else @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                        <v-select v-if="hasPermission(action, subject)" :items="subject.fields" label="Fields" hide-details></v-select>
                    </div>
                </td>
            </tr>
        </tbody>
    </v-table> -->
    <v-container>
        <v-row>
            <v-col></v-col>
            <v-col v-for="subject in subjects" :key="subject">
                {{ subject.title }}
            </v-col>
        </v-row>
        <v-row v-for="action in actions" :key="action">
            <v-col>
                {{ action.title }}
            </v-col>
            <v-col v-for="subject in subjects" :key="subject">
                <div v-if="hasPermission(action, subject)" class="d-flex">
                    <v-checkbox-btn v-model="dummyTrue" @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                    <v-select v-model="getPermission(action, subject).fields" :items="subject.fields" label="Fields" hide-details multiple></v-select>
                </div>
                <div v-else class="d-flex">
                    <v-checkbox-btn @click="onToggle(action, subject)" class="pe-2"></v-checkbox-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}
export default {
    setup() {
        
    },
    props: {
        permissions: Array,
        actions: Array,
        subjects: Array
    },
    created () {
        // this.permissions.forEach(p => {
        //     var dummyAction = this.dummy[p.actionId];
        //     if (!dummyAction){
        //         dummyAction = {};
        //         this.dummy[p.actionId] = dummyAction;
        //     }
        //     var dummySubject = dummyAction[p.subjectId];
        //     if (!dummySubject) {
        //         dummySubject = true;
        //         dummyAction[p.subjectId] = dummySubject;
        //     }
        // })
    },
    data () {
        return {
            dummyTrue: true
            // permissions: []
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