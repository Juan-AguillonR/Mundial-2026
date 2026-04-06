/**
 * 
 * @param {Object} partido
 * @returns {string} HTML string
 */
function crearTarjetaPartido(partido) {
  const { local, visitante, fecha, estadio, ciudad, estado, penales, id } = partido;

  const golesLocal     = local.goles     !== null ? local.goles     : '–';
  const golesVisitante = visitante.goles !== null ? visitante.goles : '–';

  const claseEstado  = estado === 'jugado' ? 'partido-card--jugado' : 'partido-card--pendiente';
  const badgeEstado  = estado === 'jugado'
    ? '<span class="estado-badge estado-badge--jugado">Finalizado</span>'
    : '<span class="estado-badge estado-badge--pendiente">Pendiente</span>';

  
  let ganadorLocal = false;
  let ganadorVisitante = false;
  if (estado === 'jugado' && local.goles !== null && visitante.goles !== null) {
    if (penales) {
      ganadorLocal     = penales.local > penales.visitante;
      ganadorVisitante = penales.visitante > penales.local;
    } else {
      ganadorLocal     = local.goles > visitante.goles;
      ganadorVisitante = visitante.goles > local.goles;
    }
  }

  const claseLocal     = ganadorLocal     ? 'equipo--ganador' : '';
  const claseVisitante = ganadorVisitante ? 'equipo--ganador' : '';

  const penalesHTML = penales
    ? `<p class="penales-info">Penales: ${penales.local} – ${penales.visitante}</p>`
    : '';

  return `
    <article class="partido-card ${claseEstado}" data-id="${id}">
      <div class="partido-card__header">
        ${badgeEstado}
        <span class="partido-id">${id}</span>
      </div>

      <div class="partido-card__marcador">
        <div class="equipo ${claseLocal}">
          <span class="equipo__bandera">${local.bandera}</span>
          <span class="equipo__nombre">${local.nombre}</span>
          <span class="equipo__goles">${golesLocal}</span>
        </div>

        <div class="vs-separador">
          <span class="vs-texto">VS</span>
        </div>

        <div class="equipo equipo--derecha ${claseVisitante}">
          <span class="equipo__goles">${golesVisitante}</span>
          <span class="equipo__nombre">${visitante.nombre}</span>
          <span class="equipo__bandera">${visitante.bandera}</span>
        </div>
      </div>

      ${penalesHTML}

      <div class="partido-card__footer">
        <span class="partido-info">📅 ${fecha}</span>
        <span class="partido-info">🏟️ ${estadio}</span>
        <span class="partido-info">📍 ${ciudad}</span>
      </div>
    </article>
  `;
}

/**
 * Renderiza todos los partidos de una fase en el contenedor indicado.
 * @param {string} fase  - clave de ELIMINACION (ej: 'octavos')
 * @param {string} idContenedor - id del div donde se inyecta
 */
function renderPartidos(fase, idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  const partidos = ELIMINACION[fase];
  if (!partidos || partidos.length === 0) {
    contenedor.innerHTML = '<p class="sin-datos">No hay partidos disponibles.</p>';
    return;
  }

  contenedor.innerHTML = partidos.map(crearTarjetaPartido).join('');
}
