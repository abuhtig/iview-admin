import axios from '@/libs/request'
import qs from 'qs'

const getTableData = (options) => {
  return axios.get('/public/adlist?' + qs.stringify(options))
}

const deletePost = (id) => {
  return axios.get('/content/deletepost?tid=' + id)
}

const editpost = (data) => {
  return axios.post('content/editpostbyid', data)
}

const editLabel = (data) => {
  return axios.post('content/editlabel', data)
}
const getLabel = (options) => {
  return axios.get('public/getlabel?' + qs.stringify(options))
}

const addLabel = (data) => {
  return axios.post('content/addLabel', data)
}

const deleteLabel = (id) => {
  return axios.get('/content/deletelabel?_id=' + id)
}
export { getTableData, deletePost, editpost, editLabel, getLabel, addLabel, deleteLabel }
