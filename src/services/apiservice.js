import axios from 'axios';
import settings from '../../settings';
import { getToken, setToken } from '@/services/jwt';
import qs from 'qs';

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
    paramsSerializer: (params) => { console.log('qs'); qs.stringify(params); }
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
            params: search
          })
        },
    
        getExercise: function (id) {
            return apiClient.get('Exercise', {
                params: { id }
            })
            .then(resp => resp.data)
        },
    
        getAllSegments () {
            return apiClient.get('Segment/Overview')
            .then(resp => resp.data)
        },
    
        getSegment (id) {
            return apiClient.get('Segment', {
                params: { id }
            })
                .then(resp => resp.data)
        },

        getAllTrainings () {
          return apiClient.get('Training/Overview')
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

        getSharingLevels () {
          return apiClient.get('SharingLevel');
        },

        getRoles() {
          return apiClient.get('Role');
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