const API_URL = 'http://44.202.71.251/api/devices';
const tablaBody = document.getElementById('tablaDatos');
const statusPrincipal = document.getElementById('statusPrincipal');

function cargarDatos() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta de la API:', data);

      const devices = Array.isArray(data) ? data : data.devices;

      if (!Array.isArray(devices)) {
        throw new Error('El formato de los datos recibidos no es un arreglo.');
      }

      // Mostrar status del primer dispositivo
      if (devices.length > 0) {
        statusPrincipal.textContent = devices[0].status;
        statusPrincipal.className = `badge ${devices[0].status === 'activo' ? 'bg-success' : 'bg-danger'}`;
      } else {
        statusPrincipal.textContent = 'Sin datos';
        statusPrincipal.className = 'badge bg-secondary';
      }

      // Limpiar tabla
      tablaBody.innerHTML = '';

      // Insertar filas
      devices.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.ip}</td>
          <td>${item.status}</td>
          <td>${new Date(item.date).toLocaleString()}</td>
        `;
        tablaBody.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al obtener datos de la API:', error);
      tablaBody.innerHTML = `<tr><td colspan="5" class="text-danger">Error al cargar datos</td></tr>`;
      statusPrincipal.textContent = 'Error';
      statusPrincipal.className = 'badge bg-danger';
    });
}

// Inicial
cargarDatos();

// Actualiza cada 2 segundos
setInterval(cargarDatos, 2000);
