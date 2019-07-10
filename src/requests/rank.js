import { request } from '@/utils/request'

export function scoreList (game, period, page = 1) {
  return request('get', '/score', {
    game: game,
    start_at: period[0].toJSON(),
    end_at: period[1].toJSON(),
    page: page
  })
}
