import axios from '@/libs/request'

export const login = ({ userinfo }) => {
  const data = {
    ...userinfo
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.get('/public/getinfo', {
    headers: {
      'Authorization': 'Beaerer ' + token
    }
  })
}

// export const logout = (token) => {
//   return axios.request({
//     url: 'logout',
//     method: 'post'
//   })
// }

// export const getUnreadCount = () => {
//   return axios.request({
//     url: 'message/count',
//     method: 'get'
//   })
// }

// export const getMessage = () => {
//   return axios.request({
//     url: 'message/init',
//     method: 'get'
//   })
// }

// export const getContentByMsgId = msg_id => {
//   return axios.request({
//     url: 'message/content',
//     method: 'get',
//     params: {
//       msg_id
//     }
//   })
// }

// export const hasRead = msg_id => {
//   return axios.request({
//     url: 'message/has_read',
//     method: 'post',
//     data: {
//       msg_id
//     }
//   })
// }

// export const removeReaded = msg_id => {
//   return axios.request({
//     url: 'message/remove_readed',
//     method: 'post',
//     data: {
//       msg_id
//     }
//   })
// }

// export const restoreTrash = msg_id => {
//   return axios.request({
//     url: 'message/restore',
//     method: 'post',
//     data: {
//       msg_id
//     }
//   })
// }
