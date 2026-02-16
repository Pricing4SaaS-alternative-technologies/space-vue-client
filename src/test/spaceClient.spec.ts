import { describe, it, expect, vi } from 'vitest'
import { SpaceClient } from '../main/clients/SpaceClient'
import { SpaceConfiguration } from '../main/types'

describe('TokenService integración real con JWT', () => {
  const config: SpaceConfiguration = {
    url: 'http://localhost:3000',
    apiKey: 'test-api-key',
    allowConnectionWithSpace:true,
    
  }

  it('must be instantiated with the correct configuration', () => {
    const spclient = new SpaceClient(config);
    expect(spclient).toBeInstanceOf(SpaceClient);
    expect(spclient['httpUrl']).toContain('/api/v1');
  })

  it('must let the subscription of new events using on()', () => {
    const client = new SpaceClient(config)
    const callback = vi.fn()

    client.on('pricing_updated', callback)

    // @ts-ignore – acceso al emitter interno
    client.emitter.emit('pricing_updated', { foo: 'bar' })

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith({ foo: 'bar' })
  })

  it('must generate the pricing token without errors', () => {
    const client = new SpaceClient(config)
    const spy = vi.spyOn(client, 'generateUserPricingToken').mockResolvedValue('token')
    client.generateUserPricingToken()

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedWith(Promise.resolve('token'))
    spy.mockRestore();
  })

})
