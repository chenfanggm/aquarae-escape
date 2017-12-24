export default {
  hexToRGB: (hex) => {
    const r = hex >> 16;
    const g = hex >> 8 & 0xFF;
    const b = hex & 0xFF;
    return {r, g, b};
  }
}