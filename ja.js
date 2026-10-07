// --- NAVEGACIÓN ENTRE PESTAÑAS ---
const tabEstimados = document.getElementById('tab-estimados');
const tabFacturacion = document.getElementById('tab-facturacion');
const tabCxp = document.getElementById('tab-cxp');

const modEstimados = document.getElementById('modulo-estimados');
const modFacturacion = document.getElementById('modulo-facturacion');
const modCxp = document.getElementById('modulo-cxp');

function cambiarPestana(activaTab, activaMod) {
  [tabEstimados, tabFacturacion, tabCxp].forEach(t => t.classList.remove('active'));
  [modEstimados, modFacturacion, modCxp].forEach(m => m.classList.remove('active'));

  activaTab.classList.add('active');
  activaMod.classList.add('active');
}

tabEstimados.addEventListener('click', () => cambiarPestana(tabEstimados, modEstimados));
tabFacturacion.addEventListener('click', () => cambiarPestana(tabFacturacion, modFacturacion));
tabCxp.addEventListener('click', () => cambiarPestana(tabCxp, modCxp));


// --- MÓDULO 1: ESTIMADOS CON LISTA DE ÍTEMS ---
let listaItemsCotizacion = [];
let cotizacionFinal = null;

const btnAgregarItem = document.getElementById('btn-agregar-item');
const tablaItemsCotizacion = document.getElementById('tabla-items-cotizacion');
const formEstimado = document.getElementById('form-estimado');
const seccionResumen = document.getElementById('seccion-resumen');
const detalleCotizacion = document.getElementById('detalle-cotizacion');
const btnConvertir = document.getElementById('btn-convertir');
const mensajeEstado = document.getElementById('mensaje-estado');

// Agregar ítem individual a la tabla temporal
btnAgregarItem.addEventListener('click', function() {
  const productoInput = document.getElementById('producto');
  const cantidadInput = document.getElementById('cantidad');
  const precioInput = document.getElementById('precio');

  const producto = productoInput.value.trim();
  const cantidad = parseInt(cantidadInput.value);
  const precio = parseFloat(precioInput.value);

  if (!producto || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
    mostrarMensaje('Por favor completa los datos del producto correctamente.', 'error');
    return;
  }

  const subtotal = cantidad * precio;
  listaItemsCotizacion.push({ producto, cantidad, precio, subtotal });

  // Limpiar inputs del producto
  productoInput.value = '';
  cantidadInput.value = '1';
  precioInput.value = '';

  renderizarTablaCotizacion();
  mostrarMensaje('Producto agregado a la cotización.', 'exito');
});

function renderizarTablaCotizacion() {
  if (listaItemsCotizacion.length === 0) {
    tablaItemsCotizacion.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #888;">No hay productos agregados aún.</td>
      </tr>`;
    return;
  }

  tablaItemsCotizacion.innerHTML = listaItemsCotizacion.map((item, index) => `
    <tr>
      <td>${item.producto}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precio.toFixed(2)}</td>
      <td>$${item.subtotal.toFixed(2)}</td>
      <td><button type="button" class="btn-danger" onclick="eliminarItem(${index})">X</button></td>
    </tr>
  `).join('');
}

window.eliminarItem = function(index) {
  listaItemsCotizacion.splice(index, 1);
  renderizarTablaCotizacion();
};

// Generar Cotización Completa
formEstimado.addEventListener('submit', function(e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente').value.trim();

  if (listaItemsCotizacion.length === 0) {
    mostrarMensaje('Debes agregar al menos un producto a la lista antes de generar la cotización.', 'error');
    return;
  }

  const granTotal = listaItemsCotizacion.reduce((acc, item) => acc + item.subtotal, 0);

  cotizacionFinal = {
    cliente,
    items: [...listaItemsCotizacion],
    total: granTotal
  };

  let htmlItems = cotizacionFinal.items.map(i => `
    <li><strong>${i.producto}</strong> (x${i.cantidad}): $${i.subtotal.toFixed(2)}</li>
  `).join('');

  detalleCotizacion.innerHTML = `
    <p><strong>Cliente:</strong> ${cotizacionFinal.cliente}</p>
    <p><strong>Productos Cotizados:</strong></p>
    <ul>${htmlItems}</ul>
    <p><strong>Total Estimado:</strong> <span style="color: #64b5f6; font-size: 1.3em; font-weight: bold;">$${cotizacionFinal.total.toFixed(2)}</span></p>
  `;

  seccionResumen.style.display = 'block';
  mostrarMensaje('Cotización creada exitosamente.', 'exito');
});

// Convertir a Factura
btnConvertir.addEventListener('click', function() {
  if (cotizacionFinal) {
    document.getElementById('fac-cliente').value = cotizacionFinal.cliente;

    const tbodyFactura = document.getElementById('tabla-items-factura');
    tbodyFactura.innerHTML = cotizacionFinal.items.map(item => `
      <tr>
        <td>${item.producto}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td>$${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    tabFacturacion.click();
    mostrarMensaje(`Cotización de ${cotizacionFinal.cliente} transferida a Facturación.`, 'exito');
  }
});


