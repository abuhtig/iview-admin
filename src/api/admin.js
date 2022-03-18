import axios from '@/libs/request'

const addMenu = (data) => {
  return axios.post('/admin/addMenu', data)
}
const deleteMenu = (id) => {
  return axios.get('/admin/deleteMenu?_id=' + id)
}
const updataMenu = (data) => {
  return axios.post('/admin/updataMenu', data)
}
const getMenus = () => {
  return axios.get('/admin/getMenus')
}
const addRoles = (data) => {
  return axios.post('/admin/addRoles', data)
}
const deleteRoles = (id) => {
  return axios.get('/admin/deleteRoles?_id=' + id)
}
const updataRoles = (data) => {
  return axios.post('/admin/updataRoles', data)
}
const getRoles = () => {
  return axios.get('/admin/getRoles')
}
const getRolesName = () => {
  return axios.get('/admin/getRolesName')
}
const getcomment = (option) => {
  return axios.post('/admin/getcomment', option)
}
const editComment = (data) => {
  return axios.post('/admin/editComment', data)
}
const deleteComment = (id) => {
  return axios.get('/admin/deleteComment?_id=' + id)
}
const batchEditComment = (data) => {
  return axios.post('/admin/batchEditComment', data)
}
const batchDeleteComment = (ids) => {
  return axios.post('/admin/batchDeleteComment', ids)
}
const getStats = () => {
  return axios.get('/admin/getStats')
}
const getlogs = () => {
  return axios.get('/admin/getLogs')
}
const deleteLogs = (ids) => {
  return axios.post('/admin/deleteLogs', ids)
}
const uploadImg = (formData) => {
  return axios.post('/admin/uploadImg', formData)
}
const uploadAdvert = (formData) => {
  return axios.post('/admin/uploadAdvert', formData)
}
const deleteAdvert = (ids) => {
  return axios.post('/admin/deleteAdvert', ids)
}
const getAdvert = () => {
  return axios.get('/public/getAdvert')
}

export { addMenu,
  updataMenu,
  deleteMenu,
  getMenus,
  addRoles,
  deleteRoles,
  updataRoles,
  getRoles,
  getRolesName,
  getcomment,
  editComment,
  deleteComment,
  batchEditComment,
  batchDeleteComment,
  getStats,
  getlogs,
  deleteLogs,
  uploadImg,
  uploadAdvert,
  getAdvert,
  deleteAdvert
}
