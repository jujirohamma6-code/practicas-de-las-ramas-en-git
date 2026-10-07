# Diagrama de Proceso de Cuentas por Cobrar

```mermaid
flowchart TD
    %% ============ CARRIL 1: COMERCIAL / VENTAS ============
    subgraph COMERCIAL["COMERCIAL / VENTAS"]
        direction TD
        A(["Inicio"]) --> B["Generación de Pedido / Orden de Venta"]
        B --> C["Envío de la factura al cliente"]
    end

    %% ============ CARRIL 2: CLIENTE ============
    subgraph CLIENTE["CLIENTE"]
        direction TD
        D["Recepción de la factura<br/>Revisión de condiciones y montos"]
        E["Emisión del pago<br/>Transferencia, depósito o cheque<br/>Envío del comprobante a la empresa"]
        D --> E
    end

    %% ============ CARRIL 3: TESORERÍA / ADMINISTRACIÓN ============
    subgraph TESORERIA["TESORERÍA / ADMINISTRACIÓN"]
        direction TD
        F["Recepción del comprobante<br/>Validación del pago contra fondos del banco"]
        G{"¿El pago cubre el monto<br/>total de la factura?"}
        H["Registrar pago parcial en el sistema"]
        I["Generar saldo pendiente<br/>Notificar al cliente"]
        F --> G
        G -- "NO (pago parcial)" --> H --> I
    end

    %% ============ CARRIL 4: CONTABILIDAD / COBRANZAS ============
    subgraph CONTABILIDAD["CONTABILIDAD / COBRANZAS"]
        direction TD
        J["Aplicación y conciliación del pago<br/>Abono completo a la factura en el sistema contable"]
        K{"¿Hay mora<br/>vencida?"}
        L["Envío de recordatorios / avisos de mora"]
        M["Actualización del reporte<br/>Kardex y antigüedad de saldos"]
        N["Archivo definitivo<br/>Factura marcada como Pagada y Saldada"]
        O(["FIN"])
        J --> K
        K -- "SÍ" --> L --> M
        K -- "NO" --> M
        M --> N --> O
    end

    %% ============ FLUJO ENTRE CARRILES ============
    C --> D
    E --> F
    G -- "SÍ (pago total)" --> J
    I --> F
```

## Leyenda del flujo

| Carril | Participa en |
|---|---|
| COMERCIAL / VENTAS | Generación del pedido y envío de la factura |
| CLIENTE | Recepción, revisión y pago |
| TESORERÍA / ADMINISTRACIÓN | Validación bancaria y decisión total/parcial |
| CONTABILIDAD / COBRANZAS | Conciliación, morosidad, reportes y cierre |

- **Ruta pago total:** Factura → Validación → Conciliación → Cierre → FIN
- **Ruta pago parcial:** Validación → Registro parcial → Notificación → *vuelve a Validación* (bucle hasta saldar)
- **Ruta con mora:** Conciliación → Recordatorios → Actualización de reportes → Archivo → FIN
