import { request } from '@/utils/request'

export function commitScore (userId, game, score) {
  return request('post', '/score/' + userId, {
    game: game,
    score: score
  })
}
