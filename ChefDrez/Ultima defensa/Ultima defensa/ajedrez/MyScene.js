import * as THREE from '../libs/three.module.js';
import * as TWEEN from '../libs/tween.module.js';
import { GUI } from '../libs/dat.gui.module.js';
import { TrackballControls } from '../libs/TrackballControls.js';
import Stats from '../libs/stats.module.js';

// clases de mi proyecto
import { Ajedrez } from './ajedrez.js';

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    const canvas = this.renderer.domElement;
    canvas.style.touchAction = 'none'; // para evitar gestos por defecto en touch
    canvas.addEventListener('pointerdown', (event) => this.onPointerDown(event));

    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI();

    this.initStats();

    // Construimos los distintos elementos que tendremos en la escena
    this.createLights();
    this.createCamera();
    
    
    this.axis = new THREE.AxesHelper(2);
    this.add(this.axis);

    // Por último creamos el modelo
    this.model = new Ajedrez(this.camera);
    this.add(this.model);
    this.model.camera= this.camera;
     
    this.camera.userData.mySceneRef = this; 

    // Estado de la animación
    this.lastTime = 0;
    this.moveCameraTo(this.model.turn);
  }

  onPointerDown(event) {
    event.preventDefault();

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.model.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.model.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.model.raycaster.setFromCamera(this.model.mouse, this.camera);

    if (this.model.selectedPiece) {
      const intersects = this.model.raycaster.intersectObjects(this.model.tiles, true);
      if (intersects.length > 0) {
        const tile = intersects[0].object;
        const moved = this.model.movePieceToTile(this.model.selectedPiece, tile);
        if (moved) {
          this.model.resetSelection();
        }
      }
    } else {
      const intersects = this.model.raycaster.intersectObjects(this.model.pieces, true);
      if (intersects.length > 0) {
        let intersectedObject = intersects[0].object;
        while (intersectedObject && !intersectedObject.movementStrategy && intersectedObject.parent) {
          intersectedObject = intersectedObject.parent;
        }
        if (!intersectedObject) return;

       if (this.model.selectedPiece) {
        this.model.resetPieceHighlight(this.model.selectedPiece);
      }

        this.model.selectedPiece = intersectedObject;
        this.model.highlightSelectedPiece(intersectedObject);
        this.model.highlightPossibleMoves(intersectedObject);

        // Detectar tipo de pieza
        const isTorre = intersectedObject.constructor.name === 'Torre';

        // === LUZ y FONDO ===
        if (isTorre) {
          this.pointLight.color.set(0xff0000);               // rojo
          this.pointLight.intensity = 8;                      // más fuerte para torre
          this.renderer.setClearColor(new THREE.Color(0xffcccc), 1.0); // fondo rojo claro
        } else {  
          this.pointLight.color.set(0x3399ff);               // azul
          this.pointLight.intensity = 5;                      // intensidad normal
          this.renderer.setClearColor(new THREE.Color(0xccddff), 1.0); // fondo azul claro
        }

        // Posicionar luz puntual encima de la figura seleccionada
        const focoPos = intersectedObject.position.clone().add(new THREE.Vector3(0, 2, 0));
        new TWEEN.Tween(this.pointLight.position)
          .to({ x: focoPos.x, y: focoPos.y, z: focoPos.z }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
      .start();



      }
    }
  }

  initStats() {
    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    $("#Stats-output").append(stats.domElement);

    this.stats = stats;
  }

  createCamera() {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vertical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10);
    // También se indica dónde se coloca
    this.camera.position.set(0.2, 0.05, 0.2);
    // Y hacia dónde mira
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.add(this.camera);

    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target.set(0,0,0);
    this.cameraControl.enabled = false;

  }
  moveCameraTo(player) {
   const cameraPositions = {
  white: {
    position: new THREE.Vector3(0, 5, -3), // posición para jugador blanco
    lookAt: new THREE.Vector3(0, 0, 0)         // punto al que mira
  },
  black: {
    position: new THREE.Vector3(0, 5, 3), // posición para jugador negro (opuesto)
    lookAt: new THREE.Vector3(0, 0, 0)
  }
};


    const target = cameraPositions[player];
    if (!target) return;

    // Animar posición
    new TWEEN.Tween(this.camera.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    // Animar lookAt con vector auxiliar
    this.cameraLookAt = this.cameraLookAt || new THREE.Vector3();
    this.cameraLookAt.copy(this.cameraControl.target);

    new TWEEN.Tween(this.cameraLookAt)
      .to({ x: target.lookAt.x, y: target.lookAt.y, z: target.lookAt.z }, 1500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.cameraControl.target.copy(this.cameraLookAt);
        this.camera.lookAt(this.cameraControl.target);
      })
      .start();
  }

  createGUI() {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();

    // La escena le va a añadir sus propios controles.
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      lightPower: 500.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity: 1,
      axisOnOff: true
    };

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder('Luz y Ejes');

    // Se le añade un control para la potencia de la luz puntual
    folder.add(this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange((value) => this.setLightPower(value));

    // Otro para la intensidad de la luz ambiental
    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));

    // Y otro para mostrar u ocultar los ejes
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes : ')
      .onChange((value) => this.setAxisVisible(value));

    return gui;
  }

  createLights() {
  this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // blanco puro, intensidad alta
  this.add(this.ambientLight);

  this.pointLight = new THREE.PointLight(0xffaa00, 5);
  this.pointLight.position.set(2, 3, 1);
  this.add(this.pointLight);
  
}


  setLightPower(valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  createRenderer(myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();

    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  getCamera() {
    return this.camera;
  }

  setCameraAspect(ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    // Este método es llamado cada vez que el usuario modifica el tamaño de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del renderizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  changeTurn() {
    // Cambia el turno en Ajedrez y anima cámara
    this.model.turn = this.model.turn === 'white' ? 'black' : 'white';
    this.moveCameraTo(this.model.turn);
  }

  update(time = 0) {
    // Calcular el deltaTime entre frames
    const deltaTime = (time - this.lastTime) / 1000; // lo pasamos a segundos
    this.lastTime = time;
  

    // Actualizar ajedrez pasando deltaTime
    this.model.update(deltaTime);

    if (this.stats) this.stats.update();

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    TWEEN.update(time);

    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render(this, this.camera);

    // Llamada recursiva para el siguiente frame
    requestAnimationFrame((t) => this.update(t));
  }
}

/// La función main
$(function () {
  // Se instancia la escena pasándole el div que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  // Que no se nos olvide, la primera visualización.
  scene.update();
});
