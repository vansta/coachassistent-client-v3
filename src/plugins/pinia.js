import { createPinia, defineStore } from "pinia";
import { getToken, validateToken, getDecodedToken, setToken } from "@/services/jwt";
import { setPermissions, getPermissions } from "@/services/ability";

const pinia = createPinia();

const useAuthenticationStore = defineStore('main', {
  state: () => ({
    token: getToken(),
    user: getDecodedToken(),
    permissions: getPermissions()
  }),
  getters: {
    isAuthenticated: (state) => validateToken(state.token),
    isInRole: (state) => {
      return (...roleIds) => {
        return roleIds.some(rol => {
          const roles = typeof rol == 'object' ? Object.values(rol) : rol;
          return roles.some(r => {
            return state.user.role == r.toString() || state.user.role.includes(r.toString())
          });
        });
      }
    }
  },
  actions: {
    login(value) {
      this.token = value;
      this.user = getDecodedToken(value);
    },
    logout() {
      this.token = '';
      this.permissions = [];
      setToken('');
      setPermissions([]);
    },
    setPermissions(permissions) {
      this.permissions = permissions;
      setPermissions(permissions);
    }
  }
});

const useOfflineStore = defineStore('offline', {
  state: () => ({
    training: {
      segments: []
    }
  }),
  getters: {
    getTraining: (state) => state.training
  },
  actions: {
    setTraining(value) {
      this.training = value;
    },
    pushSegment(value) {
      this.training.segments.push(value);
    }
  }
})



export { pinia, useAuthenticationStore, useOfflineStore }