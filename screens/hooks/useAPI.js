import axios from 'axios'

const useAPI = async (auth, method, url, request, param, accessToken) => {
    return await axios({
        baseURL: 'http://192.168.8.23:8080',
        timeout: 30000,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        method: method,
        url: url,
        data: request,
        params: param,
        validateStatus: (status) => {
            console.log(`validateStatus: ${status}`)
            if (auth) {
                if (status === 401) {
                    auth.refreshToken()
                    return true
                }else {
                    return status >= 200 && status < 300; // default
                }
            }else {
                return status >= 200 && status < 300; // default
            }
        }
    })
}

export default useAPI
