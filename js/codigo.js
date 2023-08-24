

let formaDePago;
let tarjetaCepas = document.getElementById('tarjeta');
const botonesMenu = document.querySelectorAll (".botonMenu");
const numerito = document.querySelector("#numerito");
let totalCompra = document.getElementById('total');
let subTotal = document.getElementById('subTotal');
let totalConEnvio = document.getElementById('totalConEnvio');
let montoFinal = document.getElementById('montoFinal');
let botonFinalizarCompra = document.getElementById('botonFinalizarCompra');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// RECUPERAR CARRO STORAGE
function cargarCarrito(){

    if (carrito.length != 0) {
        for (const prod of carrito){
            document.getElementById('tablabody').innerHTML +=`
            <tr>
                <td><img class='fotocarro' src=${prod.foto}></td>
                <td>${prod.nombre}</td>
                <td>${prod.precio}</td>
                <td><button id=${prod.id}  class='botonEliminar btn'>🗑️</button></td>
            </tr>`;
        }
        numerito.innerText = `${carrito.length}`;
        const sumaTotal = carrito.reduce((acumulador,semilla)=>acumulador+semilla.precio,0);
        totalCompra.innerHTML = sumaTotal;
    }
    actualizarBotonesEliminar();
    actualizarTotal();
    actualizarBotonTerminar();
    actualizarSubTotal();
}
cargarCarrito();

// STOCK

function obtenerJson (){
    const URLJSON = "./js/stock.json";
        fetch(URLJSON)
        .then(resp => resp.json())
        .then((data) => {
            const stockCepas = data.cepas;
            renderizarCepas(stockCepas);
        })
}    
obtenerJson();

function renderizarCepas(stock){

        tarjetaCepas.innerHTML ='';
        for (const item of stock){
            tarjetaCepas.innerHTML += `
                        <section class="col-sm-12 col-md-6 col-lg-4 col-xl-4 tarjeta">    
                            <div class="imagen">
                            <img class="coco" src="${item.foto}" alt="cepaFoto">
                                <div class="icono">
                                    <strong>PACK X 3<br>$ ${item.precio}</strong>
                                </div>
                            </div>
                            <div class="texto1">
                                ${item.nombre}
                            </div>
                            <div class="texto2">
                                ${item.familia}
                            </div>
                            <div class="texto3">
                                <div class="izquierda">
                                    <div>
                                        THC ${item.thc}%
                                    </div>
                                </div>
                                <div class="centro">
                                    <div>
                                        CBD ${item.cbd}%
                                    </div>
                                </div>
                                <div class="derecha">
                                    <div>
                                        ${item.tipo}
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="texto4">
                                <button id='btn${item.id}' class="comprar">
                                    <i class="fa-solid fa-cart-arrow-down" style="color: #ffffff;"></i>
                                    <span>Agregar al carrito</span>
                                </button>
                            </div>
                        </section>`;
        };

        stock.forEach((item) => {
            document.getElementById(`btn${item.id}`).addEventListener('click', () => {
                agregarACarrito(item);
            })
        });
    }


// MENU
function mostrarMenu(){
    const URLJSON = "./js/stock.json";
    fetch(URLJSON)
    .then(resp => resp.json())
    .then((data) => {
        const stockCepas = data.cepas;

            botonesMenu.forEach(opcion => {
                opcion.addEventListener ("click",() => {
                    if (opcion.id === 'inicio'){
                        renderizarCepas(stockCepas);
                    } else if (opcion.id === 'feminizadas'){
                        const feminizadas = stockCepas.filter (cepa=> cepa.sexo === 'Feminizada');
                        renderizarCepas(feminizadas);
                    } else if (opcion.id === 'regulares'){
                        const regulares = stockCepas.filter (cepa=> cepa.sexo === 'Regular');
                        renderizarCepas(regulares);
                    } else if (opcion.id === 'sativas'){
                        const sativas = stockCepas.filter (cepa=> cepa.tipo === 'Sativa');
                        renderizarCepas(sativas);
                    } else if (opcion.id === 'hibridas'){
                        const hibridas = stockCepas.filter (cepa=> cepa.tipo === 'Hibrida');
                        renderizarCepas(hibridas);
                    } else if (opcion.id === 'indicas'){
                        const indicas = stockCepas.filter (cepa=> cepa.tipo === 'Indica');
                        renderizarCepas(indicas);
                    }
                })
            });
        })
}
mostrarMenu();

