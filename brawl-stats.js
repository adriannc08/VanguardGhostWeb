/**
 * Vanguard Ghost (VG) - Brawl Stars Stats Extension
 * Muestra las copas exactas, prestigios reales y rango competitivo oficial de cada jugador al hacer clic.
 * Totalmente actualizado con el nuevo sistema jerárquico de Rangos:
 * Legendario (I, II, III) ➔ Maestros (I, II, III) ➔ Rango PRO 👑
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Base de datos Oficial y Verificada de Brawl Stars (Vanguard Ghost)
  // Actualizada con los rangos competitivos consolidados y la nueva jerarquía PRO
  // ---------------------------------------------------------------------------
  const DEFAULT_BRAWL_STATS = {
    peter100: {
      tag: '#2Y999R8OP',
      cleanTag: '2Y999R80P',
      inGameName: 'VG | Peter100',
      club: 'VanguardGhost',
      trophies: 144362,
      highestTrophies: 144376,
      prestiges: 132,
      level: 338,
      rankedRank: 'Maestros I',
      rankedPoints: 'División Maestros (106 Brawlers con 1000+ 🏆)',
      victories3v3: 25502,
      totalVictories: 32452,
      brawlers: '108/111'
    },
    dsr: {
      tag: '#2R9VQRQ89',
      cleanTag: '2R9VQRQ89',
      inGameName: 'VG|DSR',
      club: 'VanguardGhost',
      trophies: 102935,
      highestTrophies: 102935,
      prestiges: 75,
      level: 246,
      rankedRank: 'Legendario II',
      rankedPoints: 'Supera Legendario 1 (Máx: Leg. II)',
      victories3v3: 17245,
      totalVictories: 19367,
      brawlers: '108/111'
    },
    patoduck: {
      tag: '#28V9VJJRL',
      cleanTag: '28V9VJJRL',
      inGameName: 'MZP|Patoduck🐥',
      club: 'ESPAÑA🇪🇸',
      trophies: 103371,
      highestTrophies: 103383,
      prestiges: 80,
      level: 283,
      rankedRank: 'Legendario II',
      rankedPoints: 'Supera Legendario 1 (Máx: Leg. II)',
      victories3v3: 21393,
      totalVictories: 25080,
      brawlers: '108/111'
    },
    obri11: {
      tag: '#LV9J8P8',
      cleanTag: 'LV9J8P8',
      inGameName: 'VG | Obri11',
      club: 'VanguardGhost',
      trophies: 83417,
      highestTrophies: 83417,
      prestiges: 69,
      level: 191,
      rankedRank: 'Legendario II',
      rankedPoints: 'Supera Legendario 1 (Main Drafter VG)',
      victories3v3: 13382,
      totalVictories: 14525,
      brawlers: '108/111'
    },
    shineyt: {
      tag: '#8VVJJ82UR',
      cleanTag: '8VVJJ82UR',
      inGameName: 'VG|SoyShineYT',
      club: 'VanguardGhost',
      trophies: 73200,
      highestTrophies: 73200,
      prestiges: 36,
      level: 165,
      rankedRank: 'Legendario II',
      rankedPoints: 'Supera Legendario 1',
      victories3v3: 13200,
      totalVictories: 15000,
      brawlers: '108/111'
    },
    gohan070: {
      tag: '#PVV9L8JPR',
      cleanTag: 'PVV9L8JPR',
      inGameName: 'VG | Gohan070',
      club: 'VanguardGhost',
      trophies: 82165,
      highestTrophies: 82170,
      prestiges: 67,
      level: 179,
      rankedRank: 'Legendario II',
      rankedPoints: 'Supera Legendario 1',
      victories3v3: 10421,
      totalVictories: 11491,
      brawlers: '108/111'
    },
    osky: {
      tag: '#22YQ09YY99',
      cleanTag: '22YQ09YY99',
      inGameName: 'Osky',
      club: ':)',
      trophies: 64961,
      highestTrophies: 64961,
      prestiges: 51,
      level: 150,
      rankedRank: 'Mítico III',
      rankedPoints: 'División Mítico (Próx. objetivo: Legendario)',
      victories3v3: 7266,
      totalVictories: 7790,
      brawlers: '108/111'
    }
  };

  // Versión de datos para invalidar cachés y aplicar la nueva jerarquía PRO
  const DATA_VERSION = 'v3_pro_ranked_hierarchy';
  try {
    if (localStorage.getItem('vg_stats_version') !== DATA_VERSION) {
      Object.keys(DEFAULT_BRAWL_STATS).forEach(k => {
        localStorage.removeItem('vg_stats_' + k);
      });
      localStorage.setItem('vg_stats_version', DATA_VERSION);
    }
  } catch (e) {}

  // ---------------------------------------------------------------------------
  // Utilidades de almacenamiento (Persistencia)
  // ---------------------------------------------------------------------------
  function getCustomStats(id) {
    try {
      const stored = localStorage.getItem('vg_stats_' + id);
      if (stored) {
        return Object.assign({}, DEFAULT_BRAWL_STATS[id], JSON.parse(stored));
      }
    } catch (e) {}
    return DEFAULT_BRAWL_STATS[id] || null;
  }

  function saveCustomStats(id, newStats) {
    try {
      localStorage.setItem('vg_stats_' + id, JSON.stringify(newStats));
    } catch (e) {}
  }

  // ---------------------------------------------------------------------------
  // Gestor Visual de Rangos Competitivos (Incluyendo el nuevo rango PRO)
  // Escala: Mítico 1-3 ➔ Legendario 1-3 ➔ Maestros 1-3 ➔ PRO
  // ---------------------------------------------------------------------------
  function getRankBadgeStyle(rank) {
    const raw = (rank || '').trim();
    const r = raw.toLowerCase();

    // 1. NUEVO RANGO PRO (Rango Máximo Supremo añadido tras Maestros 3)
    if (r === 'pro' || r.startsWith('pro') || r.includes(' rango pro')) {
      return {
        badge: '👑 PRO',
        bg: 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-amber-950/90',
        border: 'border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.45)] ring-1 ring-rose-400/40',
        text: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 font-black',
        tier: 'pro',
        subtitle: '👑 Rango Pro Supremo'
      };
    }

    // 2. MAESTROS (Maestros I, II, III o 1, 2, 3)
    if (r.includes('maestro') || r.includes('master')) {
      let sub = 'I';
      if (r.includes('3') || r.includes('iii')) sub = 'III';
      else if (r.includes('2') || r.includes('ii')) sub = 'II';
      else if (r.includes('1') || r.includes('i')) sub = 'I';

      return {
        badge: `🏆 Maestros ${sub}`,
        bg: 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-yellow-950/50',
        border: 'border-amber-400/80 shadow-[0_0_14px_rgba(251,191,36,0.3)]',
        text: 'text-amber-300 font-extrabold',
        tier: 'masters',
        subtitle: `División Maestros ${sub}`
      };
    }

    // 3. LEGENDARIO (Legendario I, II, III o 1, 2, 3)
    if (r.includes('legendari')) {
      let sub = 'II'; // Default para quienes superan Legendario 1
      if (r.includes('3') || r.includes('iii')) sub = 'III';
      else if (r.includes('1') || r.includes('i')) {
        if (!r.includes('ii') && !r.includes('iii')) sub = 'I';
      } else if (r.includes('2') || r.includes('ii')) sub = 'II';

      return {
        badge: `💎 Legendario ${sub}`,
        bg: 'bg-gradient-to-br from-cyan-950/70 via-slate-900 to-sky-950/50',
        border: 'border-cyan-400/70 shadow-[0_0_14px_rgba(34,211,238,0.25)]',
        text: 'text-cyan-300 font-bold',
        tier: 'legendary',
        subtitle: `División Legendario ${sub}`
      };
    }

    // 4. MÍTICO (Mítico I, II, III o 1, 2, 3)
    if (r.includes('mític') || r.includes('mitic')) {
      let sub = 'III';
      if (r.includes('1') || r.includes('i')) {
        if (!r.includes('ii') && !r.includes('iii')) sub = 'I';
      } else if (r.includes('2') || r.includes('ii')) sub = 'II';
      else if (r.includes('3') || r.includes('iii')) sub = 'III';

      return {
        badge: `🟣 Mítico ${sub}`,
        bg: 'bg-gradient-to-br from-purple-950/60 via-slate-900 to-fuchsia-950/40',
        border: 'border-purple-400/60 shadow-[0_0_10px_rgba(192,132,252,0.2)]',
        text: 'text-purple-300 font-bold',
        tier: 'mythic',
        subtitle: `División Mítico ${sub}`
      };
    }

    // 5. DIAMANTE
    if (r.includes('diamante')) {
      return {
        badge: '🔷 ' + raw,
        bg: 'bg-blue-950/50',
        border: 'border-blue-400/60',
        text: 'text-blue-300 font-bold',
        tier: 'diamond',
        subtitle: 'División Diamante'
      };
    }

    // OTROS
    return {
      badge: '🏅 ' + raw,
      bg: 'bg-slate-900',
      border: 'border-slate-700',
      text: 'text-slate-200 font-bold',
      tier: 'other',
      subtitle: 'Modo Competitivo'
    };
  }

  // ---------------------------------------------------------------------------
  // Generador del bloque HTML con Copas, Prestigios y Rango Competitivo
  // ---------------------------------------------------------------------------
  function buildStatsCardHtml(id) {
    const stats = getCustomStats(id);
    if (!stats) return '';

    const formattedTrophies = Number(stats.trophies).toLocaleString('es-ES');
    const formattedHighest = Number(stats.highestTrophies || stats.trophies).toLocaleString('es-ES');
    const formatted3v3 = Number(stats.victories3v3 || 0).toLocaleString('es-ES');
    const rankStyle = getRankBadgeStyle(stats.rankedRank);
    const brawlifyUrl = `https://brawlify.com/player/${stats.cleanTag}`;
    const brawlStatsUrl = `https://brawlstats.com/profile/${stats.cleanTag}`;

    return `
      <!-- BLOQUE OFICIAL BRAWL STARS -->
      <div id="brawl-stats-box" class="mt-4 pt-4 border-t border-slate-700/80">
        
        <!-- Cabecera de Estadísticas y Acciones -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-tech text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-trophy text-amber-400"></i> Estadísticas Brawl Stars
            </span>
            <button onclick="window.VG_BRAWL_STATS_CONTROLLER.copyTag('${stats.tag}')" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 transition flex items-center gap-1" title="Copiar Tag de jugador">
              <span>${stats.tag}</span> <i class="fa-regular fa-copy text-[9px]"></i>
            </button>
            <span class="text-[11px] text-slate-400 font-mono">(${stats.inGameName})</span>
          </div>

          <div class="flex items-center gap-1.5 text-[10px]">
            <button onclick="window.VG_BRAWL_STATS_CONTROLLER.promptEditStats('${id}')" class="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-600 hover:border-cyan-400 hover:text-white transition flex items-center gap-1" title="Modificar copas, prestigios o seleccionar nuevo rango (Legendario, Maestros, PRO)">
              <i class="fa-solid fa-pen-to-square text-[9px] text-cyan-400"></i> <span>Ajustar Rango/Copas</span>
            </button>
            <a href="${brawlifyUrl}" target="_blank" rel="noopener" class="px-2 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition flex items-center gap-1" title="Ver perfil verificado en Brawlify">
              <span>Brawlify</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
            <a href="${brawlStatsUrl}" target="_blank" rel="noopener" class="px-2 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 hover:bg-purple-900 transition flex items-center gap-1" title="Ver perfil en BrawlStats">
              <span>BrawlStats</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
        </div>

        <!-- Escala Jerárquica Visual del Modo Competitivo -->
        <div class="mb-3 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] flex flex-wrap items-center justify-between gap-1 text-slate-400">
          <span class="text-slate-500 uppercase tracking-wider font-tech font-bold text-[9px]">Jerarquía Ranked:</span>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-purple-400">🟣 Mítico (1-3)</span>
            <span class="text-slate-600 font-bold">➔</span>
            <span class="text-cyan-300 font-bold">💎 Legendario (1-3)</span>
            <span class="text-slate-600 font-bold">➔</span>
            <span class="text-amber-300 font-bold">🏆 Maestros (1-3)</span>
            <span class="text-slate-600 font-bold">➔</span>
            <span class="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/60 text-rose-300 font-black">👑 PRO</span>
          </div>
        </div>

        <!-- Cuadrícula con las 3 Métricas Solicitadas -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2.5">
          
          <!-- 1. COPAS TOTALES -->
          <div class="p-3 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-tech text-amber-400 uppercase tracking-wider">Copas Totales</span>
              <span class="text-sm">🏆</span>
            </div>
            <div class="text-xl font-brawl text-white tracking-wide flex items-baseline gap-1">
              <span>${formattedTrophies}</span>
              <span class="text-xs font-normal text-amber-400">🏆</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5 flex justify-between">
              <span>Récord: <strong class="text-slate-200">${formattedHighest}</strong></span>
              <span>Brawlers: <strong class="text-cyan-300">${stats.brawlers || '108/111'}</strong></span>
            </div>
          </div>

          <!-- 2. PRESTIGIOS TOTALES -->
          <div class="p-3 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-tech text-purple-400 uppercase tracking-wider">Prestigios</span>
              <span class="text-sm">⭐</span>
            </div>
            <div class="text-xl font-brawl text-purple-300 tracking-wide flex items-baseline gap-1">
              <span>${stats.prestiges}</span>
              <span class="text-xs font-normal text-purple-400">Nivel Total</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5 flex justify-between">
              <span>Victorias 3v3: <strong class="text-slate-200">${formatted3v3}</strong></span>
            </div>
          </div>

          <!-- 3. RANGO MODO COMPETITIVO (Actualizado con PRO / Maestros 1-3 / Legendario 1-3) -->
          <div class="p-3 rounded-xl ${rankStyle.bg} border ${rankStyle.border} shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-tech text-cyan-300 uppercase tracking-wider">Modo Competitivo</span>
              <span class="text-sm">🏅</span>
            </div>
            <div class="text-base font-brawl ${rankStyle.text} tracking-wide truncate">
              ${rankStyle.badge}
            </div>
            <div class="text-[10px] text-slate-300 mt-0.5 font-semibold truncate">
              ${stats.rankedPoints || rankStyle.subtitle}
            </div>
          </div>

        </div>

        <div class="text-[11px] text-slate-400 px-1 flex flex-wrap items-center justify-between gap-1">
          <span class="text-emerald-400"><i class="fa-solid fa-circle-check text-[10px]"></i> Datos sincronizados con el nuevo sistema de rangos competitivos</span>
          <span class="text-slate-500">Club: <strong class="text-slate-400">${stats.club || 'VanguardGhost'}</strong></span>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Inyección limpia y no destructiva en el Modal existente
  // ---------------------------------------------------------------------------
  function attachStatsToModal(personId) {
    if (!personId || personId === 'gin') return;

    const modalBox = document.querySelector('#modal-container .brawl-card');
    if (!modalBox) return;

    // Eliminar si ya existía para refresco limpio
    const existing = modalBox.querySelector('#brawl-stats-box');
    if (existing) existing.remove();

    // Localizar el contenedor de contenido del modal
    const contentArea = modalBox.querySelector('.space-y-4');
    if (contentArea) {
      const statsWrapper = document.createElement('div');
      statsWrapper.innerHTML = buildStatsCardHtml(personId);
      contentArea.appendChild(statsWrapper.firstElementChild);
    }
  }

  // ---------------------------------------------------------------------------
  // Controlador Global de Modificación y Utilidades
  // ---------------------------------------------------------------------------
  window.VG_BRAWL_STATS_CONTROLLER = {
    copyTag: function (tag) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tag).then(() => {
          alert('Tag copiado al portapapeles: ' + tag);
        }).catch(() => {
          prompt('Copia tu Tag:', tag);
        });
      } else {
        prompt('Copia tu Tag:', tag);
      }
    },

    promptEditStats: function (personId) {
      const current = getCustomStats(personId);
      if (!current) return;

      const newTrophiesStr = prompt(
        `[${personId.toUpperCase()}]\nIntroduce las COPAS actuales de Brawl Stars:`, 
        current.trophies
      );
      if (newTrophiesStr === null) return;
      const newTrophies = parseInt(newTrophiesStr.replace(/\D/g, ''), 10) || current.trophies;

      const newPrestigesStr = prompt(
        `Introduce el nivel de PRESTIGIOS TOTALES:`, 
        current.prestiges
      );
      if (newPrestigesStr === null) return;
      const newPrestiges = parseInt(newPrestigesStr.replace(/\D/g, ''), 10) || current.prestiges;

      const newRank = prompt(
        `Selecciona o escribe el RANGO en el Modo Competitivo:\n\n` +
        `• PRO  (Nuevo Rango Supremo 👑)\n` +
        `• Maestros 1, Maestros 2 o Maestros 3\n` +
        `• Legendario 1, Legendario 2 o Legendario 3\n` +
        `• Mítico 1, Mítico 2 o Mítico 3\n\n` +
        `Rango actual: ${current.rankedRank}`, 
        current.rankedRank
      );
      if (newRank === null) return;

      const updated = Object.assign({}, current, {
        trophies: newTrophies,
        highestTrophies: Math.max(newTrophies, current.highestTrophies || newTrophies),
        prestiges: newPrestiges,
        rankedRank: newRank.trim() || current.rankedRank
      });

      saveCustomStats(personId, updated);
      attachStatsToModal(personId);
    }
  };

  // ---------------------------------------------------------------------------
  // Enganche (Hook) sobre la función openModal de app.js
  // ---------------------------------------------------------------------------
  function hookAppModal() {
    if (!window.app) {
      setTimeout(hookAppModal, 50);
      return;
    }

    const originalOpenModal = window.app.openModal;
    if (typeof originalOpenModal === 'function') {
      window.app.openModal = function (id) {
        // Ejecutar el modal original de la aplicación
        originalOpenModal.apply(this, arguments);

        // Añadir de forma no destructiva las estadísticas solicitadas
        try {
          attachStatsToModal(id);
        } catch (err) {
          console.warn('Error al adjuntar estadísticas de Brawl Stars:', err);
        }
      };
    }
  }

  // Iniciar el enganche cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookAppModal);
  } else {
    hookAppModal();
  }

  // Exportar base de datos
  window.VG_BRAWL_STATS = DEFAULT_BRAWL_STATS;

})();
