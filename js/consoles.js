/**
 * consolas.js - Renderizado de la colección de hardware
 */
function renderConsolas(consolas) {
    const container = document.getElementById('consolas-grid');
    if (!container) return;

    container.innerHTML = consolas.map(c => {
        // Aquí es donde meteremos la lógica de los campos que me vas a decir ahora
        return `
            <div class="card">
                <div style="padding: 20px; text-align: center;">
                    <h3>${c["Modelo"] || "Nueva Consola"}</h3>
                    <p>Esperando detalles de campos...</p>
                </div>
            </div>
        `;
    }).join('');
}
