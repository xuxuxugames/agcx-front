import { request } from '@/utils/request'

export function getTest () {
  return request('get', 'rank', {})
}
