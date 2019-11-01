const modeUrlObj = {
    // 生产环境
    'production': {
        baseURL: 'http://xxx:9091/pro/',
        authBaseURL: ''
    },
    // 开发环境
    'development': {
        baseURL: ' http://192.168.1.120:8080/btm-fast',
        authBaseURL: ''
    },
    // 测试环境
    'test': {
        baseURL: 'http://xxxx:9091/test/',
        authBaseURL: ''
    }
}
export default modeUrlObj[process.env.NODE_ENV]
