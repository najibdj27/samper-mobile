import axios from 'axios'

const useAPI = async (method, url, request, param, accessToken) => {
    return await axios({
        baseURL: 'http://10.0.2.2:8080',
        timeout: 5000,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        method: method,
        url: url, 
        data: request,
        params: param
    })
}

export default useAPI
