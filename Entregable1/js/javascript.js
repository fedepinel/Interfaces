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
    let rangoBlur = document.querySelector('#blur');
    function efectoBlur() {
        sinEfecto();
        let imgData = ctx.getImageData(0, 0, img.width * escalaFoto, img.height * escalaFoto);
        let pixels = imgData.data;
        let matrizGaussiana = [[1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]];
        let w = imgData.width;
        let h = imgData.height;
        let valorRangoBlur = parseInt(rangoBlur.value, 10);
        for (let i = 0; i < valorRangoBlur; i++) {
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let ul = ((x - 1 + w) % w + w * ((y - 1 + h) % h)) * 4; // Posicion arriba-izquierda
                    let uc = ((x - 0 + w) % w + w * ((y - 1 + h) % h)) * 4; // Posicion arriba-centro
                    let ur = ((x + 1 + w) % w + w * ((y - 1 + h) % h)) * 4; // Posicion arriba-derecha
                    let ml = ((x - 1 + w) % w + w * ((y + 0 + h) % h)) * 4; // Posicion izquierda
                    let mc = ((x - 0 + w) % w + w * ((y + 0 + h) % h)) * 4; // Posicion pixel-central
                    let mr = ((x + 1 + w) % w + w * ((y + 0 + h) % h)) * 4; // Posicion derecha
                    let ll = ((x - 1 + w) % w + w * ((y + 1 + h) % h)) * 4; // Posicion abajo-izquierda
                    let lc = ((x - 0 + w) % w + w * ((y + 1 + h) % h)) * 4; // Posicion abajo-central
                    let lr = ((x + 1 + w) % w + w * ((y + 1 + h) % h)) * 4; // Posicion abajo-derecha

                    p0 = pixels[ul] * matrizGaussiana[0][0]; // arriba-izquierda
                    p1 = pixels[uc] * matrizGaussiana[0][1]; // arriba-centro
                    p2 = pixels[ur] * matrizGaussiana[0][2]; // arriba-derecha
                    p3 = pixels[ml] * matrizGaussiana[1][0]; // izquierda
                    p4 = pixels[mc] * matrizGaussiana[1][1]; // pixel central
                    p5 = pixels[mr] * matrizGaussiana[1][2]; // derecha
                    p6 = pixels[ll] * matrizGaussiana[2][0]; // abajo-izquierda
                    p7 = pixels[lc] * matrizGaussiana[2][1]; // abajo-central
                    p8 = pixels[lr] * matrizGaussiana[2][2]; // abajo-derecha
                    let red = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8) / 16;

                    p0 = pixels[ul + 1] * matrizGaussiana[0][0]; // arriba-izquierda
                    p1 = pixels[uc + 1] * matrizGaussiana[0][1]; // arriba-centro
                    p2 = pixels[ur + 1] * matrizGaussiana[0][2]; // arriba-derecha
                    p3 = pixels[ml + 1] * matrizGaussiana[1][0]; // izquierda
                    p4 = pixels[mc + 1] * matrizGaussiana[1][1]; // pixel central
                    p5 = pixels[mr + 1] * matrizGaussiana[1][2]; // derecha
                    p6 = pixels[ll + 1] * matrizGaussiana[2][0]; // abajo-izquierda
                    p7 = pixels[lc + 1] * matrizGaussiana[2][1]; // abajo-central
                    p8 = pixels[lr + 1] * matrizGaussiana[2][2]; // abajo-derecha
                    let green = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8) / 16;

                    p0 = pixels[ul + 2] * matrizGaussiana[0][0]; // arriba-izquierda
                    p1 = pixels[uc + 2] * matrizGaussiana[0][1]; // arriba-centro
                    p2 = pixels[ur + 2] * matrizGaussiana[0][2]; // arriba-derecha
                    p3 = pixels[ml + 2] * matrizGaussiana[1][0]; // izquierda
                    p4 = pixels[mc + 2] * matrizGaussiana[1][1]; // pixel central
                    p5 = pixels[mr + 2] * matrizGaussiana[1][2]; // derecha
                    p6 = pixels[ll + 2] * matrizGaussiana[2][0]; // abajo-izquierda
                    p7 = pixels[lc + 2] * matrizGaussiana[2][1]; // abajo-central
                    p8 = pixels[lr + 2] * matrizGaussiana[2][2]; // abajo-derecha
                    let blue = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8) / 16;

                    pixels[mc] = red;
                    pixels[mc + 1] = green;
                    pixels[mc + 2] = blue;
                    pixels[mc + 3] = pixels[lc + 3];
                }
            }
        }
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
        let valor = rangoBrillo.value;
        for (let i = 0; i < pixels.length; i++) {
            pixels[i * 4] = pixels[i * 4] * valor;
            pixels[i * 4 + 1] = pixels[i * 4 + 1] * valor;
            pixels[i * 4 + 2] = pixels[i * 4 + 2] * valor;
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
        let value = parseInt(rangoSaturacion.value, 10);
        for (let i = 0; i < pixels.length; i += 4) {
            let colorRgb = [pixels[i + 0], pixels[i + 1], pixels[i + 2]]
            let colorHsv = RGBtoHSV(colorRgb);
            colorHsv[1] *= value;
            let colorfinal = HSVtoRGB(colorHsv);
            pixels[i + 0] = colorfinal[0];
            pixels[i + 1] = colorfinal[1];
            pixels[i + 2] = colorfinal[2];
        }
        ctx.putImageData(imgData, 0, 0);
    }
    btnSaturacion.addEventListener('click', efectoSaturado);

    RGBtoHSV = function (color) {
        var r, g, b, h, s, v;
        r = color[0];
        g = color[1];
        b = color[2];
        min = Math.min(r, g, b);
        max = Math.max(r, g, b);

        v = max;
        delta = max - min;
        if (max != 0)
            s = delta / max;        // s
        else {
            // r = g = b = 0        // s = 0, v is undefined
            s = 0;
            h = -1;
            return [h, s, undefined];
        }
        if (r === max)
            h = (g - b) / delta;      // between yellow & magenta
        else if (g === max)
            h = 2 + (b - r) / delta;  // between cyan & yellow
        else
            h = 4 + (r - g) / delta;  // between magenta & cyan
        h *= 60;                // degrees
        if (h < 0)
            h += 360;
        if (isNaN(h))
            h = 0;
        return [h, s, v];
    };

    HSVtoRGB = function (color) {
        var i;
        var h, s, v, r, g, b;
        h = color[0];
        s = color[1];
        v = color[2];
        if (s === 0) {
            // achromatic (grey)
            r = g = b = v;
            return [r, g, b];
        }
        h /= 60;   
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:        // case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r, g, b];
    }

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