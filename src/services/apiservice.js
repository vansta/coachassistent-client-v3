import axios from 'axios';
import settings from '../../settings';
import { getToken, setToken } from '@/services/jwt';
// import qs from 'qs';

import sha256 from 'crypto-js/sha256';
import { useToast } from 'vue-toastification';

const toFormData = (data) => {
  console.log(data);
  var formData = new FormData();
  const keys = Object.keys(data);
  keys.forEach(k => {
    const value = data[k];
    if (value){
      if (Array.isArray(value)){
        value.forEach(v => {
          formData.append(k, v);
        })
      }
      else {
        formData.append(k, value);
      }
    }
  })

  return formData;
}

const createApiClient = (useAuthenticationStore) => {
  const authenticationStore = useAuthenticationStore();
  const toast = useToast();
  const apiClient = axios.create({
    baseURL: settings.apiUrl,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    paramsSerializer: {
      indexes: null
    }
  });

  apiClient.defaults.headers.common["Authorization"] = "Bearer " + getToken();

  apiClient.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        authenticationStore.logout();
        apiClient.defaults.headers.common["Authorization"] = null;
      }
      else {
        var message;
        if (error.message) {
          message = error.message
        }
        toast.error(message);
      }

      throw error;
    }
  )

  return apiClient;
}

const createApiService = (apiClient) => {
    return {
      async checkToken () {
        try {
          await apiClient.get('Authentication/CheckToken');
          return true;
        } 
        catch (err) {
          return false;
        }
    },
        getAllExercises: function (search, pageInfo) {
          return apiClient.get('Exercise/Overview', {
            params: { ...search, ...pageInfo }
          })
        },
    
        getExercise: function (id) {
            return apiClient.get('Exercise', {
                params: { id }
            })
        },
    
        getAllSegments (search, pageInfo) {
            return apiClient.get('Segment/Overview', { params: { ...search, ...pageInfo } })
            .then(resp => resp.data)
        },
    
        getSegment (id) {
            return apiClient.get('Segment', {
                params: { id }
            })
                .then(resp => resp.data)
        },

        getAllTrainings (search, pageInfo) {
          return apiClient.get('Training/Overview', { params: { ...search, ...pageInfo } })
          .then(resp => resp.data)
        },
    
        getTraining (id) {
            return apiClient.get('Training', {
                params: { id }
            })
                .then(resp => resp.data)
        },

        getGroupsForUser() {
          return apiClient.get('Group')
        },

        getTags(search) {
          return apiClient.get('Tag', {
            params: { search }
          })
        },
        getEditors() {
          return apiClient.get('User')
        },
        getAssignedEditors(shareableId) {
          return apiClient.get('User/AssignedEditors', {
            params: { shareableId }
          })
        },

        getSharingLevels () {
          return apiClient.get('SharingLevel');
        },

        getRoles() {
          return apiClient.get('Role');
        },
        getRolesOverview() {
          return apiClient.get('Role/Overview')
        },
        getLicensesOverview() {
          return apiClient.get('License/Overview')
        },

        getPermissions() {
          return apiClient.get('User/Permissions');
        },
        getGroups() {
          return apiClient.get('Group/Overview');
        },
        getGroup(id) {
          return apiClient.get('Group/Details', {
            params: { id }
          })
        },
        getActions() {
          return apiClient.get('Permission/Actions');
        },
        getSubjects() {
          return apiClient.get('Permission/Subjects');
        },
        getUser() {
          return apiClient.get('User/Profile');
        },
        getAvailableGroups(action) {
          return apiClient.get('Group/Available', {params: {
            action
          }});
        },
    
        //POST
        async postExercise (exercise) {
            const formData = toFormData(exercise);
    
            const resp = await apiClient.post('Exercise', formData, {
              headers: {
              'Content-type': 'multipart/form-date'
            }})
            return resp.data
        },
        copyExercise (exerciseId) {
          return apiClient.post('Exercise/Copy', exerciseId);
        },
    
        postSegment (segment) {
            return apiClient.post('Segment', segment);
        },
        postTraining (training) {
            return apiClient.post('Training', training);
        },
        postGroup(group) {
          return apiClient.post('Group', group)
        },
        requestMembership(groupId) {
          return apiClient.post('Group/RequestMembership', groupId);
        },
    
        async login ({ userName, password}) {
            const passwordHash = sha256(password).toString();

            try {
              const resp = await apiClient.post('Authentication', {
                userName,
                passwordHash
              });
              setToken(resp.data);
              apiClient.defaults.headers.common["Authorization"] = 'Bearer ' + resp.data;
              return resp.data;
            } 
            catch (err) {
              setToken('');
              apiClient.defaults.headers.common["Authorization"] = null;
              throw err;
            }
        },

        async register({ userName, email, password, groupIds}) {
          const passwordHash = sha256(password).toString();
    
            const resp = await apiClient.post('Authentication/Register', {
                userName,
                email,
                passwordHash,
                groupIds
            });
    
            setToken(resp.data);
            apiClient.defaults.headers.common["Authorization"] = 'Bearer ' + resp.data;
            return resp.data;
        },
    
        //PUT
        async putExercise (exercise) {
          const formData = toFormData(exercise);
    
            const resp = await apiClient.put('Exercise', formData, {
              headers: {
              'Content-type': 'multipart/form-date'
            }})
            return resp.data
        },
        putSegment (segment) {
            return apiClient.put('Segment', segment);
        },
        putTraining (training) {
            return apiClient.put('Training', training);
        },
        putGroup (group) {
          return apiClient.put('Group', group);
        },
        putRole(role) {
          return apiClient.put('Role', role);
        },
        putLicense(license) {
          return apiClient.put('License', license);
        },
        putUser(user) {
          return apiClient.put('User', user);
        },
        putMembershipRequest({ id, roleId }, response) {
          return apiClient.put('Group/Request', {
            id, roleId, response
          })
        },
        putFavorite(shareableId) {
          return apiClient.put('Favorite', shareableId);
        },
    
        //DELETE
        deleteExercise (id) {
            return apiClient.delete('Exercise', {
                params: { id }
            })
        },
        deleteSegment (id) {
            return apiClient.delete('Segment', {
                params: { id }
            })
        },
        deleteTraining (id) {
          return apiClient.delete('Training', {
              params: { id }
          })
        },

        logout() {
          apiClient.defaults.headers.common["Authorization"] = null;
        },
        getAttachmentLink(attachmentId) {
          if (attachmentId) {
            return settings.apiUrl + '/Attachment?id=' + attachmentId;
          }
        }
    }
  }
  
  export { createApiClient, createApiService }