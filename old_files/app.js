
document.getElementById("language").addEventListener("change", function () {
  const selectedLang = this.value;
  
  if (selectedLang === 'fr') {
    window.location.href = '/index.html';
  } else if (selectedLang === 'tr') {
    window.location.href = '/index_tr.html';
  }
});
/*=============  SLIDER ============================*/
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

/*=========================================*/
const btn = document.querySelector(".btn_up");

btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});




var copy = document.querySelector(".logos-slide").cloneNode(true);
document.querySelector(".logos").appendChild(copy);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
      }
    });
  },
  { threshold: 0.5 }
); // se declenche a partir de 50% de l'élément visible

const valueDisplays = document.querySelectorAll(".num");

function startCounter(element) {
  let valueDisplay = element;
  let startValue = 0;
  let endValue = parseInt(valueDisplay.getAttribute("data-val"));
  let interval = 4000;
  let duration = Math.floor(interval / endValue);

  valueDisplay.textContent = 0; // Réinitialisation du texte avant de commencer le compteur

  let counter = setInterval(function () {
    startValue += 9;
    valueDisplay.textContent = startValue;
    if (startValue >= endValue) {
      clearInterval(counter);
      valueDisplay.textContent = endValue;
    }
  }, duration);
}

valueDisplays.forEach((el) => observer.observe(el));

window.onload = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  });

  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));
};

function myFunction() {
  var x = document.getElementById("myLinks");
  // Vérifie si le menu est déjà ouvert
  if (x.classList.contains("show")) {
    x.classList.remove("show"); // Ferme le menu
  } else {
    x.classList.add("show"); // Ouvre le menu avec animation
  }
}

document
  .getElementById("language-mobile")
  .addEventListener("change", function () {
    const selectedLang = this.value;
    window.location.href = `/index_${selectedLang}.html`;
  });


document.addEventListener("DOMContentLoaded", function() {
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburgerIcon.addEventListener('click', function() {
    mobileNav.classList.toggle('open');
  });
});


