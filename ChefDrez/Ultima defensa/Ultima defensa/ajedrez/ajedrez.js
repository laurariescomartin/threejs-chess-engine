import * as THREE from 'three';

// Importa tus piezas (modelos)
import { Caballo } from '../Caballo/Caballo.js';       // Caballo
import { Rey } from '../Rey/Rey.js';    // Rey
import { Cuchillo } from '../cuchillo/Cuchillo.js';    // Alfil
import { sarten } from '../sarten/sarten.js';          // Reina
import { Torre } from '../Torre/Torre.js';     // Torre
import { taza } from '../taza2/taza.js';                // Peón
import { Tabla } from '../Tabla/Tabla.js';
import { Camera } from '../libs/three.core.js';

// Función auxiliar para obtener la pieza raíz con atributo team
function getRootPiece(obj) {
  let pieza = obj;
  while (pieza && !pieza.team && pieza.parent) {
    pieza = pieza.parent;
  }
  return pieza;
}

// Offsets verticales para que las piezas queden justo tocando el tablero sin atravesarlo
const OFFSET_TORRE = -0.0099;
const OFFSET_ALFIL = -0.01;
const OFFSET_REINA = 0;
const OFFSET_REY = 0;
const OFFSET_CABALLO = -0.01;
const OFFSET_PEON = 0;

class MovimientoPeon {
  obtenerMovimientosLegales(fila, col, ajedrez, pieza) {
    const movimientos = [];
    const direccion = (pieza.team === 'white') ? 1 : -1;
    const filaAdelante = fila + direccion;

    if (ajedrez.tablero.esCasillaValida(filaAdelante, col) && !ajedrez.tablero.getPiece(filaAdelante, col)) {
      const casilla1 = ajedrez.tablero.getCasilla(filaAdelante, col);
      if (casilla1) movimientos.push(casilla1);

      const filaInicial = (pieza.team === 'white') ? 1 : 6;
      const filaDoble = fila + 2 * direccion;
      if (
        fila === filaInicial &&
        ajedrez.tablero.esCasillaValida(filaDoble, col) &&
        !ajedrez.tablero.getPiece(filaDoble, col)
      ) {
        const casilla2 = ajedrez.tablero.getCasilla(filaDoble, col);
        if (casilla2) movimientos.push(casilla2);
      }
    }

    for (const dc of [-1, 1]) {
      const colDiagonal = col + dc;
      if (ajedrez.tablero.esCasillaValida(filaAdelante, colDiagonal)) {
        const piezaEnDiagonal = ajedrez.tablero.getPiece(filaAdelante, colDiagonal);
        const piezaRaiz = getRootPiece(piezaEnDiagonal);
        if (piezaRaiz && piezaRaiz.team !== pieza.team) {
          const casillaCaptura = ajedrez.tablero.getCasilla(filaAdelante, colDiagonal);
          if (casillaCaptura) movimientos.push(casillaCaptura);
        }
      }
    }

    return movimientos;
  }
}

class MovimientoTorre {
  puedeCapturar(piezaPropia, piezaObjetivo) {
    if (!piezaObjetivo) return false;
    const rootObjetivo = getRootPiece(piezaObjetivo);
    if (!rootObjetivo) return false;
    return rootObjetivo.team !== piezaPropia.team;
  }

  obtenerMovimientosLegales(fila, col, ajedrez, pieza) {
    const movimientos = [];
    const direcciones = [ [1, 0], [-1, 0], [0, 1], [0, -1] ];
    for (const [df, dc] of direcciones) {
      let i = fila + df;
      let j = col + dc;
      while (ajedrez.tablero.esCasillaValida(i, j)) {
        const ocup = ajedrez.tablero.getPiece(i, j);
        if (ocup) {
          if (this.puedeCapturar(pieza, ocup)) {
            movimientos.push(ajedrez.tablero.getCasilla(i, j));
          }
          break;
        }
        movimientos.push(ajedrez.tablero.getCasilla(i, j));
        i += df;
        j += dc;
      }
    }
    return movimientos;
  }
}

class MovimientoAlfil {
  puedeCapturar(piezaPropia, piezaObjetivo) {
    if (!piezaObjetivo) return false;
    const rootObjetivo = getRootPiece(piezaObjetivo);
    if (!rootObjetivo) return false;
    return rootObjetivo.team !== piezaPropia.team;
  }

