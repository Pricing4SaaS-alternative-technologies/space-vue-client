import { describe, it, expect, beforeEach } from 'vitest';
import { TokenService } from '../main/services/token'
import { createFakeJwt, TEST_TOKEN, updateJwtExp } from '../test/utils/tokenHelpers'
import { create } from 'domain';


const validPayload = {
  // evitamos que el token reviente hasta 1h
  exp: Math.floor(Date.now() / 1000) + 3600, 
  "features": {
    "evaluable-feature": {"eval": true},
    "not-evaluable-feature": {"eval": false},
  },
  custom: "value",
}

const expiredPayload = {
  ...validPayload,
  exp: Math.floor(Date.now() / 1000) - 10, // expirado hace 10s
}

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
  })

  it('must return a null payload when there is no token', () => {
    expect(service.getPayload()).toBeNull()
  })

  it('must update the token and expose its payload', () => {
    const token = createFakeJwt(validPayload)
    service.update(token)

    const payload = service.getPayload()
    expect(payload).not.toBeNull()
    expect(payload?.features).toBeDefined()
    expect(service.getPayload()).toEqual(validPayload)
  })

  it('must return null for expired tokens', () => {
    const token = createFakeJwt(expiredPayload)
    service.update(token)

    expect(service.getPayload()).toBeNull()
  })

  it('evaluates features correctly', () => {
    const token = createFakeJwt(validPayload)
    service.update(token)

    expect(service.evaluateFeature('evaluable-feature')).toBe(true)
    expect(service.evaluateFeature('not-evaluable-feature')).toBe(false)
    expect(service.evaluateFeature('non-existing-feature')).toBeNull()
  })

  it('must return the value from the token when using getKey()', () => {
    const token = createFakeJwt(validPayload)
    service.update(token)
    expect(service.getKey('custom')).toBe("value")
  })

  it('must return null from getKey() if the token is not valid', () => {
    expect(service.getKey('custom')).toBeNull()
  })

  it('must return false if the token is not valid', () => {
    expect(service.evaluateFeature('evaluable-feature')).toBe(false)
  })

  it('must return false if the feature does not exist in the token', () => {
    const token = createFakeJwt(validPayload)
    service.update(token)
    expect(service.evaluateFeature('non-existing-feature')).toBeNull()
  })

  it('notifies subscribers on update', () => {
    const service = new TokenService()
    let called = false

    service.subscribe(() => {
      called = true
    })

    service.update(TEST_TOKEN)
    expect(called).toBe(true)
  })
})
