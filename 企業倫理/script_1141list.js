const playBtn = document.querySelector(".boton-elegante-play");
const browseBtn = document.querySelector(".boton-elegante");

playBtn.addEventListener("click", function() {
   
    window.open("https://youtu.be/oFm83JUQUEs?si=bLB9p6DwB6788CFf", "_blank"); 
});


browseBtn.addEventListener("click", function() {
    window.scrollBy({
        top: 600,
        left: 0,
        behavior: "smooth"
    });
});