  obtenerMovimientosLegales(fila, col, ajedrez, pieza) {
    const movimientos = [];
    const direcciones = [ [1,1], [1,-1], [-1,1], [-1,-1] ];
    for (const [df, dc] of direcciones) {
      let i = fila + df;
      let j = col + dc;
      while (ajedrez.tablero.esCasillaValida(i, j)) {
        const ocup = ajedrez.tablero.getPiece(i, j);
        if (ocup) {
          if (this.puedeCapturar(pieza, ocup)) {
            movimientos.push(ajedrez.tablero.getCasilla(i, j));
          }
          break;
        }
        movimientos.push(ajedrez.tablero.getCasilla(i, j));
        i += df;
        j += dc;
      }
    }
    return movimientos;
  }
}

class MovimientoReina {
  puedeCapturar(piezaPropia, piezaObjetivo) {
    if (!piezaObjetivo) return false;
    const rootObjetivo = getRootPiece(piezaObjetivo);
    if (!rootObjetivo) return false;
    return rootObjetivo.team !== piezaPropia.team;
  }

  obtenerMovimientosLegales(fila, col, ajedrez, pieza) {
    const movimientos = [];
    const direcciones = [ [1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1] ];
    for (const [df, dc] of direcciones) {
      let i = fila + df;
      let j = col + dc;
      while (ajedrez.tablero.esCasillaValida(i, j)) {
        const ocup = ajedrez.tablero.getPiece(i, j);
        if (ocup) {
          if (this.puedeCapturar(pieza, ocup)) {
            movimientos.push(ajedrez.tablero.getCasilla(i, j));
          }
          break;
        }
        movimientos.push(ajedrez.tablero.getCasilla(i, j));
        i += df;
        j += dc;
      }
    }
    return movimientos;
  }
}

class MovimientoRey {
  obtenerMovimientosLegales(fila, col, ajedrez, pieza) {
    const movimientos = [];
    const direcciones = [ [1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1] ];
    for (const [df, dc] of direcciones) {
      const i = fila + df;
      const j = col + dc;
      if (ajedrez.tablero.esCasillaValida(i, j)) {
        const ocup = ajedrez.tablero.getPiece(i, j);
        const rootOcup = getRootPiece(ocup);
        if (!rootOcup || rootOcup.team !== pieza.team) {
          movimientos.push(ajedrez.tablero.getCasilla(i, j));
        }
      }
    }
    return movimientos;
  }
}

class MovimientoCaballo {
  obtenerMovimientosLegales(fila, col, ajedrez, pieza) {
    const movimientos = [];
    const saltos = [ [2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2], [1,-2], [2,-1] ];
    for (const [df, dc] of saltos) {
      const i = fila + df;
      const j = col + dc;
      if (ajedrez.tablero.esCasillaValida(i, j)) {
        const ocup = ajedrez.tablero.getPiece(i, j);
        const rootOcup = getRootPiece(ocup);
        if (!rootOcup || rootOcup.team !== pieza.team) {
          movimientos.push(ajedrez.tablero.getCasilla(i, j));
        }
      }
    }
    return movimientos;
  }
}

