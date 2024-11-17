import axios from 'axios'

const useAPI = async (auth, method, url, request, param, accessToken) => {
    return await axios({
        baseURL: 'http://192.168.65.99:8080',
        timeout: 70000,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        method: method,
        url: url,
        data: request,
        params: param,
    })
}

export default useAPI
