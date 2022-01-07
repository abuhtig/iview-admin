import axios from '@/libs/request'

// 获取验证码码接口
const getCode = (sid) => {
  return axios.get('/public/getCaptcha', {
    params: {
      sid: sid
    }
  })
}
// 找回密码接口
const forget = (option) => {
  return axios.post('/login/forget', {
    ...option
  })
}
// 登录接口
const login = (info) => {
  return axios.post('/login/login', {
    ...info
  })
}
const reg = (reginfo) => {
  return axios.post('/login/reg', {
    ...reginfo
  })
}

// 获取能访问的菜单
const getRoutes = () => {
  return axios.get('/admin/getroutes')
}
export { getCode, forget, login, reg, getRoutes }
