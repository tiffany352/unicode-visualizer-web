export function decimalToHex (d, padding) {
  let hex = Number(d).toString(16)
  
  while (hex.length < padding) {
    hex = "0" + hex
  }
  
  return hex
}
