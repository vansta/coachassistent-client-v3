<template>
    <v-form v-model="valid" ref="form">
        <v-card>
            <v-card-title>
                {{ t('welcome') }}
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="user.userName" :label="t('username')" :rules="[required]"></v-text-field>
                <v-text-field v-model="user.email" :label="t('email')" :rules="[required]"></v-text-field>
                <v-text-field v-model="user.password" :label="t('password')" type="password" :rules="[required]"></v-text-field>
            </v-card-text>
            <v-card-subtitle>
                {{ t('request_membership') }}
            </v-card-subtitle>
            <v-card-text>
                <v-switch v-model="newGroup" :label="t('register_with_new_group')" color="primary"></v-switch>
                <div v-show="!newGroup">
                    <v-autocomplete v-model="user.groupIds" :items="availableGroups" multiple :label="t('request_membership')" chips></v-autocomplete>
                </div>
                
                <!-- <span class="d-flex">
                    <span class="mr-16">
                        <v-btn icon="mdi-home-group-plus"></v-btn>
                    </span>
                    <span class="flex-grow-1">
                        <v-autocomplete v-model="user.groupIds" :items="availableGroups" multiple :label="t('request_membership')" chips prepend-icon="mdi-home-group-plus" @click:prepend="console.log('test')"></v-autocomplete>
                    </span>
                </span>
                <v-row>
                    <v-col>
                        
                    </v-col>
                    <v-col>
                        
                    </v-col>
                    
                </v-row> -->
            </v-card-text>
            <v-card-actions>
                <v-btn @click="register" :loading="loading">
                    {{ t('register') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useAuthenticationStore } from '@/plugins/pinia.js'
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { required } from '@/services/validation.js';

const api = inject('api');

const authenticationStore = useAuthenticationStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const loading = ref(false);
const user = ref({});
const availableGroups = ref([]);
const newGroup = ref(false);
const valid = ref(true);
const form = ref(null);

const register = () => {
    form.value.validate();
    if (!valid.value){
        return;
    }
    loading.value = true;
    api.register(user.value)
        .then(token => {
            authenticationStore.login(token);
            toast.success(t('welcome'));
            if (newGroup.value){
                router.push({ name: 'CreateGroup' });    
            }
            else{
                router.push({ name: 'Home' });
            }
        })
        .finally(() => loading.value = false);
}

api.getAvailableGroups()
    .then(resp => availableGroups.value.push(...resp.data));
</script>
