import Joi from 'joi'

const TAG = 'country-code'

export const country_code_2_chars = Joi.string()
  .length(2)
  // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
  .description('a ISO 3166-1 alpha-2 country code')
  .tag(TAG)
  .example('IT')

export const country_code_3_chars = Joi.string()
  .length(3)
  // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  .description('a ISO 3166-1 alpha-3 country code')
  .tag(TAG)
  .example('ITA')

export const country_code = Joi.alternatives()
  .try(country_code_2_chars, country_code_3_chars)
  // https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
  .description('a ISO 3166-1 country code')
  .tag(TAG)