// CARRITO
// ACTUALIZAR

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".botonEliminar");

    botonesEliminar.forEach(boton => {
            boton.addEventListener('click',()=>{
            const semaEliminada = carrito.find((cepa) => cepa.id == boton.id);
            eliminarDelCarrito(semaEliminada);
        });
    })
}

function actualizarBotonesAgregar(){
    cepas.forEach((item) => {
        document.getElementById(`btn${item.id}`).addEventListener('click', () => {
        agregarACarrito(item);
        })
    })    
}

function actualizarBotonTerminar(){
    document.getElementById('terminarCompra').addEventListener('click', () => {
        mostrarCompraFinal(carrito);
    });
}

function actualizarTotal() {
    const sumaTotal = carrito.reduce((acumulador,semilla)=>acumulador+semilla.precio,0);
    totalCompra.innerHTML = sumaTotal;
}

function actualizarSubTotal(){
    const sumaSubTotal = carrito.reduce((acumulador,semilla)=>acumulador+semilla.precio,0);
    subTotal.innerHTML = sumaSubTotal;
}


//AGREGAR, ELIMINAR Y VACIAR CARRITO

function eliminarDelCarrito(sema){
        const index = carrito.indexOf(sema);
        carrito.splice(index,1);
        numerito.innerText = `${carrito.length}`;
        document.getElementById('tablabody').innerHTML = ``;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    }

function agregarACarrito(semilla){
    carrito.push(semilla);
    numerito.innerText = `${carrito.length}`;
    //SWEET ALERT
    Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        iconColor: '#3085d6',
        color: '#3085d6',
        background:'#2f415b',
        toast: true,
        title: `${semilla.nombre}, agregado al carrito!`,
        showConfirmButton: false,
        timer: 1500
    })

    document.getElementById('tablabody').innerHTML +=`
        <tr>
            <td><img class='fotocarro' src=${semilla.foto}></td>
            <td>${semilla.nombre}</td>
            <td>${semilla.precio}</td>
            <td><button id= ${semilla.id} class='botonEliminar btn'>🗑️</button></td>
        </tr>`;
    const sumaTotal = carrito.reduce((acumulador,semilla)=>acumulador+semilla.precio,0);
    totalCompra.innerHTML = sumaTotal;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    actualizarBotonesEliminar();
    actualizarTotal();
    actualizarSubTotal();
    actualizarBotonTerminar();
}

function vaciarCarro(){
    carrito.splice(0, carrito.length);
    numerito.innerText = `${carrito.length}`;
    document.getElementById('tablabody').innerHTML ='';
    totalCompra.innerHTML = '';
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(carrito));
    totalConEnvio.innerHTML = '';
    montoFinal.innerHTML = '';
    actualizarTotal();
    actualizarSubTotal();
}

//TERMINAR COMPRA

function mostrarCompraFinal(){
    document.getElementById('tablabodyTerminar').innerHTML =``
    if (carrito.length != 0) {
        for (const prod of carrito){
            document.getElementById('tablabodyTerminar').innerHTML +=`
            <tr>
                <td>${prod.nombre}</td>
                <td>${prod.precio}</td>
            </tr>`;
        }
        const sumaSubTotal = carrito.reduce((acumulador,semilla)=>acumulador+semilla.precio,0);
        subTotal.innerHTML = '$'+sumaSubTotal;
        totalConEnvio.innerHTML = '$'+sumaSubTotal;
        montoFinal.innerHTML = '$'+sumaSubTotal;
    }
    elegirFormaDePagoYenvio();
}

