import * as THREE from 'three'
import * as CSG from '../libs/three-bvh-csg.js'

class Caballo extends THREE.Object3D {

    constructor(){
        super();

        const metal = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.3,
            metalness: 0.5,
        });

        const negro = new THREE.MeshStandardMaterial({
            color: 0x000000,
                });

        const blanco = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
                });

        //FIGURA 1
        var shape = new THREE.Shape ();

        //Forma Rectangulo
        shape.moveTo(-0.005, 0.0015); //Punto inicial
        shape.lineTo(0.005, 0.0015);
        shape.lineTo(0.005, -0.0015);
        shape.lineTo(-0.005, -0.0015);
        shape.lineTo(-0.005, 0.0015);


        var camino = new THREE.Shape();
        //Orden: Y, Z
        camino.moveTo(0, 0);
        camino.lineTo(0, 0.02);
        camino.lineTo(-0.005, 0.025);
        camino.lineTo(-0.008, 0.025);
        camino.lineTo(-0.011, 0.03);
        camino.lineTo(-0.011, 0.075);
        var puntos = this.shape2CatmullRomCurve3(camino, 50);

        var options = { steps: 55, curveSegments:5, extrudePath:puntos}; //Opcion 2
        //Geometria
        var geometria_Cuerpo_Tenedor = new THREE.ExtrudeGeometry(shape, options);

        //Mover Geometria
        geometria_Cuerpo_Tenedor.translate(0,0.052, -0.01);

        //Brush
        var cuerpoFigura = new CSG.Brush(geometria_Cuerpo_Tenedor, metal);

        //---------------------------------------------------------------------------------------

        //FIGURA 2
        //Geometria
        var geometria_Cabeza_Tenedor = new THREE.CylinderGeometry(0.015, 0.015, 0.003);
        var geometria_Cabeza_Tenedor_2 = new THREE.BoxGeometry(0.03, 0.003, 0.015);
        var geometria_Cabeza_quitar = new THREE.BoxGeometry(0.03, 0.003, 0.015);

        //Mover Geometria
        geometria_Cabeza_Tenedor.translate(0, 0.052, -0.02);
        geometria_Cabeza_Tenedor_2.translate(0, 0.052, -0.026);
        geometria_Cabeza_quitar.translate(0, 0.052, -0.04);

        //Brush
        var cabezaFigura = new CSG.Brush(geometria_Cabeza_Tenedor, metal);
        var cabezaFigura2 = new CSG.Brush(geometria_Cabeza_Tenedor_2, metal);
        var cabezaquitar = new CSG.Brush(geometria_Cabeza_quitar,metal);

        //Operaciones Booleanas (Unir, Restar, Intersección, etc.) == BASE
        //Objeto Evaluador -> SIEMPRE es necesario para hacer las operaciones
        var evaluador = new CSG.Evaluator();

        var cabeza_Figura_Final1 = evaluador.evaluate(cabezaFigura, cabezaFigura2, CSG.ADDITION);
        var cabeza_Figura_Final = evaluador.evaluate(cabeza_Figura_Final1, cabezaquitar, CSG.SUBTRACTION);

        //---------------------------------------------------------------------------------------

        //FIGURA 3
        //Geometria
        var geometria_Patas_Tenedor = new THREE.BoxGeometry(0.003, 0.04, 0.005);
        var geometria_Patas_Tenedor2 = new THREE.BoxGeometry(0.003, 0.04, 0.005);
        var geometria_Patas_Tenedor3 = new THREE.BoxGeometry(0.003, 0.04, 0.005);
        var geometria_Patas_Tenedor4 = new THREE.BoxGeometry(0.003, 0.04, 0.005);

        //Mover Geometria
        geometria_Patas_Tenedor.translate(0.005, 0.02, 0.025);
        geometria_Patas_Tenedor2.translate(-0.005, 0.02, 0.025);
        geometria_Patas_Tenedor3.translate(-0.005, 0.02, 0.06);
        geometria_Patas_Tenedor4.translate(0.005, 0.02, 0.06);

        //Brush
        var pata1Figura = new CSG.Brush(geometria_Patas_Tenedor, metal);
        var pata2Figura = new CSG.Brush(geometria_Patas_Tenedor2, metal);
        var pata3Figura = new CSG.Brush(geometria_Patas_Tenedor3, metal);
        var pata4Figura = new CSG.Brush(geometria_Patas_Tenedor4, metal);

        //---------------------------------------------------------------------------------------

        //FIGURA 3
        //Geometria
        var geometria_Puntas_Tenedor = new THREE.BoxGeometry(0.004, 0.003, 0.014);
        var geometria_Puntas_Tenedor2 = new THREE.BoxGeometry(0.004, 0.003, 0.014);
        var geometria_Puntas_Tenedor3 = new THREE.BoxGeometry(0.004, 0.003, 0.014);

        //Mover Geometria
        geometria_Puntas_Tenedor.translate(0, 0.052, -0.039);
        geometria_Puntas_Tenedor2.translate(0.013, 0.052, -0.039);
        geometria_Puntas_Tenedor3.translate(-0.013, 0.052, -0.039);

        //Brush
        var punta1Figura = new CSG.Brush(geometria_Puntas_Tenedor, metal);
        var punta2Figura = new CSG.Brush(geometria_Puntas_Tenedor2, metal); 
        var punta3Figura = new CSG.Brush(geometria_Puntas_Tenedor3, metal); 

        //---------------------------------------------------------------------------------------

        //FIGURA 4
        //Geometria
        var geometria_Ojos_Tenedor1 = new THREE.SphereGeometry(0.003);
        var geometria_Ojos_Tenedor2 = new THREE.SphereGeometry(0.003);
        var geometria_Pupilas_Tenedor1 = new THREE.SphereGeometry(0.0025);
        var geometria_Pupilas_Tenedor2 = new THREE.SphereGeometry(0.0025);

        //Mover Geometria
        geometria_Ojos_Tenedor1.translate(0.008, 0.054, -0.02);
        geometria_Ojos_Tenedor2.translate(-0.008, 0.054, -0.02);
        geometria_Pupilas_Tenedor1.translate(0.008, 0.055, -0.02);
        geometria_Pupilas_Tenedor2.translate(-0.008, 0.055, -0.02);

        //Brush
        var ojo1Figura = new CSG.Brush(geometria_Ojos_Tenedor1, blanco);
        var ojo2Figura = new CSG.Brush(geometria_Ojos_Tenedor2, blanco);
        var pupila1Figura = new CSG.Brush(geometria_Pupilas_Tenedor1, negro);
        var pupila2Figura = new CSG.Brush(geometria_Pupilas_Tenedor2, negro);

        //---------------------------------------------------------------------------------------

        this.add(cuerpoFigura);

        this.add(cabeza_Figura_Final);

        this.add(pata1Figura);
        this.add(pata2Figura);
        this.add(pata3Figura);
        this.add(pata4Figura);

        this.add(punta1Figura);
        this.add(punta2Figura);
        this.add(punta3Figura);

        this.add(ojo1Figura);
        this.add(ojo2Figura);
        this.add(pupila1Figura);
        this.add(pupila2Figura);
    }

    rotateShape (aShape, angle, res = 6, center = new THREE.Vector2(0,0)) {
        var points = aShape.extractPoints (res).shape; // Extraemos los puntos 2D del shape 
        points.forEach ((p) => {
            p . rotateAround ( center , angle ) ;
        });
        return new THREE.Shape (points); // Construimos y devolvemos un nuevo shape 
    }

    shape2CatmullRomCurve3 (aShape, res = 6) {
        var v2 = aShape.extractPoints (res).shape; // Extraemos puntos 2D del shape 
        var v3 = [];
        v2.forEach ((v) => {
        v3.push (new THREE.Vector3 (0, v.x, v.y)); // Creamos puntos 3D 
    });
        return new THREE.CatmullRomCurve3 (v3) ; // Construimos el CatmullRomCurve3 
    }

    update(){}
}

export { Caballo }