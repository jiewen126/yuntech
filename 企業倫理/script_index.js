const scrollDownBtn = document.querySelector(".hero-button");

scrollDownBtn.addEventListener("click", function() {
    window.scrollBy({
        top: 600,
        left: 0,
        behavior: "smooth"
    });
});