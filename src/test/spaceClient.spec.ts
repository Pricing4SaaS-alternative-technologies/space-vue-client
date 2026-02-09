import { describe, it, expect, vi } from 'vitest'
import { TokenService } from '../src/main/services/token'
import { TEST_TOKEN, updateJwtExp } from '../test/helpers'

describe('TokenService – integración real con JWT', () => {

  it('debe almacenar el payload tras llamar a update()', () => {
    const token = updateJwtExp(TEST_TOKEN, 3600)
    const service = new TokenService()

    service.update(token)

    const payload = service.getPayload()
    expect(payload).not.toBeNull()
    expect(payload?.sub).toBe('j0hnD03')
  })

  it('getKey() debe devolver una clave válida del token', () => {
    const token = updateJwtExp(TEST_TOKEN, 3600)
    const service = new TokenService()

    service.update(token)

    const features = service.getKey('features')
    expect(features).toBeDefined()
    expect(features['zoom-meetings'].eval).toBe(true)
  })

  it('evaluateFeature() debe devolver true para una feature activa', () => {
    const token = updateJwtExp(TEST_TOKEN, 3600)
    const service = new TokenService()

    service.update(token)

    const result = service.evaluateFeature('zoom-meetings')
    expect(result).toBe(true)
  })

  it('evaluateFeature() debe devolver false para una feature desactivada', () => {
    const token = updateJwtExp(TEST_TOKEN, 3600)
    const service = new TokenService()

    service.update(token)

    const result = service.evaluateFeature('zoom-automatedCaptions')
    expect(result).toBe(false)
  })

  it('evaluateFeature() debe devolver null si la feature no existe', () => {
    const token = updateJwtExp(TEST_TOKEN, 3600)
    const service = new TokenService()

    service.update(token)

    const result = service.evaluateFeature('feature-que-no-existe')
    expect(result).toBeNull()
  })

  it('getPayload() debe devolver null si el token está expirado', () => {
    const expiredToken = updateJwtExp(TEST_TOKEN, -10)
    const service = new TokenService()

    service.update(expiredToken)

    const payload = service.getPayload()
    expect(payload).toBeNull()
  })

  it('debe notificar a los listeners cuando el token cambia', () => {
    const token = updateJwtExp(TEST_TOKEN, 3600)
    const service = new TokenService()

    const listener = vi.fn()
    service.subscribe(listener)

    service.update(token)

    expect(listener).toHaveBeenCalledTimes(1)
  })

})
