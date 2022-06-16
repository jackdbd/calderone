interface Config {
  minute_min?: number
  minute_max?: number
  hour_min?: number
  hour_max?: number
}

export const randomSchedule = (config?: Config) => {
  const minute_min = config && config.minute_min ? config.minute_min : 0
  const minute_max = config && config.minute_max ? config.minute_max : 59
  const hour_min = config && config.hour_min ? config.hour_min : 3
  const hour_max = config && config.hour_max ? config.hour_max : 6

  const minute_range = minute_max - minute_min
  const minute = Math.floor(Math.random() * minute_range + minute_min)
  const hour_range = hour_max - hour_min
  const hour = Math.floor(Math.random() * hour_range + hour_min)

  return `${minute} ${hour} * * *`
}
