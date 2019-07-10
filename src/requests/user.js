import { request } from '@/utils/request'

export function userLogin (email, password) {
  return request('post', '/user/auth', {
    email: email,
    password: password
  })
}

export function userCreate (name, email, password) {
  return request('post', '/user', {
    name: name,
    email: email,
    password: password
  })
}
