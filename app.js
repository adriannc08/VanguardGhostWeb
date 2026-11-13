/**
 * Vanguard Ghost (VG) - Club Profesional de Brawl Stars
 * Lógica de la plantilla con roles de combate específicos y fotos personalizadas
 * Carga inteligente y automática de logos de jugadores y directiva
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Efectos de sonido procedurales (Web Audio API)
  // ---------------------------------------------------------------------------
  class SoundController {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    }

    playPop() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.audioCtx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.09, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  const sfx = new SoundController();

  // ---------------------------------------------------------------------------
  // Utilidad visual de roles
  // ---------------------------------------------------------------------------
  function getRoleBadge(role) {
    const r = role.toLowerCase().trim();
    if (r.includes('tirador')) {
      return { icon: '🎯', label: role, class: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
    }
    if (r.includes('control')) {
      return { icon: '🌀', label: role, class: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
    }
    if (r.includes('asesino')) {
      return { icon: '⚡', label: role, class: 'bg-rose-950/80 text-rose-300 border-rose-500/40' };
    }
    if (r.includes('tanque') && r.includes('destructor')) {
      return { icon: '💥🛡️', label: role, class: 'bg-amber-950/80 text-amber-300 border-amber-500/40' };
    }
    if (r.includes('tanque')) {
      return { icon: '🛡️', label: role, class: 'bg-blue-950/80 text-blue-300 border-blue-500/40' };
    }
    if (r.includes('apoyo')) {
      return { icon: '💚', label: role, class: 'bg-teal-950/80 text-teal-300 border-teal-500/40' };
    }
    if (r.includes('destructor') || r.includes('thrower')) {
      return { icon: '💣', label: role, class: 'bg-orange-950/80 text-orange-300 border-orange-500/40' };
    }
    return { icon: '⭐', label: role, class: 'bg-slate-800 text-slate-300 border-slate-700' };
  }

  // ---------------------------------------------------------------------------
  // Generador de etiquetas <img> con fallback dinámico inteligente
  // ---------------------------------------------------------------------------
  function renderAvatarImg(person, extraClasses = '', extraStyle = '') {
    const cached = window.app && window.app.avatarCache && window.app.avatarCache[person.id];
    let candidates = [...(person.avatarCandidates || [person.avatar])];
    if (cached) {
      candidates = [cached, ...candidates.filter(c => c !== cached)];
    }
    const initialSrc = candidates[0];
    const candidatesAttr = encodeURIComponent(JSON.stringify(candidates));
    const fallbackSrc = person.fallbackAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

    return `<img 
      src="${initialSrc}" 
      alt="${person.inGameName || person.name}" 
      data-person-id="${person.id}" 
      data-candidates="${candidatesAttr}" 
      data-candidate-idx="0" 
      data-fallback="${fallbackSrc}" 
      class="${extraClasses}" 
      style="${extraStyle}" 
      onload="window.app && window.app.onAvatarLoaded && window.app.onAvatarLoaded(this, '${person.id}')" 
      onerror="window.app && window.app.tryNextAvatar ? window.app.tryNextAvatar(this) : (this.src='${fallbackSrc}')" 
    />`;
  }

  // ---------------------------------------------------------------------------
  // Datos del Club: Vanguard Ghost (VG) - España 🇪🇸
  // ---------------------------------------------------------------------------
  const TEAM_DATA = {
    ceo: {
      id: 'gin',
      name: 'Gin',
      inGameName: 'Gin',
      role: 'CEO & Fundador',
      category: 'ceo',
      age: 23,
      location: 'España 🇪🇸',
      badge: '👑 Liderazgo & Gestión',
      avatar: 'Gin.jpeg',
      avatarCandidates: [
        'img/LOGO GIN.png'
      ],
      fallbackAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      description: 'Fundador y máximo responsable de Vanguard Ghost. Dirige el proyecto deportivo, la organización del club y la representación institucional del equipo.',
      responsibilities: [
        'Dirección estratégica y representación del club',
        'Gestión de plantilla y patrocinios',
        'Coordinación general de entrenamientos y competiciones'
      ]
    },

    players: [
      {
        id: 'obri11',
        name: 'Obri11',
        inGameName: 'VG | Obri11',
        roleTitle: 'Main Drafter & Jugador',
        roles: ['Tanque', 'Asesino', 'Destructor/Thrower'],
        isDrafter: true,
        age: 19,
        location: 'España 🇪🇸',
        badge: '🧠 Main Drafter del Equipo',
        avatar: 'Obri11.jpeg',
        avatarCandidates: [
          'img/LOGO OBR11.png',
          'media_1794588758188_3a4e6187.jpg',
          'file:///C:/Users/adria/.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588758188_3a4e6187.jpg',
          '../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588758188_3a4e6187.jpg',
          '../../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588758188_3a4e6187.jpg'
        ],
        fallbackAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80',
        description: 'Cerebro táctico y jugador activo de Vanguard Ghost. Encargado principal del análisis de la fase de draft, bans y contra-estrategias en cada mapa, además de competir con roles de alta versatilidad.',
        playstyle: 'Dominio de la primera línea como Tanque, letalidad como Asesino y control de distancias y muros como Destructor/Thrower.'
      },
      {
        id: 'shineyt',
        name: 'ShineYT',
        inGameName: 'VG | ShineYT',
        roleTitle: 'Jugador',
        roles: ['Tirador de élite', 'Asesinos', 'Control'],
        isDrafter: false,
        age: 18,
        location: 'España 🇪🇸',
        badge: '📺 Canal de YouTube Oficial',
        avatar: 'Logo Original ShineYT.jpeg',
        avatarCandidates: [
          'img/Logo Original ShineYT.jpeg'
        ],
        fallbackAvatar: 'Logo Original ShineYT.jpeg',
        description: 'Jugador estrella con gran presencia en YouTube. Destaca por su puntería letal a larga distancia como Tirador de élite, agresividad precisa como Asesino y firmeza en el Control territorial.',
        playstyle: 'Mecánicas quirúrgicas a distancia, agresividad medida y capacidad constante para asegurar bajas decisivas.'
      },
      {
        id: 'peter100',
        name: 'Peter100',
        inGameName: 'VG | Peter100',
        roleTitle: 'Jugador',
        roles: ['Control', 'Tirador de élite', 'Asesino'],
        isDrafter: false,
        age: 19,
        location: 'España 🇪🇸',
        badge: '🎯 Francotirador & Control',
        avatar: 'Peter100.jpeg',
        avatarCandidates: [
          'img/LOGO PETER.png'
        ],
        fallbackAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        description: 'Perfil multidisciplinar de gran precisión. Especializado en el Control de carriles, impacto crítico a larga distancia como Tirador de élite e incursiones rápidas como Asesino.',
        playstyle: 'Posicionamiento estratégico, dominio de ángulos de tiro y remate veloz en situaciones de ventaja.'
      },
      {
        id: 'gohan070',
        name: 'Gohan070',
        inGameName: 'VG | Gohan070',
        roleTitle: 'Jugador',
        roles: ['Control', 'Apoyo', 'Tirador de élite'],
        isDrafter: false,
        age: 19,
        location: 'España 🇪🇸',
        badge: '🌀 Control & Soporte',
        avatar: 'Gohan070.jpeg',
        avatarCandidates: [
          'img/LOGO GOHAN.png',
          'media_1794588758056_dc967074.jpg',
          'file:///C:/Users/adria/.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588758056_dc967074.jpg',
          '../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588758056_dc967074.jpg',
          '../../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588758056_dc967074.jpg'
        ],
        fallbackAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        description: 'Pilar táctico del equipo. Combina el Control de zonas con utilidades vitales de Apoyo a los compañeros y capacidad de castigo a larga distancia como Tirador de élite.',
        playstyle: 'Juego colectivo inteligente, soporte defensivo y visión de mapa para facilitar los avances del equipo.'
      },
      {
        id: 'dsr',
        name: 'DSR',
        inGameName: 'VG | DSR',
        roleTitle: 'Jugador',
        roles: ['Destructor/Tanque', 'Control', 'Tirador de élite'],
        isDrafter: false,
        age: 20,
        location: 'España 🇪🇸',
        badge: '💥 Resistencia & Daño',
        avatar: 'DSR.jpeg',
        avatarCandidates: [
          'img/LOGO DSR.png',
          'media_1794588757995_b2b5ee62.jpg',
          'file:///C:/Users/adria/.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757995_b2b5ee62.jpg',
          '../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757995_b2b5ee62.jpg',
          '../../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757995_b2b5ee62.jpg'
        ],
        fallbackAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        description: 'Potencia pesada y versatilidad. Actúa como Destructor/Tanque rompiendo formaciones enemigas, garantizando el Control de mapa y aportando gran daño a distancia como Tirador de élite.',
        playstyle: 'Fuerza de choque, apertura de espacios en mapa y versatilidad de rango según la necesidad del set.'
      },
      {
        id: 'patoduck',
        name: 'Patoduck1999',
        inGameName: 'Patoduck1999',
        roleTitle: 'Jugador',
        roles: ['Control', 'Tirador de élite', 'Apoyo'],
        isDrafter: false,
        age: 20,
        location: 'España 🇪🇸',
        badge: '🦆 Nueva Incorporación',
        avatar: 'Patoduck1999.jpeg',
        avatarCandidates: [
          'img/LOGO PATODUCK.png',
          'media_1794588757926_a220b0de.jpg',
          'file:///C:/Users/adria/.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757926_a220b0de.jpg',
          '../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757926_a220b0de.jpg',
          '../../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757926_a220b0de.jpg'
        ],
        fallbackAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        description: 'Incorporación clave para la rotación competitiva. Aporta solidez en el Control de objetivos, fuego de precisión como Tirador de élite y sinergias protectoras de Apoyo.',
        playstyle: 'Excelente toma de decisiones bajo presión, estabilidad en la línea y equilibrio táctico entre ataque y defensa.'
      },
      {
        id: 'osky',
        name: 'Osky',
        inGameName: 'osky777__',
        roleTitle: 'Jugador',
        roles: ['Control', 'Apoyo', 'Flex'],
        isDrafter: false,
        age: 18,
        location: 'España 🇪🇸',
        badge: '💚 Soporte de Plantilla',
        avatar: 'Osky.jpeg',
        avatarCandidates: [
          'img/LOGO OSKY.png',
          'media_1794588757870_c88d8454.jpg',
          'file:///C:/Users/adria/.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757870_c88d8454.jpg',
          '../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757870_c88d8454.jpg',
          '../../../.gemini/antigravity/brain/e4a4a765-a05d-483e-9896-d185396d593a/.user_uploaded/media_1794588757870_c88d8454.jpg'
        ],
        fallbackAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        description: 'Jugador de apoyo táctico y control de ritmo. Aporta utilidades de contención, curación y cobertura a los flancos con gran versatilidad.',
        playstyle: 'Soporte continuo, utilidades clave y lectura limpia de los movimientos del rival.'
      }
    ]
  };

  // ---------------------------------------------------------------------------
  // Estado de la Aplicación
  // ---------------------------------------------------------------------------
  const state = {
    currentTab: 'home',
    selectedPerson: null
  };

  // ---------------------------------------------------------------------------
  // Renderizador: Pantalla de Inicio (Home)
  // ---------------------------------------------------------------------------
  function renderHomeView() {
    return `
      <!-- Banner Hero Principal -->
      <section class="relative rounded-3xl overflow-hidden p-8 md:p-12 mb-10 border border-slate-800 bg-gradient-to-br from-[#12182a] via-[#0c101d] to-[#080b14] shadow-2xl">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Club Oficial Brawl Stars • España 🇪🇸
          </div>
          <h1 class="text-4xl sm:text-6xl font-brawl tracking-wider text-white mb-3">
            VANGUARD GHOST
          </h1>
          <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            Equipo profesional de esports de Brawl Stars. Dominio del mapa, sinergia táctica y mecánicas de alta competición bajo una plantilla 100% española.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <button onclick="window.app.switchTab('team')" class="btn-vg btn-vg-cyan text-sm py-3 px-6">
              <i class="fa-solid fa-users mr-1"></i> Ver Equipo & Roles
            </button>
            <div class="text-xs text-slate-400 flex items-center gap-2">
              <i class="fa-solid fa-crown text-amber-400"></i> CEO: <strong class="text-white">Gin</strong>
              <span class="text-slate-600">•</span>
              <i class="fa-solid fa-brain text-purple-400"></i> Main Drafter: <strong class="text-white">VG | Obri11</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Métricas Clave del Equipo -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div class="brawl-card p-5 text-center border-cyan-500/30">
          <div class="text-[11px] font-tech text-cyan-400 uppercase tracking-wider mb-1">Dirección & CEO</div>
          <div class="text-2xl font-brawl text-white">Gin</div>
          <div class="text-[11px] text-slate-400 mt-1">Fundador del Club</div>
        </div>

        <div class="brawl-card p-5 text-center border-purple-500/30">
          <div class="text-[11px] font-tech text-purple-400 uppercase tracking-wider mb-1">Main Drafter</div>
          <div class="text-2xl font-brawl text-purple-300">VG | Obri11</div>
          <div class="text-[11px] text-slate-400 mt-1">Estrategia & Jugador</div>
        </div>

        <div class="brawl-card p-5 text-center border-amber-500/30">
          <div class="text-[11px] font-tech text-amber-400 uppercase tracking-wider mb-1">Jugadores Activos</div>
          <div class="text-2xl font-brawl text-amber-300">${TEAM_DATA.players.length} Jugadores</div>
          <div class="text-[11px] text-slate-400 mt-1">Plantilla Completa</div>
        </div>

        <div class="brawl-card p-5 text-center border-emerald-500/30">
          <div class="text-[11px] font-tech text-emerald-400 uppercase tracking-wider mb-1">Origen & Región</div>
          <div class="text-2xl font-brawl text-emerald-300">España 🇪🇸</div>
          <div class="text-[11px] text-slate-400 mt-1">100% Talento Nacional</div>
        </div>
      </section>

      <!-- Resumen Rápido de la Plantilla con sus Roles -->
      <section class="mb-8">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="text-2xl font-brawl text-white">ROLES DE COMBATE EN PARTIDA</h2>
            <p class="text-slate-400 text-xs">Atributos y especialidades asignadas a cada jugador</p>
          </div>
          <button onclick="window.app.switchTab('team')" class="text-xs text-cyan-400 font-bold hover:underline">
            Ir a la sección de Equipo →
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${TEAM_DATA.players.map(p => `
            <div class="brawl-card p-4 cursor-pointer hover:border-cyan-400/50" onclick="window.app.openModal('${p.id}')">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="font-brawl text-lg text-white">${p.inGameName}</h3>
                  <div class="text-xs text-slate-400">${p.roleTitle} • ${p.age} años • ${p.location}</div>
                </div>
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                  ${renderAvatarImg(p, 'w-full h-full object-cover object-center')}
                </div>
              </div>

              <!-- Roles Pills -->
              <div class="flex flex-wrap gap-1.5 my-2.5">
                ${p.roles.map(r => {
                  const badge = getRoleBadge(r);
                  return `
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${badge.class}">
                      <span>${badge.icon}</span> <span>${badge.label}</span>
                    </span>
                  `;
                }).join('')}
              </div>

              <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                ${p.description}
              </p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // ---------------------------------------------------------------------------
  // Renderizador: Pantalla de Equipo (Team)
  // ---------------------------------------------------------------------------
  function renderTeamView() {
    const ceo = TEAM_DATA.ceo;
    const players = TEAM_DATA.players;

    return `
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase mb-2">
          <i class="fa-solid fa-users"></i> Vanguard Ghost
        </div>
        <h1 class="text-3xl md:text-5xl font-brawl text-white">PLANTILLA Y ROLES</h1>
        <p class="text-slate-400 text-sm max-w-2xl mt-1">
          Alineación oficial de Vanguard Ghost. Todos los integrantes son de España 🇪🇸. Sin coach ni analista externos: las decisiones tácticas y de draft las lidera directamente nuestro Main Drafter y jugador <strong>VG | Obri11</strong>.
        </p>
      </div>

      <!-- Sección: CEO & Dirección -->
      <section class="mb-10">
        <h2 class="text-xs font-tech text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <i class="fa-solid fa-crown text-amber-400"></i> CEO & Liderazgo
        </h2>

        <div class="brawl-card p-6 md:p-8 border-amber-500/30 bg-gradient-to-br from-[#12182c] to-[#0c101d] max-w-3xl cursor-pointer hover:border-amber-400/60" onclick="window.app.openModal('gin')">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div class="w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-400 shrink-0 shadow-lg">
              ${renderAvatarImg(ceo, 'w-full h-full object-cover object-top')}
            </div>

            <div class="space-y-3 flex-1 text-center sm:text-left">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    ${ceo.badge}
                  </span>
                  <h3 class="font-brawl text-3xl text-white mt-1">${ceo.name}</h3>
                  <div class="text-xs text-amber-300 font-semibold">${ceo.role}</div>
                </div>
                <div class="text-xs text-slate-400">
                  <span class="font-bold text-slate-200">${ceo.age} años</span> • <span>${ceo.location}</span>
                </div>
              </div>

              <p class="text-xs text-slate-300 leading-relaxed">
                ${ceo.description}
              </p>

              <div class="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-cyan-400 font-bold">
                <span>Responsable de patrocinios, plantilla y visión del club</span>
                <span>Ficha completa →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección: Jugadores Profesionales -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <i class="fa-solid fa-gamepad text-cyan-400"></i> Jugadores y Atributos de Rol (${players.length})
          </h2>
          <span class="text-xs text-slate-400">Talento Nacional • España 🇪🇸</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${players.map(p => `
            <div class="brawl-card p-5 flex flex-col justify-between cursor-pointer hover:border-cyan-400/50 group" onclick="window.app.openModal('${p.id}')">
              <div>
                <!-- Imagen y Etiquetas -->
                <div class="relative h-56 rounded-xl overflow-hidden mb-4 bg-slate-900 border border-slate-800">
                  ${renderAvatarImg(p, 'w-full h-full object-cover object-center transition duration-300 group-hover:scale-105')}
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent pointer-events-none"></div>
                  
                  <div class="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-bold ${p.isDrafter ? 'bg-purple-900/80 text-purple-200 border border-purple-400/50' : p.id === 'shineyt' ? 'bg-red-900/80 text-red-200 border border-red-400/50' : 'bg-slate-900/80 text-slate-200 border border-slate-700'} backdrop-blur-md">
                    ${p.badge}
                  </div>

                  <div class="absolute bottom-3 left-3 right-3 pointer-events-none">
                    <div class="font-brawl text-2xl text-white group-hover:text-cyan-300 transition">
                      ${p.inGameName}
                    </div>
                    <div class="text-xs text-slate-300 font-semibold">${p.roleTitle} • ${p.age} años</div>
                  </div>
                </div>

                <!-- Roles de Combate (Atributos destacados) -->
                <div class="space-y-3 mb-4">
                  <div>
                    <div class="text-[10px] font-tech text-slate-400 uppercase tracking-wider mb-1.5">Roles de Combate:</div>
                    <div class="flex flex-wrap gap-1.5">
                      ${p.roles.map(r => {
                        const badge = getRoleBadge(r);
                        return `
                          <span class="px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${badge.class}">
                            <span>${badge.icon}</span> <span>${badge.label}</span>
                          </span>
                        `;
                      }).join('')}
                    </div>
                  </div>

                  <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between text-xs">
                    <span class="text-slate-400">Residencia:</span>
                    <span class="font-bold text-white">${p.location}</span>
                  </div>

                  <!-- Breve explicación del rol -->
                  <p class="text-xs text-slate-300 leading-relaxed line-clamp-3 pt-1">
                    ${p.description}
                  </p>
                </div>
              </div>

              <!-- Pie de Tarjeta -->
              <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-bold">
                <span>Ver ficha detallada</span>
                <span class="group-hover:translate-x-1 transition">→</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // ---------------------------------------------------------------------------
  // Modal de Detalle
  // ---------------------------------------------------------------------------
  function renderDetailModal(person) {
    if (!person) return '';
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onclick="window.app.closeModal(event)">
        <div class="brawl-card max-w-xl w-full p-6 md:p-8 bg-[#0d1324] border-cyan-400/40 shadow-2xl relative" onclick="event.stopPropagation()">
          <button onclick="window.app.closeModalDirect()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-lg">
            ✕
          </button>

          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5 pb-5 border-b border-slate-800">
            <div class="w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border-2 ${person.category === 'ceo' ? 'border-amber-400' : person.isDrafter ? 'border-purple-400' : 'border-cyan-400'} shrink-0">
              ${renderAvatarImg(person, 'w-full h-full object-cover object-center')}
            </div>
            <div class="text-center sm:text-left">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                ${person.badge}
              </span>
              <h3 class="font-brawl text-2xl text-white mt-1.5">${person.inGameName || person.name}</h3>
              <div class="text-xs font-semibold text-cyan-300">${person.roleTitle || person.role}</div>
              <div class="text-xs text-slate-400 mt-1">${person.age} años • ${person.location}</div>
            </div>
          </div>

          <div class="space-y-4 text-xs">
            ${person.roles ? `
              <div>
                <h4 class="font-tech text-slate-400 uppercase text-[11px] mb-2">Roles y Atributos en Partida</h4>
                <div class="flex flex-wrap gap-2">
                  ${person.roles.map(r => {
                    const badge = getRoleBadge(r);
                    return `
                      <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold ${badge.class}">
                        <span class="text-sm">${badge.icon}</span> <span>${badge.label}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

            <div>
              <h4 class="font-tech text-slate-400 uppercase text-[11px] mb-1">Descripción del Integrante</h4>
              <p class="text-slate-300 leading-relaxed">${person.description}</p>
            </div>

            ${person.playstyle ? `
              <div>
                <h4 class="font-tech text-slate-400 uppercase text-[11px] mb-1">Estilo de Combate</h4>
                <p class="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">${person.playstyle}</p>
              </div>
            ` : ''}

            ${person.responsibilities ? `
              <div>
                <h4 class="font-tech text-slate-400 uppercase text-[11px] mb-2">Responsabilidades Clave</h4>
                <ul class="space-y-1.5 list-disc list-inside text-slate-300">
                  ${person.responsibilities.map(r => `<li>${r}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>

          <div class="mt-6 pt-4 border-t border-slate-800 text-right">
            <button onclick="window.app.closeModalDirect()" class="btn-vg btn-vg-outline text-xs py-2 px-5">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Controlador Principal de la Aplicación
  // ---------------------------------------------------------------------------
  class AppController {
    constructor() {
      this.state = state;
      this.avatarCache = {};
    }

    init() {
      // Cargar caché de avatares desde localStorage si existe
      try {
        const savedCache = localStorage.getItem('vg_avatar_cache');
        if (savedCache) {
          this.avatarCache = JSON.parse(savedCache);
        }
      } catch (e) {}

      // Sincronización con el hash de la URL (#home, #team)
      window.addEventListener('hashchange', () => this.handleHashRoute());

      if (window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'team' || hash === 'home') {
          this.state.currentTab = hash;
        }
      }

      this.render();
      this.updateNav();
    }

    onAvatarLoaded(img, personId) {
      if (!personId || !img || !img.currentSrc) return;
      const src = img.currentSrc || img.src;
      // No guardar el fallback de Unsplash en caché para permitir seguir intentando locales
      if (src.includes('unsplash.com')) return;
      
      this.avatarCache[personId] = src;
      try {
        localStorage.setItem('vg_avatar_cache', JSON.stringify(this.avatarCache));
      } catch (e) {}
    }

    tryNextAvatar(img) {
      try {
        const raw = img.getAttribute('data-candidates');
        const fallback = img.getAttribute('data-fallback') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        if (!raw) {
          img.onerror = null;
          img.src = fallback;
          return;
        }

        const candidates = JSON.parse(decodeURIComponent(raw));
        let idx = parseInt(img.getAttribute('data-candidate-idx') || '0', 10) + 1;

        if (idx < candidates.length) {
          img.setAttribute('data-candidate-idx', idx.toString());
          img.src = candidates[idx];
        } else {
          img.onerror = null;
          img.src = fallback;
        }
      } catch (e) {
        img.onerror = null;
        img.src = img.getAttribute('data-fallback') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      }
    }

    handleHashRoute() {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'team' || hash === 'home') {
        this.switchTab(hash, false);
      }
    }

    switchTab(tab, updateHash = true) {
      sfx.playClick();
      this.state.currentTab = tab;
      if (updateHash) {
        window.location.hash = tab;
      }
      this.render();
      this.updateNav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateNav() {
      const tabs = ['home', 'team'];
      tabs.forEach(t => {
        const desktopBtn = document.getElementById(`nav-btn-${t}`);
        const mobileBtn = document.getElementById(`nav-mobile-${t}`);
        const isActive = this.state.currentTab === t;

        if (desktopBtn) {
          if (isActive) {
            desktopBtn.className = 'px-5 py-2 rounded-xl text-sm font-brawl uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-cyan';
          } else {
            desktopBtn.className = 'px-5 py-2 rounded-xl text-sm font-brawl uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/80 transition';
          }
        }

        if (mobileBtn) {
          if (isActive) {
            mobileBtn.className = 'py-2 px-3 text-center text-xs font-brawl uppercase text-cyan-300 bg-cyan-950/60 rounded-xl border border-cyan-400/40';
          } else {
            mobileBtn.className = 'py-2 px-3 text-center text-xs font-brawl uppercase text-slate-400 hover:text-white';
          }
        }
      });
    }

    render() {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      if (this.state.currentTab === 'team') {
        mainContent.innerHTML = renderTeamView();
      } else {
        mainContent.innerHTML = renderHomeView();
      }
    }

    openModal(id) {
      sfx.playPop();
      let person = null;
      if (id === 'gin') {
        person = TEAM_DATA.ceo;
      } else {
        person = TEAM_DATA.players.find(p => p.id === id);
      }
      if (!person) return;

      const container = document.getElementById('modal-container');
      if (container) {
        container.innerHTML = renderDetailModal(person);
      }
    }

    closeModalDirect() {
      sfx.playClick();
      const container = document.getElementById('modal-container');
      if (container) container.innerHTML = '';
    }

    closeModal(e) {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModalDirect();
      }
    }

    toggleAudio() {
      const active = sfx.toggle();
      const btn = document.getElementById('audio-toggle-btn');
      if (btn) {
        btn.innerHTML = active
          ? '<i class="fa-solid fa-volume-high text-cyan-400"></i>'
          : '<i class="fa-solid fa-volume-xmark text-slate-500"></i>';
      }
    }
  }

  // Exportar al objeto global
  window.app = new AppController();
  document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
  });
})();
