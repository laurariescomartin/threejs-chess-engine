import * as THREE from 'three';
import * as CSG from '../libs/three-bvh-csg.js';
import { OBJLoader } from '../libs/OBJLoader.js';
import { MTLLoader } from '../libs/MTLLoader.js';

class Tabla extends THREE.Object3D {

  constructor() {
    super();

    this.casillas = [];
    this.piezas = [];

    for(let fila = 0; fila < 8; fila++) {
      this.piezas[fila] = [];
      for(let col = 0; col < 8; col++) {
        this.piezas[fila][col] = null;
      }
    }

    // Geometría tabla exterior con segmentos para UV
    var tabla_exterior_Geo = new THREE.BoxGeometry(3.5, 0.03, 3.5, 64, 1, 64);

    // Ajustar UVs para repetir textura (x4)
    const uvAttr = tabla_exterior_Geo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      const u = uvAttr.getX(i);
      const v = uvAttr.getY(i);
      uvAttr.setXY(i, u * 4, v * 4);
    }
    uvAttr.needsUpdate = true;

    // Crear material madera con bumpMap y normalMap (más simple que displacement)
    const materialMadera = this.crearMaterialMaderaSimple(
      '../Tabla/textures/textures/Wood047_1K-JPG_Color.jpg',
      '../Tabla/textures/textures/Wood047_1K-JPG_Displacement.jpg',
      '../Tabla/textures/textures/Wood047_1K-JPG_NormalGL.jpg'
    );

    var tabla_exterior = new CSG.Brush(tabla_exterior_Geo, materialMadera);

    // Materiales básicos para otras partes
    const marron = new THREE.MeshStandardMaterial({ color: 0xC19A6B });
    const negroMadera = new THREE.MeshStandardMaterial({ color: 0x5C4033 });
    const negroTablero = new THREE.MeshStandardMaterial({ color: 0x5C4033, emissive: 0x000000, emissiveIntensity: 1 });
    const blancoTablero = new THREE.MeshStandardMaterial({ color: 0xD2B48C, emissive: 0x000000, emissiveIntensity: 1 });

    // Geometrías de cortes y mango
    var tabla_derecha_Geo = new THREE.BoxGeometry(1.8, 0.03, 3.5);
    var cilindro1_quitarD_Geo = new THREE.CylinderGeometry(1.2, 1.2, 0.2);
    var cilindro2_quitarD_Geo = new THREE.CylinderGeometry(1.2, 1.2, 0.2);
    var finalMango_Geo = new THREE.CylinderGeometry(0.4, 0.4, 0.03);
    var agujero_Geo = new THREE.CylinderGeometry(0.2, 0.2, 0.2);

    tabla_derecha_Geo.translate(2.6, -0.0012, 0);
    cilindro1_quitarD_Geo.translate(3.1, -0.0012, -1.5);
    cilindro2_quitarD_Geo.translate(3.1, -0.0012, 1.5);
    finalMango_Geo.translate(3.5, -0.0012, 0);
    agujero_Geo.translate(3.52, 0, 0);
    tabla_exterior.position.y = -0.0012;

    var tabla_derecha = new CSG.Brush(tabla_derecha_Geo, materialMadera);
    var cilindro1_quitarD = new CSG.Brush(cilindro1_quitarD_Geo, negroMadera);
    var cilindro2_quitarD = new CSG.Brush(cilindro2_quitarD_Geo, negroMadera);
    var finalMango = new CSG.Brush(finalMango_Geo, materialMadera);
    var agujero = new CSG.Brush(agujero_Geo, negroMadera);

    var evaluador = new CSG.Evaluator();
    var tabla1 = evaluador.evaluate(tabla_derecha, cilindro1_quitarD, CSG.SUBTRACTION);
    var tabla2 = evaluador.evaluate(tabla1, cilindro2_quitarD, CSG.SUBTRACTION);
    var tablaConjunto = evaluador.evaluate(tabla2, finalMango, CSG.ADDITION);
    var tablaFinal = evaluador.evaluate(tablaConjunto, agujero, CSG.SUBTRACTION);

    this.add(tabla_exterior);
    this.add(tablaFinal);

