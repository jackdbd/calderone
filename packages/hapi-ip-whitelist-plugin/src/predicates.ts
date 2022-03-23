import ipaddr from 'ipaddr.js'

/**
 * Check whether two strings are valid IP addresses and whether they match.
 *
 * https://github.com/whitequark/ipaddr.js
 */
export const matches = (ip_a: string, ip_b: string) => {
  if (!ipaddr.isValid(ip_a)) {
    return false
  }

  if (!ipaddr.isValid(ip_b)) {
    return false
  }

  return ip_a === ip_b
}
