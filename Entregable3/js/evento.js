function loadPage(){
    // Acordeon
    let acordeon = document.getElementsByClassName("acordeon");
    for (let i = 0; i < acordeon.length; i++) {
        acordeon[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", loadPage);
