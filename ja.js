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


// --- MÓDULO 1: ESTIMADOS ---
const formEstimado = document.getElementById('form-estimado');
const seccionResumen = document.getElementById('seccion-resumen');
const detalleCotizacion = document.getElementById('detalle-cotizacion');
const btnConvertir = document.getElementById('btn-convertir');
const mensajeEstado = document.getElementById('mensaje-estado');

let estimadoActual = null;

formEstimado.addEventListener('submit', function(e) {
  e.preventDefault();

  const cliente = document.getElementById('cliente').value;
  const producto = document.getElementById('producto').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const precio = parseFloat(document.getElementById('precio').value);

  const total = cantidad * precio;

  estimadoActual = { cliente, producto, cantidad, precio, total };

  detalleCotizacion.innerHTML = `
    <p><strong>Cliente:</strong> ${estimadoActual.cliente}</p>
    <p><strong>Producto:</strong> ${estimadoActual.producto}</p>
    <p><strong>Cantidad:</strong> ${estimadoActual.cantidad}</p>
    <p><strong>Precio Unitario:</strong> $${estimadoActual.precio.toFixed(2)}</p>
    <p><strong>Total Estimado:</strong> <span style="color: #64b5f6; font-size: 1.2em;">$${estimadoActual.total.toFixed(2)}</span></p>
  `;

  seccionResumen.style.display = 'block';
  mensajeEstado.className = '';
  mensajeEstado.innerHTML = '';
});

btnConvertir.addEventListener('click', function() {
  if (estimadoActual) {
    document.getElementById('fac-cliente').value = estimadoActual.cliente;
    document.getElementById('fac-producto').value = estimadoActual.producto;
    document.getElementById('fac-cantidad').value = estimadoActual.cantidad;
    document.getElementById('fac-precio').value = estimadoActual.precio;

    tabFacturacion.click();

    mensajeEstado.className = 'exito';
    mensajeEstado.innerHTML = `Cotización de ${estimadoActual.cliente} cargada en Facturación.`;
    
    seccionResumen.style.display = 'none';
    formEstimado.reset();
  }
});


// --- MÓDULO 2: FACTURACIÓN ---
const formFactura = document.getElementById('form-factura');
const seccionFactura = document.getElementById('seccion-factura-generada');
const detalleFactura = document.getElementById('detalle-factura');

formFactura.addEventListener('submit', function(e) {
  e.preventDefault();

  const cliente = document.getElementById('fac-cliente').value;
  const producto = document.getElementById('fac-producto').value;
  const cantidad = parseInt(document.getElementById('fac-cantidad').value);
  const precio = parseFloat(document.getElementById('fac-precio').value);
  const tipoPago = document.getElementById('fac-tipo-pago').value;

  const subtotal = cantidad * precio;
  const iva = subtotal * 0.15;
  const total = subtotal + iva;

  detalleFactura.innerHTML = `
    <p><strong>Cliente:</strong> ${cliente}</p>
    <p><strong>Producto:</strong> ${producto} (x${cantidad})</p>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>IVA (15%):</strong> $${iva.toFixed(2)}</p>
    <p><strong>Total Facturado:</strong> <span style="color: #81c784; font-size: 1.3em; font-weight: bold;">$${total.toFixed(2)}</span></p>
    <p><strong>Método de Pago:</strong> ${tipoPago}</p>
    ${tipoPago === 'Crédito' ? '<p style="color: #ffb74d;"><strong>Nota:</strong> Registrado en Cuentas por Cobrar.</p>' : ''}
  `;

  seccionFactura.style.display = 'block';
  mensajeEstado.className = 'exito';
  mensajeEstado.innerHTML = `Factura emitida con éxito para ${cliente}.`;
  formFactura.reset();
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
  mensajeEstado.className = 'exito';
  mensajeEstado.innerHTML = `Deuda con ${proveedor} registrada en Cuentas por Pagar.`;
  formCxp.reset();
});