class Ajedrez extends THREE.Object3D {
  constructor() {
    super();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.tablero = new Tabla();
    this.add(this.tablero);

    this.piezas = [];
    this.pieces = this.piezas;
    this.tiles = this.tablero.casillas;

    this.piezasCapturadasCount = 0;
    this.piezasCapturadas = [];

    this.turn= 'white';
    this.camera= new Camera;

    // --- Crear piezas blancas ---
    const torre1 = new Torre();
torre1.team = 'white';
torre1.movementStrategy = new MovimientoTorre();
this.colocarPieza(torre1, 0, 0);
torre1.position.y += OFFSET_TORRE;
torre1.scale.set(4, 4, 4);

const torre2 = new Torre();
torre2.team = 'white';
torre2.movementStrategy = new MovimientoTorre();
this.colocarPieza(torre2, 0, 7);
torre2.position.y += OFFSET_TORRE;
torre2.scale.set(4, 4, 4);

const alfil1 = new Cuchillo();
alfil1.team = 'white';
alfil1.movementStrategy = new MovimientoAlfil();
this.colocarPieza(alfil1, 0, 2);
alfil1.position.y += OFFSET_ALFIL;
alfil1.scale.set(4, 4, 4);

const alfil2 = new Cuchillo();
alfil2.team = 'white';
alfil2.movementStrategy = new MovimientoAlfil();
this.colocarPieza(alfil2, 0, 5);
alfil2.position.y += OFFSET_ALFIL;
alfil2.scale.set(4, 4, 4);

const reina = new sarten();
reina.team = 'white';
reina.movementStrategy = new MovimientoReina();
this.colocarPieza(reina, 0, 3);
reina.position.y += OFFSET_REINA;
reina.scale.set(3,3,3);

const rey = new Rey();
rey.team = 'white';
rey.movementStrategy = new MovimientoRey();
this.colocarPieza(rey, 0, 4);
rey.position.y += OFFSET_REY;
rey.scale.set(2,2,2);

const caballo1 = new Caballo();
caballo1.team = 'white';
caballo1.movementStrategy = new MovimientoCaballo();
this.colocarPieza(caballo1, 0, 1);
caballo1.position.y += OFFSET_CABALLO;
caballo1.rotation.y = Math.PI;
caballo1.scale.set(3,3,3);

const caballo2 = new Caballo();
caballo2.team = 'white';
caballo2.movementStrategy = new MovimientoCaballo();
this.colocarPieza(caballo2, 0, 6);
caballo2.position.y += OFFSET_CABALLO;
caballo2.rotation.y = Math.PI;
caballo2.scale.set(3,3,3);

for(let c=0; c<8; c++) {
  const peon = new taza();
  peon.team = 'white';
  peon.movementStrategy = new MovimientoPeon();
  this.colocarPieza(peon, 1, c);
  peon.position.y += OFFSET_PEON;
  peon.scale.set(2,2,2);
  // No escalamos peones, solo piezas grandes
}

// --- Piezas negras ---
const torreN1 = new Torre();
torreN1.team = 'black';
torreN1.movementStrategy = new MovimientoTorre();
this.colocarPieza(torreN1, 7, 0);
torreN1.position.y += OFFSET_TORRE;
torreN1.rotation.y = Math.PI;
torreN1.scale.set(4, 4, 4);

const torreN2 = new Torre();
torreN2.team = 'black';
torreN2.movementStrategy = new MovimientoTorre();
this.colocarPieza(torreN2, 7, 7);
torreN2.position.y += OFFSET_TORRE;
torreN2.rotation.y = Math.PI;
torreN2.scale.set(4, 4, 4);

const alfilN1 = new Cuchillo();
alfilN1.team = 'black';
alfilN1.movementStrategy = new MovimientoAlfil();
this.colocarPieza(alfilN1, 7, 2);
alfilN1.position.y += OFFSET_ALFIL;
alfilN1.rotation.y = Math.PI;
alfilN1.scale.set(4, 4, 4);

const alfilN2 = new Cuchillo();
alfilN2.team = 'black';
alfilN2.movementStrategy = new MovimientoAlfil();
this.colocarPieza(alfilN2, 7, 5);
alfilN2.position.y += OFFSET_ALFIL;
alfilN2.rotation.y = Math.PI;
alfilN2.scale.set(4, 4, 4);

const reinaN = new sarten();
reinaN.team = 'black';
reinaN.movementStrategy = new MovimientoReina();
this.colocarPieza(reinaN, 7, 3);
reinaN.position.y += OFFSET_REINA;
reinaN.rotation.y = Math.PI;
reinaN.scale.set(3,3,3);

const reyN = new Rey();
reyN.team = 'black';
reyN.movementStrategy = new MovimientoRey();
this.colocarPieza(reyN, 7, 4);
reyN.position.y += OFFSET_REY;
reyN.rotation.y = Math.PI;
reyN.scale.set(2,2,2);

const caballoN1 = new Caballo();
caballoN1.team = 'black';
caballoN1.movementStrategy = new MovimientoCaballo();
this.colocarPieza(caballoN1, 7, 1);
caballoN1.position.y += OFFSET_CABALLO;
caballoN1.scale.set(3,3,3);

const caballoN2 = new Caballo();
caballoN2.team = 'black';
caballoN2.movementStrategy = new MovimientoCaballo();
this.colocarPieza(caballoN2, 7, 6);
caballoN2.position.y += OFFSET_CABALLO;
caballoN2.scale.set(3,3,3);
for(let c=0; c<8; c++) {
  const peonN = new taza();
  peonN.team = 'black';
  peonN.movementStrategy = new MovimientoPeon();
  this.colocarPieza(peonN, 6, c);
  peonN.position.y += OFFSET_PEON;
  peonN.rotation.y = Math.PI;
  peonN.scale.set(2, 2, 2);

  peonN.traverse((child) => {
    if (child.isMesh && child.material && child.material.color) {
      child.material.color.multiplyScalar(0.5);
    }
  });
}


this.selectedPiece = null;
this.highlightedTiles = [];

this.animating = false;
this.animationData = null;

  }

