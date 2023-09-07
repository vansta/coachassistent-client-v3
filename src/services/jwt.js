const tokenName = 'ca-token';

import jwtDecode from "jwt-decode";

const getToken = () => {
    return localStorage.getItem(tokenName);
}

const validateToken = (token) => {

    if (!token) {
        token = getToken();
    }
    
    return !!token;
}

const setToken = (token) => {
    localStorage.setItem(tokenName, token)
}

const getDecodedToken = (token) => {
    if (!token) {
        token = getToken();
    }
    if (token){
        var decoded = jwtDecode(token);
        return decoded;
    }
    
}

export {
    getToken, validateToken, setToken, getDecodedToken
}