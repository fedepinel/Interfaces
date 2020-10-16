function loadPage() {

    //FUNCION COUNTDOWN
    let fechaEstreno = new Date("Jan 5, 2021 15:37:25").getTime();
    //Actualiza el contado cada un segundo
    let intervalo = setInterval(function () {

        //Obtiene la hora de la computadora *ver como lo extrae*
        let now = new Date().getTime();

        //Distancia entre la fecha establecida y la fecha de hoy
        let diferencia = fechaEstreno - now;

        // Se calculan los dias, horas, minutos y segundos
        let days = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diferencia % (1000 * 60)) / 1000);

        //Muestra los resultados
        document.getElementById("countdown").innerHTML = "Tiempo restante para el estreno! " + days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";

        //Cuando la distancia es 0, osea cuando finalizo el contador
        if (diferencia < 0) {
            clearInterval(intervalo);
            document.getElementById("countdown").innerHTML = "La pelicula ya fue estrenada!";
        }
    }, 1000);
}
document.addEventListener("DOMContentLoaded", loadPage);