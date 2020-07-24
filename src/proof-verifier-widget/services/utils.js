/**
 * Calculate the responsive font size
 * @param elementWidth
 * @param ratio
 * @param maxFontSize
 * @return {number}
 */
function calculateResponsiveFontSize(elementWidth, ratio = 0.08, maxFontSize = 14) {
  const elementFloatWidth = parseFloat(elementWidth);

  // Recalculate the font size of the text zone to make it responsive
  let fontsize = elementFloatWidth * ratio;
  if (fontsize > maxFontSize) {
    fontsize = maxFontSize;
  }

  return fontsize;
}

export default {
  calculateResponsiveFontSize
};
