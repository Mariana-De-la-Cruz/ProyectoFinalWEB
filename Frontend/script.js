const URL = 'https://proyectofinalweb-production-a37c.up.railway.app/tenistas';

document.addEventListener('DOMContentLoaded', () => {
  cargarTenistas();
});

//GET
function cargarTenistas() {
  fetch(URL)
    .then(res => res.json())
    .then(tenistas => {
      const tbody = document.querySelector('#tablaTenistas tbody');
      tbody.innerHTML = ''; 

      tenistas.forEach(tenista => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
          <td>${tenista.ID}</td>
          <td>${tenista.nombre}</td>
          <td>${tenista.apellido}</td>
          <td>${tenista.genero}</td>
          <td>${tenista.edad}</td>
          <td>${tenista.pais}</td>
          <td>${tenista.estatura}</td>
          <td>${tenista.ranking}</td>
        `;

        tbody.appendChild(fila);
      });
    })
    .catch(error => {
      console.error('Error al cargar tenistas:', error);
    });
}

//POST
function agregarTenista() {
  const datos = obtenerDatosFormulario();
  if (!datos) return;

  fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(respuesta => {
      alert(respuesta.message || 'Tenista agregado');
      limpiarFormulario();
      cargarTenistas();
    })
    .catch(err => console.error('Error al agregar tenista:', err));
}

//PATCH
function actualizarTenista() {
  const id = document.getElementById('id').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const genero = document.getElementById('genero').value.trim();
  const edad = document.getElementById('edad').value.trim();
  const pais = document.getElementById('pais').value.trim();
  const estatura = document.getElementById('estatura').value.trim();
  const ranking = document.getElementById('ranking').value.trim();

  if (!id || isNaN(id)) {
    alert('Ingresa un ID válido para actualizar');
    return;
  }

  const datos = {};
  if (nombre) datos.nombre = nombre;
  if (apellido) datos.apellido = apellido;
  if (genero) datos.genero = genero;
  if (edad) datos.edad = parseInt(edad);
  if (pais) datos.pais = pais;
  if (estatura) datos.estatura = parseFloat(estatura);
  if (ranking) datos.ranking = parseInt(ranking);

  if (Object.keys(datos).length === 0) {
    alert('Debes llenar al menos un campo para actualizar');
    return;
  }

  fetch(`${URL}?id=${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(respuesta => {
      alert(respuesta.message || 'Tenista actualizado');
      limpiarFormulario();
      cargarTenistas();
    })
    .catch(error => {
      console.error('Error al actualizar tenista:', error);
    });
}

//DELETE
function eliminarTenista() {
  const id = document.getElementById('id').value.trim();
  if (!id || isNaN(id)) {
    alert('Ingresa un ID válido para eliminar');
    return;
  }

  fetch(`${URL}?id=${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(respuesta => {
      alert(respuesta.message || 'Tenista eliminado');
      limpiarFormulario();
      cargarTenistas();
    })
    .catch(err => console.error('Error al eliminar tenista:', err));
}

//MÉTODO PARA OBTENER DATOS DEL FORMULARIO
function obtenerDatosFormulario() {   
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const genero = document.getElementById('genero').value;
  const edad = parseInt(document.getElementById('edad').value);
  const pais = document.getElementById('pais').value.trim();
  const estatura = parseFloat(document.getElementById('estatura').value);
  const ranking = parseInt(document.getElementById('ranking').value);

  if (!nombre || !apellido || !genero || isNaN(edad) || !pais || isNaN(estatura) || isNaN(ranking)) {
    alert('Por favor llena todos los campos correctamente');
    return null;
  }

  return { nombre, apellido, genero, edad, pais, estatura, ranking };
}

//MÉTODO PARA LIMPIAR FORMULARIO
function limpiarFormulario() {
  document.getElementById('id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('apellido').value = '';
  document.getElementById('genero').value = '';
  document.getElementById('edad').value = '';
  document.getElementById('pais').value = '';
  document.getElementById('estatura').value = '';
  document.getElementById('ranking').value = '';
}
