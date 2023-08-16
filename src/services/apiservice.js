import axios from 'axios';
import settings from '../../settings';
import { getToken, setToken } from '@/services/jwt';
import QS from 'qs';

import sha256 from 'crypto-js/sha256';

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

  const apiClient = axios.create({
    baseURL: settings.apiUrl,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    // paramsSerializer: (params) => { QS.stringify(params); }
  });

  apiClient.defaults.headers.common["Authorization"] = "Bearer " + getToken();

  apiClient.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        console.log('Login timed out');
        authenticationStore.logout();
      }

      throw error;
    }
  )

  return apiClient;
}

const createApiService = (apiClient) => {
    return {
        getAllExercises: function (search) {
          return apiClient.get('Exercise/Overview', {
            // paramsSerializer: function (params) {
            //   return QS.stringify(params)
            // },
            params: search
          })
        },
    
        getExercise: function (id) {
            return apiClient.get('Exercise', {
                params: { id }
            })
        },
    
        getAllSegments (search) {
            return apiClient.get('Segment/Overview', { params: search })
            .then(resp => resp.data)
        },
    
        getSegment (id) {
            return apiClient.get('Segment', {
                params: { id }
            })
                .then(resp => resp.data)
        },

        getAllTrainings (search) {
          return apiClient.get('Training/Overview', { params: search })
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

        async register({ userName, email, password, groups}) {
          const passwordHash = sha256(password).toString();
    
            const resp = await apiClient.post('Authentication/Register', {
                userName,
                email,
                passwordHash,
                groups
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