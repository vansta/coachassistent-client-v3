import axios from 'axios';
import settings from '../../settings';
import { getToken, setToken } from '@/services/jwt';
import QS from 'qs';

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
        setToken('');
        authenticationStore.login('');
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
    
        //POST
        async postExercise (exercise) {
            const formData = new FormData();
            formData.append('name', exercise.name);
            formData.append('description', exercise.description);
            exercise.attachments.forEach(a => {
                formData.append('attachments', a);
            })
    
            const resp = await apiClient.post('Exercise', formData)
            return resp.data
        },
    
        postSegment (segment) {
            return apiClient.post('Segment', segment);
        },
    
        async login ({ userName, password}) {
            
            const passwordHash = sha256(password).toString();// createHash('sha256').update(password).digest('hex');
    
            console.log(passwordHash)
            const resp = await apiClient.post('Authentication', {
                userName,
                passwordHash
            });
    
            console.log(resp);
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
    
            const resp = await apiClient.put('Exercise', formData)
            return resp.data
        },
        putSegment (segment) {
            return apiClient.put('Segment', segment);
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
        }
    }
  }
  
  export { createApiClient, createApiService }