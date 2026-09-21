let productos = [];
let carrito = [];

const contenedorProductos = document.getElementById('product-container');
const formularioBusqueda = document.getElementById('form-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const mensajeError = document.getElementById('mensaje-error');

//Asignar eventos onclick a los botones estáticos
function vincularBotonesEstaticos() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

//Cargar catálogo desde JSON local con Fetch API
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        if (!respuesta.ok) throw new Error('No se pudo cargar el archivo JSON');
        
        productos = await respuesta.json();
        renderizarProductos(productos);
    } catch (error) {
        mensajeError.innerHTML = `<div class="alert alert-warning text-center my-3" role="alert">
            No pudimos conectar con la base de datos externa. Cargando catálogo en modo local...
        </div>`;
        
        console.warn("Aviso Fetch:", error.message);
        productos = [
            { id: 1, nombre: "Bolsa Negro Conejo", precio: 10500, imagen: "assets/imgs/img1.jpg" },
            { id: 2, nombre: "Bolsa Malla", precio: 12000, imagen: "assets/imgs/img2.jpg" },
            { id: 3, nombre: "Bolsa Hasta los huevos", precio: 15000, imagen: "assets/imgs/img3.jpg" },
            { id: 4, nombre: "Bolsa Porta Vino", precio: 17500, imagen: "assets/imgs/img4.jpg" },
            { id: 5, nombre: "Bolsa Verde Cocodrilo", precio: 11900, imagen: "assets/imgs/img5.jpg" },
            { id: 6, nombre: "Bolsa Just Brown", precio: 11900, imagen: "assets/imgs/img6.jpg" }
        ];
        vincularBotonesEstaticos();
    }
}

function renderizarProductos(arrayProductos) {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = '';

    if (arrayProductos.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>`;
        return;
    }

    arrayProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('col-12', 'col-md-4');
        card.innerHTML = `
          <div class="card h-100">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title">${producto.nombre}</h5>
                <a href="https://www.instagram.com/"><i class="fa-brands fa-instagram text-muted"> todobolsas</i></a>
              </div>
              <button class="btn btn-outline-dark w-100 mt-3 btn-agregar" data-id="${producto.id}">Añadir al carrito</button>
            </div>
            <div class="card-footer text-end">
              <small class="text-muted">Precio: $${producto.precio.toLocaleString('es-CL')}</small>
            </div>
          </div>
        `;
        contenedorProductos.appendChild(card);
    });

    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

//Función para añadir ítems al carrito
function agregarAlCarrito(evento) {
    const idProducto = parseInt(evento.target.getAttribute('data-id'));
    const productoSeleccionado = productos.find(p => p.id === idProducto);
    
    if (productoSeleccionado) {
        carrito.push(productoSeleccionado);
        actualizarCarritoDOM();
    }
}

//Actualizar el menú lateral y contador del carrito
function actualizarCarritoDOM() {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach((item) => {
        total += item.precio;
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
            <span>${item.nombre}</span>
            <span class="badge bg-dark rounded-pill">$${item.precio.toLocaleString('es-CL')}</span>
        `;
        listaCarrito.appendChild(li);
    });

    totalCarrito.textContent = total.toLocaleString('es-CL');
    contadorCarrito.textContent = carrito.length;
}

function filtrarProductos() {
    const textoBuscado = inputBusqueda.value.toLowerCase().trim();
    
    if (textoBuscado === '') {
        renderizarProductos(productos);
    } else {
        const productosFiltrados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(textoBuscado)
        );
        renderizarProductos(productosFiltrados);
    }
}

if (formularioBusqueda) {
    formularioBusqueda.addEventListener('submit', (evento) => {
        evento.preventDefault();
        filtrarProductos();
    });
}

if (inputBusqueda) {
    inputBusqueda.addEventListener('input', filtrarProductos);
}

// Inicializar la aplicación
cargarProductos();