// --- MÓDULO 2: FACTURACIÓN ---
const formFactura = document.getElementById('form-factura');
const seccionFactura = document.getElementById('seccion-factura-generada');
const detalleFactura = document.getElementById('detalle-factura');

formFactura.addEventListener('submit', function(e) {
  e.preventDefault();

  const cliente = document.getElementById('fac-cliente').value;
  const tipoPago = document.getElementById('fac-tipo-pago').value;

  if (!cotizacionFinal || cotizacionFinal.items.length === 0) {
    mostrarMensaje('No hay productos en la factura. Convierte una cotización primero.', 'error');
    return;
  }

  const subtotal = cotizacionFinal.total;
  const iva = subtotal * 0.15;
  const totalConIva = subtotal + iva;

  detalleFactura.innerHTML = `
    <p><strong>Cliente:</strong> ${cliente}</p>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>IVA (15%):</strong> $${iva.toFixed(2)}</p>
    <p><strong>Total Facturado:</strong> <span style="color: #81c784; font-size: 1.3em; font-weight: bold;">$${totalConIva.toFixed(2)}</span></p>
    <p><strong>Método de Pago:</strong> ${tipoPago}</p>
    ${tipoPago === 'Crédito' ? '<p style="color: #ffb74d;"><strong>Nota:</strong> Registrado en Cuentas por Cobrar.</p>' : ''}
  `;

  seccionFactura.style.display = 'block';
  mostrarMensaje(`Factura emitida con éxito para ${cliente}.`, 'exito');

  // Limpiar cotización activa
  listaItemsCotizacion = [];
  cotizacionFinal = null;
  renderizarTablaCotizacion();
  formEstimado.reset();
  formFactura.reset();
  seccionResumen.style.display = 'none';
});


// --- MÓDULO 3: CUENTAS POR PAGAR ---
const formCxp = document.getElementById('form-cxp');
const seccionCxp = document.getElementById('seccion-cxp-generada');
const detalleCxp = document.getElementById('detalle-cxp');

formCxp.addEventListener('submit', function(e) {
  e.preventDefault();

  const proveedor = document.getElementById('cxp-proveedor').value;
  const concepto = document.getElementById('cxp-concepto').value;
  const monto = parseFloat(document.getElementById('cxp-monto').value);
  const vencimiento = document.getElementById('cxp-vencimiento').value;

  detalleCxp.innerHTML = `
    <p><strong>Proveedor:</strong> ${proveedor}</p>
    <p><strong>Concepto:</strong> ${concepto}</p>
    <p><strong>Monto Pendiente:</strong> <span style="color: #e57373; font-size: 1.2em; font-weight: bold;">$${monto.toFixed(2)}</span></p>
    <p><strong>Fecha de Vencimiento:</strong> ${vencimiento}</p>
  `;

  seccionCxp.style.display = 'block';
  mostrarMensaje(`Deuda con ${proveedor} registrada en Cuentas por Pagar.`, 'exito');
  formCxp.reset();
});

function mostrarMensaje(texto, tipo) {
  mensajeEstado.className = tipo;
  mensajeEstado.innerHTML = texto;
}