  colocarPieza(pieza, fila, col) {
    const casilla = this.tablero.getCasilla(fila, col);
    if (!casilla) {
      console.warn(`Casilla inválida fila ${fila}, col ${col}`);
      return;
    }

    pieza.userData.fila = fila;
    pieza.userData.col = col;

    pieza.position.set(casilla.position.x, casilla.position.y + 0.015, casilla.position.z);

    this.add(pieza);
    this.piezas.push(pieza);
    this.tablero.setPiece(fila, col, pieza);
  }

  highlightPossibleMoves(pieza) {
    this.resetHighlights();

    let obj = pieza;
    while (obj && !obj.movementStrategy) {
      obj = obj.parent;
    }
    if (!obj) return;

    const fila = obj.userData.fila;
    const col = obj.userData.col;
    const movimientos = obj.movementStrategy.obtenerMovimientosLegales(fila, col, this, obj);

    this.highlightedTiles = movimientos;

    movimientos.forEach(casilla => {
      if (!casilla || !casilla.material) return;
      casilla.material.emissive = new THREE.Color(0x00ff00);
    });
  }

  resetSelection() {
    if (this.selectedPiece) {
      this.resetHighlights();
      this.resetPieceHighlight(this.selectedPiece);
      this.selectedPiece = null;
    }
  }

  resetHighlights() {
    if (!this.highlightedTiles) return;

    this.highlightedTiles.forEach(casilla => {
      if (casilla && casilla.material) casilla.material.emissive = new THREE.Color(0x000000);
    });

    this.highlightedTiles = [];
  }

  highlightSelectedPiece(pieza) {
    if (pieza) {
      if (pieza.isMesh && pieza.material) {
        pieza.material.emissive = new THREE.Color(0xff0000);
      } else if (pieza.children && pieza.children.length) {
        pieza.children.forEach(child => {
          if (child.isMesh && child.material) child.material.emissive = new THREE.Color(0xff0000);
        });
      }
    }
  }

  resetPieceHighlight(pieza) {
    if (!pieza) return;
    if (pieza.isMesh && pieza.material) {
      pieza.material.emissive = new THREE.Color(0x000000);
    } else if (pieza.children && pieza.children.length > 0) {
      pieza.children.forEach(child => {
        if (child.isMesh && child.material) {
          child.material.emissive = new THREE.Color(0x000000);
        }
      });
    }
  }
changeTurn() {
  this.turn = (this.turn === 'white') ? 'black' : 'white';
  console.log("Turno cambiado a:", this.turn);  // <--- aquí
  if (this.camera && this.camera.userData.mySceneRef) {
    this.camera.userData.mySceneRef.moveCameraTo(this.turn);
  }
}

movePieceToTile(piezaDetectada, tile) {
  if (this.animating) return false;

  const pieza = getRootPiece(piezaDetectada);
  if (!pieza) return false;
  console.log("Turno actual:", this.turn);
console.log("Equipo pieza seleccionada:", pieza.team);
if (pieza.team !== this.turn) {
  console.log("No es tu turno");
  this.resetSelection();
  return false;
}

  const filaAntigua = pieza.userData.fila;
  const colAntigua = pieza.userData.col;
  const filaNueva = tile.userData.fila;
  const colNueva = tile.userData.col;

  let piezaObjetivo = this.tablero.getPiece(filaNueva, colNueva);
  piezaObjetivo = getRootPiece(piezaObjetivo);

  if (piezaObjetivo && piezaObjetivo.team === pieza.team) {
    console.log("Movimiento inválido: casilla ocupada por pieza del mismo equipo.");
    return false;
  }

  const moverYAnimar = () => {
    const startPos = pieza.position.clone();
    const endPos = tile.position.clone();
    endPos.y += 0.015;

    this.animating = true;
    this.animationData = {
      pieza,
      startPos,
      endPos,
      duration: 0.5,
      elapsed: 0,
      filaAntigua,
      colAntigua,
      filaNueva,
      colNueva,
      tile,
      piezaObjetivo,
    };
  };

  if (piezaObjetivo) {
    // Hay captura

    if (pieza instanceof Torre && typeof pieza.playCaptureAnimation === 'function') {
      // Mueve la pieza al destino SIN animación suave (posición directa)
      pieza.position.set(tile.position.x, tile.position.y + 0.015, tile.position.z);

      // Espera a que termine la animación especial de la torre
      pieza.playCaptureAnimation().then(() => {
        // Aparta la pieza capturada visualmente
        const offsetX = 5;
        const offsetZ = this.piezasCapturadasCount * 0.5;
        piezaObjetivo.position.set(offsetX, piezaObjetivo.position.y, offsetZ);

        this.piezasCapturadas.push(piezaObjetivo);
        this.piezasCapturadasCount++;

        // Actualiza el tablero eliminando pieza capturada y movida
        this.tablero.eliminarPieza(filaNueva, colNueva);
        this.tablero.eliminarPieza(filaAntigua, colAntigua);
        pieza.userData.fila = filaNueva;
        pieza.userData.col = colNueva;
        this.tablero.setPiece(filaNueva, colNueva, pieza);

        this.resetHighlights();
        this.selectedPiece = null;
        this.animating = false;
        this.animationData = null;

        // Cambiar turno y mover cámara
        this.changeTurn();
      });
    } else {
      // Piezas sin animación especial: animar movimiento normal
      moverYAnimar();
    }
  } else {
    // Movimiento sin captura: animar normalmente
    moverYAnimar();
  }

  return true;
}





