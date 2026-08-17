/**
 * Lógica del Frontend para el CRUD de Inventario
 * Se conecta a la API REST de Spring Boot (/api/products)
 */

const API_URL = '/api/products';
let todosLosProductos = [];
let modalBS;

document.addEventListener('DOMContentLoaded', () => {
    modalBS = new bootstrap.Modal(document.getElementById('modalProducto'));
    cargarProductos();
});

async function cargarProductos() {
    try {
        const res = await fetch(API_URL);
        todosLosProductos = await res.json();
        renderizarTabla(todosLosProductos);
        actualizarEstadisticas(todosLosProductos);
    } catch (err) {
        console.error('Error al conectar con la API:', err);
    }
}

function renderizarTabla(productos) {
    const tbody = document.getElementById('tabla-productos-body');
    if (!productos || productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted"><i class="fa-solid fa-inbox fa-2x mb-3 d-block"></i>No hay productos registrados en la base de datos.</td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map(p => {
        const totalValue = (p.price * p.stockQuantity).toFixed(2);
        const isLowStock = p.stockQuantity < 5;
        return `
            <tr>
                <td class="fw-bold text-info">#${p.id}</td>
                <td><span class="badge badge-sku">${p.sku}</span></td>
                <td class="fw-semibold text-white">${p.name}</td>
                <td class="fw-bold text-warning">S/ ${p.price.toFixed(2)}</td>
                <td>
                    <span class="badge" style="background-color: ${isLowStock ? '#f59e0b' : '#10b981'}; color: ${isLowStock ? '#000000' : '#ffffff'} !important; font-size: 0.85rem; padding: 6px 12px; font-weight: 600;">
                        <i class="fa-solid ${isLowStock ? 'fa-triangle-exclamation me-1' : 'fa-check me-1'}"></i>${p.stockQuantity} unidades
                    </span>
                </td>
                <td class="text-success font-monospace fw-bold fs-6">S/ ${totalValue}</td>
                <td class="text-end">
                    <div class="d-inline-flex gap-2">
                        <button class="btn btn-sm btn-outline-info rounded-circle px-2 py-1" onclick="editarProducto(${p.id})" title="Editar Producto">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-circle px-2 py-1" onclick="eliminarProducto(${p.id})" title="Eliminar Producto">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function actualizarEstadisticas(productos) {
    document.getElementById('stat-total-count').textContent = productos.length;
    const totalValue = productos.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
    document.getElementById('stat-total-value').textContent = `S/ ${totalValue.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    const lowStock = productos.filter(p => p.stockQuantity < 5).length;
    document.getElementById('stat-low-stock').textContent = lowStock;
}

function filtrarProductos() {
    const query = document.getElementById('input-search').value.toLowerCase();
    const filtrados = todosLosProductos.filter(p =>
        p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
    );
    renderizarTabla(filtrados);
}

function abrirModalCrear() {
    document.getElementById('prodId').value = '';
    document.getElementById('formProducto').reset();
    // Generar un código SKU de vista previa estandarizado
    const nuevoSku = 'SKU-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('prodSku').value = nuevoSku;
    document.getElementById('modalTitle').textContent = 'Registrar Nuevo Producto';
    modalBS.show();
}

async function editarProducto(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodSku').value = p.sku;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodStock').value = p.stockQuantity;
    document.getElementById('modalTitle').textContent = 'Editar Producto #' + p.id;
    modalBS.show();
}

async function guardarProducto(e) {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const body = {
        sku: document.getElementById('prodSku').value,
        name: document.getElementById('prodName').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        stockQuantity: parseInt(document.getElementById('prodStock').value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    modalBS.hide();
    cargarProductos();
}

async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto de PostgreSQL?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarProductos();
}