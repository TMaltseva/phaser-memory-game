function calculateGrid(pairs) {
  const totalCards = pairs * 2;
  let bestRows = 1;
  let bestCols = totalCards;
  let bestRatio = totalCards;

  for (let rows = 1; rows <= totalCards; rows++) {
    if (totalCards % rows === 0) {
      let cols = totalCards / rows;
      let ratio = Math.max(rows, cols) / Math.min(rows, cols);

      if (ratio < bestRatio) {
        bestRatio = ratio;
        bestRows = rows;
        bestCols = cols;
      }
    }
  }

  return { rows: bestRows, cols: bestCols };
}
