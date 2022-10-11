import { createPinia, defineStore } from "pinia";
import { getToken, validateToken, getDecodedToken } from "@/services/jwt";

const pinia = createPinia();

const useAuthenticationStore = defineStore('main', {
  state: () => ({
    token: getToken(),
    user: getDecodedToken()
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
    }
  }
});



export { pinia, useAuthenticationStore }