/* ═══════════════════════════════════════════════════════════════════
   eliminacion.js — MUNDIAL FIFA 2026
   Marcador interactivo con avance automático entre fases
═══════════════════════════════════════════════════════════════════ */

const AVANCE_MAPA = {
  O01: { nextId: 'C01', slot: 'local'     },
  O02: { nextId: 'C01', slot: 'visitante' },
  O03: { nextId: 'C02', slot: 'local'     },
  O04: { nextId: 'C02', slot: 'visitante' },
  O05: { nextId: 'C03', slot: 'local'     },
  O06: { nextId: 'C03', slot: 'visitante' },
  O07: { nextId: 'C04', slot: 'local'     },
  O08: { nextId: 'C04', slot: 'visitante' },
  O09: { nextId: 'C05', slot: 'local'     },
  O10: { nextId: 'C05', slot: 'visitante' },
  O11: { nextId: 'C06', slot: 'local'     },
  O12: { nextId: 'C06', slot: 'visitante' },
  O13: { nextId: 'C07', slot: 'local'     },
  O14: { nextId: 'C07', slot: 'visitante' },
  O15: { nextId: 'C08', slot: 'local'     },
  O16: { nextId: 'C08', slot: 'visitante' },
  C01: { nextId: 'S01', slot: 'local'     },
  C02: { nextId: 'S01', slot: 'visitante' },
  C03: { nextId: 'S02', slot: 'local'     },
  C04: { nextId: 'S02', slot: 'visitante' },
  C05: { nextId: 'S01', slot: 'local'     },
  C06: { nextId: 'S01', slot: 'visitante' },
  C07: { nextId: 'S02', slot: 'local'     },
  C08: { nextId: 'S02', slot: 'visitante' },
  S01: { nextId: 'F01', slot: 'local',     loserNextId: 'B01', loserSlot: 'local'     },
  S02: { nextId: 'F01', slot: 'visitante', loserNextId: 'B01', loserSlot: 'visitante' },
};

function buscarPartido(id) {
  for (const fase of Object.values(ELIMINACION)) {
    const p = fase.find(x => x.id === id);
    if (p) return p;
  }
  return null;
}

function ganadorPartido(partido) {
  const { local, visitante, penales } = partido;
  if (local.goles === null || visitante.goles === null) return null;
  if (penales) {
    if (penales.local > penales.visitante) return 'local';
    if (penales.visitante > penales.local) return 'visitante';
    return null;
  }
  if (local.goles > visitante.goles) return 'local';
  if (visitante.goles > local.goles) return 'visitante';
  return null;
}

function propagarGanador(partido) {
  const mapa = AVANCE_MAPA[partido.id];
  if (!mapa) return;

  const ganador = ganadorPartido(partido);
  const siguiente = buscarPartido(mapa.nextId);
  if (!siguiente) return;

  const equipoGanador  = ganador === 'local' ? partido.local : partido.visitante;
  const equipoPerdedor = ganador === 'local' ? partido.visitante : partido.local;

  if (ganador) {
    siguiente[mapa.slot] = { nombre: equipoGanador.nombre, bandera: equipoGanador.bandera, goles: null };
  } else {
    siguiente[mapa.slot] = { nombre: 'Ganador ' + partido.id, bandera: '🏆', goles: null };
  }
  actualizarTarjeta(siguiente.id);

  if (mapa.loserNextId) {
    const bronce = buscarPartido(mapa.loserNextId);
    if (bronce) {
      bronce[mapa.loserSlot] = ganador
        ? { nombre: equipoPerdedor.nombre, bandera: equipoPerdedor.bandera, goles: null }
        : { nombre: 'Perdedor ' + partido.id, bandera: '🥉', goles: null };
      actualizarTarjeta(bronce.id);
    }
  }
}

function actualizarTarjeta(id) {
  const el = document.querySelector('[data-id="' + id + '"]');
  if (!el) return;
  const partido = buscarPartido(id);
  if (!partido) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = crearTarjetaPartido(partido);
  el.replaceWith(tmp.firstElementChild);
}

