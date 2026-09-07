const playBtn = document.querySelector(".boton-elegante-play");
const browseBtn = document.querySelector(".boton-elegante");

playBtn.addEventListener("click", function() {
   
    window.open("https://youtu.be/0iac3_y9o28?si=8OwOZIxgKqGHf_Gg", "_blank"); 
});


browseBtn.addEventListener("click", function() {
    window.scrollBy({
        top: 600,
        left: 0,
        behavior: "smooth"
    });
});