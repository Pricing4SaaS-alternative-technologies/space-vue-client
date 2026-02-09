import { describe, it, expect } from 'vitest';
import { TokenService } from '../src/main/services/token';
import { TEST_TOKEN } from './helpers';

describe('TokenService', () => {
  it('starts without token', () => {
    const service = new TokenService();
    expect(service.getPayload()).toBeNull();
  });

  it('updates token and exposes payload', () => {
    const service = new TokenService();
    service.update(TEST_TOKEN);

    const payload = service.getPayload();
    expect(payload).not.toBeNull();
    expect(payload?.features).toBeDefined();
  });

  it('evaluates features correctly', () => {
    const service = new TokenService();
    service.update(TEST_TOKEN);

    expect(service.evaluateFeature('zoom-meetings')).toBe(true);
    expect(service.evaluateFeature('zoom-automatedCaptions')).toBe(false);
    expect(service.evaluateFeature('non-existing-feature')).toBeNull();
  });

  it('notifies subscribers on update', () => {
    const service = new TokenService();
    let called = false;

    service.subscribe(() => {
      called = true;
    });

    service.update(TEST_TOKEN);
    expect(called).toBe(true);
  });
});
