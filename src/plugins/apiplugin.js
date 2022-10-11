import { createApiClient, createApiService } from '@/services/apiservice.js';

export default {
    install: (app, { useAuthenticationStore }) => {
        const apiClient = createApiClient(useAuthenticationStore);
        app.config.globalProperties.$api = createApiService(apiClient);
    }
}