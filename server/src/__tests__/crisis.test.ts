import { describe, it, expect } from 'vitest'
import { detectCrisis } from '../middleware/crisis.js'

describe('detectCrisis', () => {
  it('detects explicit self-harm language', () => {
    expect(detectCrisis('I want to hurt myself')).toBe(true)
    expect(detectCrisis('thinking about suicide')).toBe(true)
    expect(detectCrisis("I don't want to live anymore")).toBe(true)
  })

  it('detects abuse disclosures', () => {
    expect(detectCrisis('my foster parent hit me')).toBe(true)
    expect(detectCrisis('someone is abusing me')).toBe(true)
  })

  it('detects crisis phrases', () => {
    expect(detectCrisis('kill myself')).toBe(true)
  })

  it('does not false-positive on normal foster care questions', () => {
    expect(detectCrisis('when is my next court hearing')).toBe(false)
    expect(detectCrisis('what are my rights to see my siblings')).toBe(false)
    expect(detectCrisis('how do I apply for ETV')).toBe(false)
  })
})
