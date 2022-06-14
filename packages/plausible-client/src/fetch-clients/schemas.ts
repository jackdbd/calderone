import Joi from 'joi'

export const fetchOptions = Joi.object()

// eleventyFetch options JUST for the Plausible API (e.g. `type` is not an
// option, since it is ALWAYS JSON)
export const eleventyFetchOptions = Joi.object().keys({
  // https://www.11ty.dev/docs/plugins/fetch/#cache-directory
  directory: Joi.string().min(1),

  // https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration
  duration: Joi.string().min(2),

  fetchOptions,

  // https://www.11ty.dev/docs/plugins/fetch/#verbose-output
  verbose: Joi.boolean()
})
