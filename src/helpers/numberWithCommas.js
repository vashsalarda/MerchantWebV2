export default num => {
  return priceRound(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const priceRound = (price, dec) => {
  if (dec === undefined) {
    dec = 2;
  }
  if (price !== 0) {
    if (!price || isNaN(price)) {
      throw new Error('price is not a number' + price);
    }
  }
  const str = parseFloat(Math.round(price * 100) / 100).toFixed(dec);
  return str;
};