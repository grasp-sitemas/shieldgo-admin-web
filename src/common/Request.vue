<script>
import axios from 'axios'

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (!error.response) {
            console.log('Please check your internet connection.')
        }

        return Promise.reject(error)
    },
)

export default {
    getDefaultHeader: vue => {
        let header = {
            'Content-Type': 'application/json',
            Authorization: vue.$session.get('token'),
        }
        if (vue.$session.get('correlationId') && vue.$session.get('correlationId') != 'undefined') {
            header['x-correlation-id'] = vue.$session.get('correlationId')
        }
        return header
    },
    do: async (vue, method, headers, params, endpoint, callbackSuccess, callbackError) => {
        try {
            let res = await axios({
                method: method,
                url: endpoint,
                headers: headers,
                data: params,
            })
            if (callbackSuccess) {
                callbackSuccess(res.data, res)
            } else {
                return res
            }
        } catch (err) {
            if (err.response && err.response.status === 401 && err.response?.data?.messageId !== 'response.user.archived' && err.response?.data?.messageId !== 'response.company.archived') {
                vue.$router.push('/')
            } else {
                if (callbackError) {
                    return callbackError(err)
                }
                return err
            }
        }
    },
}
</script>