function cambiarGoles(partidoId, equipo, delta) {
  const partido = buscarPartido(partidoId);
  if (!partido) return;
  const target = partido[equipo];
  const actual = target.goles === null ? 0 : target.goles;
  target.goles = Math.max(0, actual + delta);
  if (partido.local.goles !== null && partido.visitante.goles !== null) {
    partido.estado = 'jugado';
  }
  actualizarTarjeta(partidoId);
  propagarGanador(partido);
}

/* ─────────────────────────────────────────────────────────────────
   crearTarjetaPartido
   Estructura de cada fila de equipo:
     [bandera] [nombre]        [− goles +]
   El marcador-control se alinea al extremo derecho.
───────────────────────────────────────────────────────────────── */
function crearTarjetaPartido(partido) {
  const { local, visitante, fecha, estadio, ciudad, estado, penales, id } = partido;

  const golesLocal     = local.goles     !== null ? local.goles     : '–';
  const golesVisitante = visitante.goles !== null ? visitante.goles : '–';

  const claseEstado = estado === 'jugado' ? 'partido-card--jugado' : 'partido-card--pendiente';
  const badgeEstado = estado === 'jugado'
    ? '<span class="estado-badge estado-badge--jugado">Finalizado</span>'
    : '<span class="estado-badge estado-badge--pendiente">Pendiente</span>';

  let esGanadorLocal = false;
  let esGanadorVisitante = false;
  if (local.goles !== null && visitante.goles !== null) {
    if (penales) {
      esGanadorLocal     = penales.local > penales.visitante;
      esGanadorVisitante = penales.visitante > penales.local;
    } else {
      esGanadorLocal     = local.goles > visitante.goles;
      esGanadorVisitante = visitante.goles > local.goles;
    }
  }

  const claseLocal     = esGanadorLocal     ? 'equipo-fila equipo-fila--ganador' : 'equipo-fila';
  const claseVisitante = esGanadorVisitante ? 'equipo-fila equipo-fila--ganador' : 'equipo-fila';
  const penalesHTML    = penales
    ? '<p class="penales-info">Penales: ' + penales.local + ' \u2013 ' + penales.visitante + '</p>'
    : '';

  return `
<article class="partido-card ${claseEstado}" data-id="${id}">

  <div class="partido-card__header">
    ${badgeEstado}
    <span class="partido-id">${id}</span>
  </div>

  <div class="partido-card__body">

    <!-- LOCAL -->
    <div class="${claseLocal}">
      <span class="equipo-fila__bandera">${local.bandera}</span>
      <span class="equipo-fila__nombre">${local.nombre}</span>
      <div class="equipo-fila__control">
        <button class="btn-gol btn-menos" onclick="cambiarGoles('${id}','local',-1)">&#8722;</button>
        <span class="equipo-fila__goles">${golesLocal}</span>
        <button class="btn-gol btn-mas"  onclick="cambiarGoles('${id}','local',1)">&#43;</button>
      </div>
    </div>

    <!-- SEPARADOR VS -->
    <div class="vs-separador">
      <span class="vs-texto">VS</span>
    </div>

    <!-- VISITANTE -->
    <div class="${claseVisitante}">
      <span class="equipo-fila__bandera">${visitante.bandera}</span>
      <span class="equipo-fila__nombre">${visitante.nombre}</span>
      <div class="equipo-fila__control">
        <button class="btn-gol btn-menos" onclick="cambiarGoles('${id}','visitante',-1)">&#8722;</button>
        <span class="equipo-fila__goles">${golesVisitante}</span>
        <button class="btn-gol btn-mas"  onclick="cambiarGoles('${id}','visitante',1)">&#43;</button>
      </div>
    </div>

  </div>

  ${penalesHTML}

  <div class="partido-card__footer">
    <span class="partido-info">📅 ${fecha}</span>
    <span class="partido-info">🏟️ ${estadio}</span>
    <span class="partido-info">📍 ${ciudad}</span>
  </div>

</article>`;
}

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
