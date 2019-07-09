import { request } from '@/utils/request'

export function scoreList (game, startAt, endAt, page = 1) {
  return request('get', '/score', {
    page: page
  })
}
