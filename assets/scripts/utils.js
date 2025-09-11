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

function calculateScore(consecutiveMatches) {
  let points = 0;
  switch (consecutiveMatches) {
    case 1:
      points = 100;
      break;
    case 2:
      points = 250;
      break;
    case 3:
      points = 500;
      break;
    case 4:
      points = 1000;
      break;
    case 5:
    default:
      points = 5000;
      break;
  }
  return points;
}
