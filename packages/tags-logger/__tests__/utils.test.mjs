import { stmtMapper } from '../lib/utils.js'
import { EMOJI, ERROR_MESSAGE } from '../lib/constants.js'

describe('stmtMapper', () => {
  it('throws when the statement `tags` field is an empty array', () => {
    const statement = {
      message: 'a statement with no tags',
      tags: []
    }

    expect(() => {
      stmtMapper(statement)
    }).toThrowError(ERROR_MESSAGE.NO_TAG_MATCHED_KNOWN_SEVERITY_LEVEL)
  })

  it('throws when the statement `tags` only contains one severity tag', () => {
    const statement = {
      message: 'a statement with just one severity tag',
      tags: ['info']
    }

    expect(() => {
      stmtMapper(statement)
    }).toThrowError(ERROR_MESSAGE.TAGS_IS_EMPTY_ARRAY)
  })

  it('throws when the statement `tags` only contains severity tags', () => {
    const statement = {
      message: 'a statement with just severity tags',
      tags: ['debug', 'info', 'error']
    }

    expect(() => {
      stmtMapper(statement)
    }).toThrowError(ERROR_MESSAGE.TAGS_IS_EMPTY_ARRAY)
  })

  it('returns the expected emoji, severity and tags when the statement `tags` contains both a severity tag and a non-severity tag', () => {
    const statement = {
      message: 'a statement with a severity `ingo` tag and a `foo` tag',
      tags: ['info', 'foo']
    }

    const { emoji, severity, tags } = stmtMapper(statement)

    expect(emoji).toBe(EMOJI['info'])
    expect(severity).toBe('info')
    expect(tags).toContain('foo')
    expect(tags).not.toContain('info')
  })
})
