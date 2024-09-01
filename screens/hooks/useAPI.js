import axios from 'axios'

const useAPI = async (method, url, request, param, accessToken) => {
    return await axios({
        baseURL: 'http://192.168.8.7:8080',
        timeout: 30000,
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
