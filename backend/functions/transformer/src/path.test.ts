import { toPath } from './path'
import { pad } from './index'

test('renders valid paths', () => {
  expect(
    toPath('foobar', {
      day: pad(1),
      hour: pad(2),
    })
  ).toEqual('foobar/day=01/hour=02/')
})
