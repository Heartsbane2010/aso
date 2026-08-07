const slides = document.querySelectorAll('.slide');
const prevIcon = document.querySelector('.prev-icon');
const nextIcon = document.querySelector('.next-icon');

let currentIndex = 0;

function changeSlide(nextIndex) {
    // Remove classes from the current Index
    slides[currentIndex].classList.remove('active', 'exit-left');

    // Optional: adds left exit animation to make it look continuous
    if (nextIndex > currentIndex || (currentIndex === slides.length -1 && nextIndex === 0)) {
        slides[currentIndex].classList.add('exit-left');
    }

    //Update the current index
    currentIndex = nextIndex;

    // Reset the new slide's classes so it slides into view from the right
    slides[currentIndex].classList.add('active');
    slides[currentIndex].classList.remove('exit-left');
};

nextIcon.addEventListener('click', () => {
  // Uses modulo to cycle forward seamlessly
  const nextIndex = (currentIndex + 1) % slides.length;
  changeSlide(nextIndex);
});

prevIcon.addEventListener('click', () => {
  // Uses modulo math to cycle backward seamlessly
  const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
  changeSlide(prevIndex);
});