function elegirFormaDePagoYenvio (){
    
    const radiosEnvio = document.getElementsByTagName('input');
    const sumaSubTotal = carrito.reduce((acumulador,semilla)=>acumulador+semilla.precio,0);
    let cuotas = document.getElementById('cuotas');
    let montoFinalconEnvio;

    for (const radio of radiosEnvio){
        radio.addEventListener('click',()=>{

            if (radio.id === 'flexRadioDefault1'){
                formaDePago = sumaSubTotal + 3100;
                totalConEnvio.innerHTML = '$' + formaDePago;
                montoFinal.innerHTML = '$' + formaDePago;
            } else if (radio.id === 'flexRadioDefault2'){
                formaDePago = sumaSubTotal + 3400;
                totalConEnvio.innerHTML = '$' + formaDePago;
                montoFinal.innerHTML = '$' + formaDePago;
            } else if (radio.id ==='flexRadioDefault3'){
                formaDePago = sumaSubTotal;
                totalConEnvio.innerHTML = '$' + (formaDePago);
                montoFinal.innerHTML = '$' + formaDePago;
            } else if (radio.id === 'flexRadioDefault4'){
                montoFinalconEnvio = (formaDePago * 0.9);
                montoFinal.innerHTML = '$' + montoFinalconEnvio;
                cuotas.innerHTML = ``;
            } else if (radio.id === 'flexRadioDefault5'){
                montoFinalconEnvio = formaDePago;
                montoFinal.innerHTML = '$' +  montoFinalconEnvio;
                cuotas.innerHTML = ``;
            } else if (radio.id === 'flexRadioDefault6'){
                cuotas.innerHTML =`
                <input class="form-check-input" type="radio" name="cuotas" id="flexRadioDefault7">
                <label class="form-check-label" for="flexRadioDefault7">3 cuotas</label>
                <input class="form-check-input" type="radio" name="cuotas" id="flexRadioDefault8">
                <label class="form-check-label" for="flexRadioDefault8">6 cuotas</label>`
                elegirCuotas();
            }
        })
    }
}

function elegirCuotas (){

    let totalCuotas;
    const radiosEnvio = document.getElementsByTagName('input');

    for (const radio of radiosEnvio){
        radio.addEventListener('click',()=>{
            if (radio.id === 'flexRadioDefault7'){
                totalCuotas = ((formaDePago * 1.3)/3).toFixed(2);
                montoFinal.innerHTML = '3 cuotas de $ ' +  totalCuotas;    
            } else if (radio.id === 'flexRadioDefault8'){
                totalCuotas = ((formaDePago * 1.6)/6).toFixed(2);
                montoFinal.innerHTML = '6 cuotas de $ ' +  totalCuotas;
            }
        })
    } 
}

function finalizarCompra (){

    //SWETT ALERT
    botonFinalizarCompra.onclick = () => {
        
        (async () => {

            const { value: email } = await Swal.fire({
                title: 'Ingresa tu email, nos comunicaremos lo mas pronto posible',
                input: 'email',
                inputLabel: 'Correo electronico',
                inputPlaceholder: 'Ingresa tu correo electronico',
                iconColor: '#3085d6',
                color: '#3085d6',
                background:'#2f415b',
            })
            
            if (email) {
                Swal.fire({
                    title: `Numero de orden enviado a: ${email}`,
                    iconColor: '#3085d6',
                    color: '#3085d6',
                    background:'#2f415b',
                })    
            }
            
            })()
            vaciarCarro();    
    }
}
finalizarCompra();

//FORMULARIO

const btn = document.getElementById('button');

document.getElementById('form')
.addEventListener('submit', function(event) {
    event.preventDefault();

    btn.value = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_embmagr';

    emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
        btn.value = 'Enviar';
        Swal.fire({
            title:'Gracias, recibimos tu registro.',
            color: '#3085d6',
            background:'#2f415b',
    })
    }), (err) => {
        btn.value = 'Enviar';
        Swal.fire(JSON.stringify(err));
    };
});