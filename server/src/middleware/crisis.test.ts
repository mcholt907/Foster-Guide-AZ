import { describe, it, expect } from 'vitest'
import { detectCrisis } from './crisis.js'

describe('detectCrisis — Spanish patterns', () => {
  it('detects suicidio/suicidarme', () => expect(detectCrisis('quiero suicidarme')).toBe(true))
  it('detects hacerme daño', () => expect(detectCrisis('quiero hacerme daño')).toBe(true))
  it('detects quitarme la vida', () => expect(detectCrisis('quiero quitarme la vida')).toBe(true))
  it('detects no quiero vivir', () => expect(detectCrisis('no quiero vivir más')).toBe(true))
  it('detects me están golpeando', () => expect(detectCrisis('me están golpeando en el hogar')).toBe(true))
  it('detects estoy en peligro', () => expect(detectCrisis('estoy en peligro')).toBe(true))
  it('detects no estoy seguro', () => expect(detectCrisis('no estoy seguro ahora mismo')).toBe(true))
  it('returns false for normal Spanish message', () => expect(detectCrisis('¿cuáles son mis derechos?')).toBe(false))
})
