function loadPage() {
    let canvas = document.querySelector('#js-paint');
    let ctx = canvas.getContext('2d');
    let img;
    let escalaFoto;
    ctx.lineCap = 'round';

    //FUNCION INICIAR CANVAS
    function iniciarCanvas() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    iniciarCanvas();

    //FUNCION SELECTOR DE COLOR
    let colorPicker = document.querySelector('#js-color-picker');
    let dibujando = document.querySelector('#dibujar');
    let borrando = document.querySelector('#borrar');
    function cambiarColor() {
        let color = colorPicker.value;
        if (dibujando.checked) {
            colorPicker.disabled = false;
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
        }
        else if (borrando.checked) {
            colorPicker.disabled = true;
            ctx.globalCompositeOperation = 'destination-out';
        }
    }

    //FUNCION RELLENAR
    let btnRellenar = document.querySelector('#btn-rellenar');
    function rellenarFondo() {
        let color = colorPicker.value;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    btnRellenar.addEventListener('click', rellenarFondo);

    //FUNCION GROSOR PINCEL    
    let lineWidthRange = document.querySelector('#js-line-range');
    let lineWidthLabel = document.querySelector('#js-range-value');
    function rangoPincel() {
        let width = lineWidthRange.value;
        lineWidthLabel.innerHTML = width + " Px";
        ctx.lineWidth = width;
    }

    let x = 0, y = 0;
    let isMouseDown = false;

    function stopDrawing() {
        isMouseDown = false;
    }

    function startDrawing() {
        isMouseDown = true;
        [x, y] = [event.offsetX, event.offsetY];
    }

    function drawLine() {
        if (isMouseDown) {
            let newX = event.offsetX;
            let newY = event.offsetY;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(newX, newY);
            ctx.stroke();
            x = newX;
            y = newY;
        }
    }

    //FUNCION LIMPIAR
    let btnLimpiar = document.querySelector('#btn-limpiar');
    function limpiar() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        iniciarCanvas();
    }

    //FUNCION GUARDAR FOTO
    let saveButton = document.querySelector('#btn-guardar');
    function guardar() {
        //El prompt es parecido al alert pero te deja meter un valor
        let imageName = prompt('Ingrese el nombre de su foto');
        if (imageName.toLowerCase() != "") {
            let canvasDataURL = canvas.toDataURL();
            let a = document.createElement('a');
            a.href = canvasDataURL;
            a.download = imageName;
            a.click();
        }
        else {
            alert("Usted debe colocarle un nombre a la imagen para poder guardarla");
        }
    }

    //FUNCION CARGAR FOTO
    let input = document.querySelector('#inputCargar');
    //Vacia el canvas;
    ctx.fillStyle = "#FFFFFF"; // canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function cargarFoto() {
        document.querySelector('#inputCargar').click();
        input.onchange = e => {
            ctx.globalCompositeOperation = 'source-over';
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = readerEvent => {
                let content = readerEvent.target.result;
                let image = new Image();
                image.src = content;
    
                image.onload = function () {
                    img = this;
                    escalaFoto = Math.min(canvas.width / img.width, canvas.height / img.height);
                    ctx.drawImage(this, 0, 0, this.width * escalaFoto, this.height * escalaFoto);
                    ctx.lineCap = 'round';
                    cambiarColor();
                    rangoPincel();
                }
                limpiar();
            }
            input.value = "";
        }      
    }
    document.querySelector('#btn-cargar').addEventListener("click", cargarFoto);


    //FUNCION SIN EFECTO
    let btnLimpio = document.querySelector('#btn-sinEfecto');
    function sinEfecto() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0, img.width * escalaFoto, img.height * escalaFoto);
    }
    btnLimpio.addEventListener('click', sinEfecto);


    //FUNCION GRISES
    let btnGrises = document.querySelector('#btn-grises');
    function efectoGris() {
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let sum = pixels[i] + pixels[i + 1] + pixels[i + 2];
            let avg = parseInt(sum / 3);
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        imgData.data = pixels;
        ctx.putImageData(imgData, 0, 0);
    }
    btnGrises.addEventListener('click', efectoGris);

    //FUNCION SEPIA
    let btnSepia = document.querySelector('#btn-sepia');
    function efectoSepia() {
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            //calcula la luminosidad percibida para este pixel
            let luminosidad = .3 * pixels[i] + .6 * pixels[i + 1] + .1 * pixels[i + 2];
            pixels[i] = Math.min(luminosidad + 40, 255); // rojo
            pixels[i + 1] = Math.min(luminosidad + 15, 255); // verde	
            pixels[i + 2] = luminosidad; // azul																	
        }
        ctx.putImageData(imgData, 0, 0);
    }
    btnSepia.addEventListener('click', efectoSepia);

    //FUNCION BINARIZACION
    let btnBinarizacion = document.querySelector('#btn-binarizacion');
    function efectoBinario() {
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let color = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            if (color > 126) {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
            }
            else {
                pixels[i] = 0;
                pixels[i + 1] = 0;
                pixels[i + 2] = 0;
            }

        }
        ctx.putImageData(imgData, 0, 0);
    }
    btnBinarizacion.addEventListener('click', efectoBinario);

    //FUNCION NEGATIVO
    let btnNegativo = document.querySelector('#btn-negativo');
    function efectoNegativo() {
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i] = 255 - pixels[i]; // R
            pixels[i + 1] = 255 - pixels[i + 1]; // G
            pixels[i + 2] = 255 - pixels[i + 2]; // B

        }
        ctx.putImageData(imgData, 0, 0);
    }
    btnNegativo.addEventListener('click', efectoNegativo);

    //FUNCION BLUR
    let btnBlur = document.querySelector('#btn-blur');
    function efectoBlur() {
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;


        ctx.putImageData(imgData, 0, 0);
    }
    btnBlur.addEventListener('click', efectoBlur);

    //FUNCION BRILLO
    let rangoBrillo = document.querySelector('#brillo');
    let btnBrillo = document.querySelector('#btn-brillo');
    function brillo() {
        sinEfecto();
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        let valor = parseInt(rangoBrillo.value, 10);
        let constraste = valor;
        console.log(constraste);
        let factor = (259 * (constraste + 255)) / (255 * (259 - constraste));
        for (let i = 0; i < pixels.length; i++) {
            let r = pixels[i * 4];
            let g = pixels[i * 4 + 1];
            let b = pixels[i * 4 + 2];

            pixels[i * 4] = factor * (r - 128) + 128;
            pixels[i * 4 + 1] = factor * (g - 128) + 128;
            pixels[i * 4 + 2] = factor * (b - 128) + 128;
        }
        ctx.putImageData(imgData, 0, 0);
    }
    btnBrillo.addEventListener('click', brillo);

    //FUNCION SATURACION
    let btnSaturacion = document.querySelector('#btn-saturacion');
    let rangoSaturacion = document.querySelector('#saturacion');
    function efectoSaturado() {
        sinEfecto();
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let value = parseInt(rangoSaturacion.value, 10);
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let gray = 0.2989 * r + 0.5870 * g + 0.1140 * b; //weights from CCIR 601 spec
            pixels[i] = -gray * value + pixels[i] * (1 + value);
            pixels[i + 1] = -gray * value + pixels[i + 1] * (1 + value);
            pixels[i + 2] = -gray * value + pixels[i + 2] * (1 + value);
            //normalize over- and under-saturated values
            if (pixels[i] > 255) pixels[i] = 255;
            if (pixels[i + 1] > 255) pixels[i] = 255;
            if (pixels[i + 2] > 255) pixels[i] = 255;
            if (pixels[i] < 0) pixels[i] = 0;
            if (pixels[i + 1] < 0) pixels[i] = 0;
            if (pixels[i + 2] < 0) pixels[i] = 0;
        }
        ctx.putImageData(imgData, 0, 0);
    }
    btnSaturacion.addEventListener('click', efectoSaturado);

    saveButton.addEventListener('click', guardar);
    btnLimpiar.addEventListener('click', limpiar);
    lineWidthRange.addEventListener('input', rangoPincel);
    colorPicker.addEventListener('change', cambiarColor);
    document.querySelector('#borrar').addEventListener('click', cambiarColor);
    document.querySelector('#dibujar').addEventListener('click', cambiarColor);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

}
document.addEventListener("DOMContentLoaded", loadPage);