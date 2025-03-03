//variables globales
const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let descripcionInput = d.querySelector(".descripcion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table tbody");

//agregar evento click al boton del formulario
btnGuardar.addEventListener("click", () => {
    //alert(clienteInput.value);
    let datos = validarFormulario();
    if (datos != null){
        guardarDatos( datos );
    }
    borrarTabla();
    mostrarDatos();
});

//fucncion para validar los campos del formulario
function validarFormulario(){
    let datosForm;
    if( clienteInput.value == "" ||productoInput.value == "" || precioInput.value == "" || imagenInput.value == "" ){
        alert("Todos los campos del formulario son obligatorios")

    }else{
        datosForm = {
            cliente : clienteInput.value,
            producto : productoInput.value,
            precio : precioInput.value,
            imagen : imagenInput.value,
            descripcion : descripcionInput.value
        }
    
    console.log(datosForm);
    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    descripcionInput.value = "";

    return datosForm;
    }
}

//funcion guardar los datos en localStorage
const listadoPedidios = "Pedidos";
function guardarDatos( datos ){
    let pedidos = [];
    //extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidios));
    //validar los datos guardados previamente en localStorage
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    //agregar el pedido nuevo al array
    pedidos.push(datos);
    //guardar en localStorage
    localStorage.setItem(listadoPedidios, JSON.stringify(pedidos));
    //validar que los datos fueron guardados
    alert("Datos guardados con exito");
}

//funcion para extraer los datos guardados en el localStorage
function mostrarDatos(){
    let pedidos = [];
    //extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidios));
    //validar los datos guardados previamente en localStorage
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    //console.log(pedidos);
    //mostrar los datos en la tabla
    pedidos.forEach((p,i)=>{
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i+1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td> <img src ="${p.imagen}" width="50%"</td>
            <td>${p.descripcion}</td>
            <td>
                <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning"> 📝 </span>
                <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger"> ❌ </span>
            </td>
           
        `;
        tabla.appendChild(fila);
    });
}

//quitar datos de la tabla
function borrarTabla(){
    let filas = d.querySelectorAll(".table tbody tr");
    //console.log(filas)
    filas.forEach((f)=>{
        f.remove();
    });
}


//funcion eliminar pedido en la tabla
function eliminarPedido( pos ) {
    let pedidos = [];
    //extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidios));
    //validar los datos guardados previamente en localStorage
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    //confirmar pedido a eliminar
    let confirmar = confirm("¿Desear eliminar el pedido del cliente: "+pedidos[pos].cliente +"?");
    if(confirmar){
        //alert("lo eliminaste");
        pedidos.splice(pos,1);
        alert("Pedido eliminado con exito");
        //guardar los datos que quedaron en localStorage
        localStorage.setItem(listadoPedidios, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();

       
    }
}

//actualizar pedido de localStorage
function actualizarPedido(pos){
    let pedidos = [];
    //extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidios));
    //validar los datos guardados previamente en localStorage
    if( pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    //pasar los datos al formulario
    clienteInput.value = pedidos[pos].cliente;
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    descripcionInput.value = pedidos[pos].descripcion;
    //seleccionar el boton de actualizar
    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");
    //agregar evento al boton actualizar
    btnActualizar.addEventListener("click", function(){
        pedidos[pos].cliente = clienteInput.value;
        pedidos[pos].producto = productoInput.value;
        pedidos[pos].precio = precioInput.value;
        pedidos[pos].descripcion = descripcionInput.value;
        //guardar los datos editados en localStorage
        localStorage.setItem(listadoPedidios, JSON.stringify(pedidos));
        alert("El dato fue actualizado con exito!!");
        

        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        descripcionInput.value = "";

        btnActualizar.classList.toggle("d-none");
        btnGuardar.classList.toggle("d-none");

        borrarTabla();
        mostrarDatos();
    });
}
//Buscador
document.addEventListener("keyup", e => {
    if (e.target.matches("#buscador")) {
        let searchText = e.target.value.toLowerCase();
        document.querySelectorAll("tbody tr").forEach(row => {
            let nombreCliente = row.querySelector("td:nth-child(2)"); 
            if (nombreCliente) {
                nombreCliente.textContent.toLowerCase().includes(searchText)
                    ? row.classList.remove("d-none") 
                    : row.classList.add("d-none"); 
            }
        });
    }
});



//mostrar los datos de localStorage al recargar la pagina
d.addEventListener("DOMContentLoaded", function(){
    borrarTabla();
    mostrarDatos();
   
});
// Esperar a que el DOM cargue para agregar el evento al botón
document.addEventListener("DOMContentLoaded", function () {
    let btnPdf = document.querySelector(".btn-pdf");

    btnPdf.addEventListener("click", function () {
        generarPDF();
    });
});

function generarPDF() {
    let pedidos = JSON.parse(localStorage.getItem("Pedidos")) || [];

    if (pedidos.length === 0) {
        alert("No hay pedidos para exportar.");
        return;
    }

    let doc = new window.jspdf.jsPDF(); // Crear un documento PDF
    doc.text("Listado de Pedidos", 10, 10); // Título del PDF

    let y = 20; // Posición inicial en el PDF
    pedidos.forEach((pedido, i) => {
        doc.text(`${i + 1}. Cliente: ${pedido.cliente}`, 10, y);
        doc.text(`   Producto: ${pedido.producto}`, 10, y + 5);
        doc.text(`   Precio: $${pedido.precio}`, 10, y + 10);
        doc.text(`   Descripción: ${pedido.descripcion}`, 10, y + 15);
        y += 25; // Espaciado entre pedidos
    });

    doc.save("pedidos.pdf"); // Descargar el archivo PDF
}



