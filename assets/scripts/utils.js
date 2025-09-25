function calculateGrid(pairs, width, height) {
  const totalCards = pairs * 2;
  const isPortrait = height > width;
  let rows, cols;

  if (isPortrait) {
    cols = Math.min(2, totalCards);
    rows = Math.ceil(totalCards / cols);
  } else {
    rows = Math.min(2, totalCards);
    cols = Math.ceil(totalCards / rows);
  }

  const result = { rows, cols };

  return result;
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
