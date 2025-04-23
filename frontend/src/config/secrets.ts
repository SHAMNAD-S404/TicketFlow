
const secrets = {
    APIGATEWAY_URL : import.meta.env.VITE_API_GATE_WAY_URL,
    COMMUNICATION_SERVICE : import.meta.env.VITE_COMMUNICATION_SERVER,
    PAYMENT_SUCCESS_URL : import.meta.env.VITE_PAYMENT_SUCCESS_URL,
    PAYMENT_CANCEL_URL : import.meta.env.VITE_PAYMENT_CANCEL_URL,

}

export default secrets;