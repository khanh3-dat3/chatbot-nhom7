let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .items');
let dots = document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function () {
  if (active < lengthItems) {
    active = active + 1;
  } else {
    active = 0;
  }
  reloadSlider();
};

prev.onclick = function () {
  if (active > 0) {
    active = active - 1;
  } else {
    active = lengthItems;
  }
  reloadSlider();
};

let refreshSlider;

function startSlider() {
  refreshSlider = setInterval(() => {
    next.click();
  }, 3000);
}
startSlider();
function reloadSlider() {
  slider.style.left = -items[active].offsetLeft + 'px';
  let lastActiveDot = document.querySelector('.slider .dots li.active');
  lastActiveDot.classList.remove('active');
  dots[active].classList.add('active');
  clearInterval(refreshSlider);
  startSlider();
}
dots.forEach((li, key) => {
    li.addEventListener('click', function () {
      active = key;
      reloadSlider();
    });
  });

