import axios from '@/libs/request'
import qs from 'qs'

const getTableData = (options) => {
  return axios.get('/public/adlist?' + qs.stringify(options))
}

const deletePosts = (ids) => {
  return axios.post('/content/deleteposts', ids)
}
const deletePost = (tid) => {
  return axios.get('/content/deletepost?tid=' + tid)
}

const editpost = (data) => {
  return axios.post('/content/editpostbyid', data)
}
const batchPosts = (data) => {
  return axios.post('/content/batchposts', data)
}
const editLabel = (data) => {
  return axios.post('/content/editlabel', data)
}
const getLabel = (options) => {
  return axios.get('public/getlabel?' + qs.stringify(options))
}

const addLabel = (data) => {
  return axios.post('/content/addLabel', data)
}

const deleteLabel = (id) => {
  return axios.get('/content/deletelabel?_id=' + id)
}
export { getTableData, deletePost, deletePosts, editpost, editLabel, getLabel, addLabel, deleteLabel, batchPosts }
