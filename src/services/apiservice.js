import axios from 'axios';
import settings from '../../settings';
import { getToken, setToken } from '@/services/jwt';
import QS from 'qs';
import sha256 from 'crypto-js/sha256';

const deconstructSearchDictionary = (search) => {
  var searchKeys = [];
  var searchValues = []
  if (search) {
    searchKeys = Object.keys(search);
    searchValues = Object.values(search)

    searchValues.forEach((value, index) => {
      if (value === undefined) {
        searchValues[index] = null
      }
    })
  }

  return { searchKeys, searchValues };
}

const createApiClient = (useAuthenticationStore) => {
  const authenticationStore = useAuthenticationStore();

  const apiClient = axios.create({
    baseURL: settings.apiUrl,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
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
        getAllExercises: function () {
            return apiClient.get('Exercise/Overview')
                .then(resp => resp.data)
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
    
        //POST
        async postExercise (exercise) {
            const formData = new FormData();
            formData.append('name', exercise.name);
            formData.append('description', exercise.description);
            exercise.attachments.forEach(a => {
                formData.append('attachments', a);
            })
    
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
            const formData = new FormData();
            formData.append('id', exercise.id);
            formData.append('name', exercise.name);
            formData.append('description', exercise.description);
            exercise.attachments.forEach(a => {
                formData.append('attachments', a);
            })
    
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
        }
    }
  }
  
  export { createApiClient, createApiService }