    this.tamCasilla = 0.4;
    const tamCasilla = this.tamCasilla;
    const offset = - (tamCasilla * 8) / 2 + tamCasilla / 2;
    this.offset = offset;

    const tableroGroup = new THREE.Group();

    for(let fila = 0; fila < 8; fila++) {
      for(let col = 0; col < 8; col++) {
        const geom = new THREE.BoxGeometry(tamCasilla, 0.02, tamCasilla);
        const material = ((fila + col) % 2 === 0) ? blancoTablero : negroTablero;
        const casilla = new THREE.Mesh(geom, material.clone());

        casilla.isTile = true;
        casilla.userData.fila = fila;
        casilla.userData.col = col;
        casilla.position.set(offset + col * tamCasilla, 0.031, offset + fila * tamCasilla);

        this.casillas.push(casilla);
        tableroGroup.add(casilla);
      }
    }

    this.add(tableroGroup);

    // Si tienes la función cargarCuchillo, descomenta esta línea, si no coméntala para evitar error
    this.cargarCuchillo();
    this.cargarCuchara();
  }

  crearMaterialMaderaSimple(colorPath, bumpPath, normalPath) {
    const textureLoader = new THREE.TextureLoader();
    const texturaMadera = textureLoader.load(colorPath);
    const relieveMadera = textureLoader.load(bumpPath);
    const normalMadera = textureLoader.load(normalPath);

    const marron = new THREE.MeshStandardMaterial({
      map: texturaMadera,
      bumpMap: relieveMadera,
      bumpScale: 0.05,
      normalMap: normalMadera,
      roughness: 0.6,
      metalness: 0.2,
    });

    return marron;
  }

  posicionToFilaColumna(position) {
    const fila = Math.round((position.z + 1.75) / 0.5);
    const col = Math.round((position.x + 1.75) / 0.5);
    return { fila, col };
  }

  esCasillaValida(fila, col) {
    return fila >= 0 && fila < 8 && col >= 0 && col < 8;
  }

  getCasilla(fila, col) {
    if (!this.esCasillaValida(fila, col)) return null;
    return this.casillas[fila * 8 + col];
  }

  getPiece(fila, col) {
    if (this.esCasillaValida(fila, col)) {
      return this.piezas[fila][col];
    }
    return null;
  }

  setPiece(fila, col, pieza) {
    if (this.esCasillaValida(fila, col)) {
      this.piezas[fila][col] = pieza;
    }
  }

  eliminarPieza(fila, col) {
    if (this.esCasillaValida(fila, col)) {
      this.piezas[fila][col] = null;
    }
  }

  
cargarCuchillo() {
  const textureLoader = new THREE.TextureLoader();
  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();

  // Carga la textura para el relieve (bumpMap)
  const texturaRelieve = textureLoader.load('../Tabla/cuchillo/KnifeTexture..jpg');
  texturaRelieve.wrapS = THREE.RepeatWrapping;
  texturaRelieve.wrapT = THREE.RepeatWrapping;

  mtlLoader.load('../Tabla/cuchillo/Knife.mtl', (materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.load('../Tabla/cuchillo/Knife.obj', (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          // Añadir bumpMap para relieve
          child.material.bumpMap = texturaRelieve;
          child.material.bumpScale = 0.03;
          child.material.needsUpdate = true;
        }
      });

      object.scale.set(0.2, 0.2, 0.2);
      object.rotation.set(Math.PI, -Math.PI/8, Math.PI/2);
      object.position.set(2.2, 0.32, 0);
      
      

      this.add(object);
    }, undefined, (error) => {
      console.error('Error cargando cuchillo OBJ:', error);
    });
  }, undefined, (error) => {
    console.error('Error cargando cuchillo MTL:', error);
  });
}

cargarCuchara() {
  const metal = new THREE.MeshStandardMaterial({
    color: 0x777777,   
    metalness: 1.0,
    roughness: 0.19,
  });

  const objLoader = new OBJLoader();

  // Primera cuchara
  objLoader.load('../Tabla/cuchillo/spoon.obj', (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = metal;
      }
    });

    object.position.set(2.4, 0.05, 0);
    object.scale.set(1, 1, 1);
    object.rotation.set(0, -Math.PI / 8, 0);

    this.add(object);
  });
}

}

export { Tabla };
