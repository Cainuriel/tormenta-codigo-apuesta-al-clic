let clicks = 0

function generateRandomNumber() {
  return Math.floor(Math.random() * 11);
}

document.getElementById('counter').textContent = clicks;

function clickeando() {
  clicks++;
  document.getElementById('counter').textContent = clicks;

}

function comprobar() {
  let match = generateRandomNumber();
  alert(`Número de clicks: ${clicks}. Número aleatorio: ${match}`);
  location.reload();
}