export const PREFIX_API_ERROR = 'Plausible API error: '

export const apiError = (err: any): Error => {
  return new Error(`${PREFIX_API_ERROR}${err.message}`)
}
