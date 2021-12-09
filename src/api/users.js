import axios from '@/libs/request'

// 获取验证码码接口
const getUserList = (options) => {
  return axios.post('/user/getuserlist', options)
}
const deleteUser = (ids) => {
  return axios.post('/user/deleteuser', ids)
}
const editUser = (data) => {
  return axios.post('/user/edituser', data)
}
const batchuser = (data) => {
  return axios.post('/user/batchupdate', data)
}
const checkUsername = (name) => {
  return axios.get('/user/checkusername?username=' + name)
}
const checkName = (name) => {
  return axios.get('/user/checkname?name=' + name)
}

const addUser = (data) => {
  return axios.post('/user/adduser', data)
}
export { getUserList, deleteUser, editUser, checkUsername, checkName, addUser, batchuser }
