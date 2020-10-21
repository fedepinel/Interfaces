function loading() {
    setTimeout(cargarPagina, 3000);
    
    function cargarPagina() {
        let loader = document.querySelector(".contenedor-loader");
        let html = document.querySelectorAll("*");
        console.log(html);
        for (let index = 0; index < html.length-1; index++) {         
            html[index].classList.remove("esconder");
        }
        loader.classList.add("esconder");
    }
}
document.addEventListener("DOMContentLoaded", loading);