  onPointerDown(event) {
    if (this.animating) return;

    event.preventDefault();

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.selectedPiece) {
      const intersects = this.raycaster.intersectObjects(this.tiles, true);
      if (intersects.length > 0) {
        let clickedTile = intersects[0].object;

        while (clickedTile && !clickedTile.isTile && clickedTile.parent) {
          clickedTile = clickedTile.parent;
        }

        const casillaEsValida = this.highlightedTiles.some(casilla => casilla.uuid === clickedTile.uuid);
        if (!casillaEsValida) {
          console.log("Movimiento no permitido, casilla no resaltada");
          return;
        }

          const moved = this.movePieceToTile(this.selectedPiece, clickedTile);
        if (moved) {
          this.resetSelection();
          this.changeTurn();  // <--- llama a la función que cambia el turno y mueve cámara
        } else {
          console.log("Movimiento no realizado, casilla ocupada o inválida");
        }
      }

    } else {
      const intersects = this.raycaster.intersectObjects(this.pieces, true);
      if (intersects.length > 0) {
        let seleccion = intersects[0].object;

        while (seleccion && !seleccion.movementStrategy) {
          seleccion = seleccion.parent;
        }
        if (!seleccion) return;

        if (this.selectedPiece) this.resetPieceHighlight(this.selectedPiece);

        this.selectedPiece = seleccion;
        this.highlightSelectedPiece(this.selectedPiece);
        this.highlightPossibleMoves(this.selectedPiece);
      }
    }
  }

update(deltaTime) {
  if (!this.animating || !this.animationData) return;

  const data = this.animationData;
  data.elapsed += deltaTime;

  let t = data.elapsed / data.duration;
  if (t > 1) t = 1;

  data.pieza.position.lerpVectors(data.startPos, data.endPos, t);

  if (t >= 1) {
    // Termina animacfión movimiento
    if (data.piezaObjetivo) {
      // Apartar pieza capturada visualmente
      const offsetX = 5;
      const offsetZ = this.piezasCapturadasCount * 0.5;
      data.piezaObjetivo.position.set(offsetX, data.piezaObjetivo.position.y, offsetZ);
      this.piezasCapturadas.push(data.piezaObjetivo);
      this.piezasCapturadasCount++;

      this.tablero.eliminarPieza(data.filaNueva, data.colNueva);
    }

    this.tablero.eliminarPieza(data.filaAntigua, data.colAntigua);
    data.pieza.userData.fila = data.filaNueva;
    data.pieza.userData.col = data.colNueva;
    this.tablero.setPiece(data.filaNueva, data.colNueva, data.pieza);

    // Cambio de turno y mover cámara
    this.changeTurn();

    this.resetHighlights();
    this.selectedPiece = null;
    this.animating = false;
    this.animationData = null;
  }

  
}




}

export { Ajedrez };
