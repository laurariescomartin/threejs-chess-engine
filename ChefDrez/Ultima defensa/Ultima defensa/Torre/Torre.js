import * as THREE from 'three'
import * as CSG from '../libs/three-bvh-csg.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import * as TWEEN from '../libs/tween.module.js';

class Torre extends THREE.Object3D {

    constructor(){
        super();

        // Marca esta pieza como torre para identificarla externamente
        this.isTorre = true;

        // Materiales
        this.negro = new THREE.MeshStandardMaterial({
            color: 0x000000,
        });

        this.transparente = new THREE.MeshStandardMaterial({
            color: 0x99ccff,
            transparent: true,
            opacity: 0.5,
        });

        this.blanco = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
        });

        const rojo = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.3,
        });

        this.metal = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.3,
            metalness: 0.5,
        });

        // ---------------------------------------------------------------------------------------

        // PIEZA 1 (Piernas)

        var shape = new THREE.Shape();
        shape.absarc(0, 0, 0.005, 0, Math.PI*2);

        var camino = new THREE.Shape();
        camino.moveTo(0, -0.025);
        camino.lineTo(0, 0);
        camino.lineTo(0, 0.016);
        camino.lineTo(0, 0.017);
        camino.lineTo(-0.01, 0.025);
        camino.lineTo(-0.02, 0.031);
        camino.lineTo(-0.05, 0.033);
        camino.lineTo(-0.08, 0.037);

        var puntos = this.shape2CatmullRomCurve3(camino, 50);

        var options = { steps: 55, curveSegments:5, extrudePath:puntos};

        var pie1_Geo = new THREE.SphereGeometry(0.05);
        var quitar_pie1_Geo = new THREE.BoxGeometry(0.015, 0.01, 0.03);
        var pata1_Geo = new THREE.ExtrudeGeometry(shape, options);

        var pie2_Geo = new THREE.SphereGeometry(0.05);
        var quitar_pie2_Geo = new THREE.BoxGeometry(0.015, 0.01, 0.03);
        var pata2_Geo = new THREE.ExtrudeGeometry(shape, options);

        pie1_Geo.scale(0.12,0.15,0.2);
        pie1_Geo.translate(0.015, 0, 0.035);
        quitar_pie1_Geo.translate(0.015, -0.005, 0.035);
        pata1_Geo.scale(0.3, 0.3, 0.3);
        pata1_Geo.translate(0.015, 0.03, 0.02);

        pie2_Geo.scale(0.12,0.15,0.2);
        pie2_Geo.translate(-0.015, 0, 0.035);
        quitar_pie2_Geo.translate(-0.015, -0.005, 0.035);
        pata2_Geo.scale(0.3, 0.3, 0.3);
        pata2_Geo.translate(-0.015, 0.03, 0.02);

        var pie1 = new CSG.Brush(pie1_Geo, this.negro);
        var quitar_pie1 = new CSG.Brush(quitar_pie1_Geo, this.negro);
        var pata1 = new CSG.Brush(pata1_Geo, this.negro);

        var pie2 = new CSG.Brush(pie2_Geo, this.negro);
        var quitar_pie2 = new CSG.Brush(quitar_pie2_Geo, this.negro);
        var pata2 = new CSG.Brush(pata2_Geo, this.negro);

        var evaluador = new CSG.Evaluator();

        var pie1_1 = evaluador.evaluate(pie1, quitar_pie1, CSG.SUBTRACTION);
        var pie2_1 = evaluador.evaluate(pie2, quitar_pie2, CSG.SUBTRACTION);

        // ---------------------------------------------------------------------------------------

        // PIEZA 2 (Cuerpo)

        var cuerpo_Geo = new THREE.CylinderGeometry(0.02, 0.028, 0.07);
        var cuerpo_interior_Geo = new THREE.CylinderGeometry(0.018, 0.023, 0.05);

        cuerpo_Geo.translate(0, 0.058, 0);
        cuerpo_interior_Geo.translate(0, 0.052, 0);

        var cuerpo = new CSG.Brush(cuerpo_Geo, this.transparente);
        var cuerpo_interior = new CSG.Brush(cuerpo_interior_Geo, this.blanco);

        // ---------------------------------------------------------------------------------------

        // PIEZA 3 (Brazos)

        var camino2 = new THREE.Shape();
        camino2.moveTo(0, 0);
        camino2.lineTo(0.05, 0);
        camino2.lineTo(0.08, 0.03);
        camino2.lineTo(0.1, 0.05);

        var puntos2 = this.shape2CatmullRomCurve3(camino2, 50);

        var options2 = {steps: 55, curveSegments: 5, extrudePath: puntos2};

        var brazo1_Geo = new THREE.ExtrudeGeometry(shape, options2);
        var brazo2_Geo = new THREE.ExtrudeGeometry(shape, options2);

        brazo1_Geo.scale(0.3, 0.3, 0.3);
        brazo1_Geo.rotateX(-Math.PI*1/2);
        brazo1_Geo.rotateY(Math.PI*1/2);
        brazo1_Geo.translate(-0.02, 0.054, 0);

        brazo2_Geo.scale(0.3, 0.3, 0.3);
        brazo2_Geo.rotateZ(-Math.PI*1/2);
        brazo2_Geo.translate(0.02, 0.054, 0);

        var brazo1 = new CSG.Brush(brazo1_Geo, this.negro);
        var brazo2 = new CSG.Brush(brazo2_Geo, this.negro);

        // ---------------------------------------------------------------------------------------

        // PIEZA 4 (GORRO)

        var sombrero = this.createGorro();
        this.updateGorroRotation(0);
        this.add(sombrero);

        // ---------------------------------------------------------------------------------------

        // PIEZA 5 (GUANTES)
        const objLoader = new OBJLoader();
        objLoader.load('../Torre/guante/glov.obj', (object) => {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = rojo;
                }
            });

            object.position.set(0.054, 0.054, 0.02);
            object.scale.set(0.22, 0.22, 0.22);
            object.rotation.set(0, Math.PI/4, Math.PI);

            this.add(object);
        });

        objLoader.load('../Torre/guante/glov.obj', (object) => {
            object.traverse((child) => {
                if (child.isMesh) child.material = rojo;
            });

            object.position.set(-0.053, 0.074, 0);
            object.scale.set(0.22, 0.22, 0.22);
            object.rotation.set(0-Math.PI/1.9, -Math.PI/5, 0);

            this.add(object);
        });

        // ---------------------------------------------------------------------------------------

        // PIEZA 6 (Ojos)

        var geometria_Ojos1 = new THREE.SphereGeometry(0.005);
        var geometria_Ojos2 = new THREE.SphereGeometry(0.005);
        var geometria_Pupilas1 = new THREE.SphereGeometry(0.0035);
        var geometria_Pupilas2 = new THREE.SphereGeometry(0.0035);

        geometria_Ojos1.translate(0.018, 0.097, 0.027);
        geometria_Ojos2.translate(-0.018, 0.097, 0.027);
        geometria_Pupilas1.translate(-0.018, 0.097, 0.03);
        geometria_Pupilas2.translate(0.018, 0.097, 0.03);

        var ojo1 = new CSG.Brush(geometria_Ojos1, this.blanco);
        var ojo2 = new CSG.Brush(geometria_Ojos2, this.blanco);
        var pupila1 = new CSG.Brush(geometria_Pupilas1, this.negro);
        var pupila2 = new CSG.Brush(geometria_Pupilas2, this.negro);

        // ---------------------------------------------------------------------------------------

        this.add(pie1_1);
        this.add(pata1);
        this.add(pie2_1);
        this.add(pata2);

        this.add(cuerpo);
        this.add(cuerpo_interior);

        this.add(brazo1);
        this.add(brazo2);

        this.add(sombrero);

        this.add(ojo1);
        this.add(ojo2);
        this.add(pupila1);
        this.add(pupila2);
    }

    createSal() {
        var sal1_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.005);
        var sal2_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.005);
        var sal3_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.005);
        var sal4_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.005);
        var sal5_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.005);

        sal1_Geo.translate(0, 0.115, 0);
        sal2_Geo.translate(-0.012, 0.115, 0);
        sal3_Geo.translate(0.012, 0.115, 0);
        sal4_Geo.translate(0, 0.115, 0.012);
        sal5_Geo.translate(0, 0.115, -0.012);

        var sal1 = new CSG.Brush(sal1_Geo, this.blanco);
        var sal2 = new CSG.Brush(sal2_Geo, this.blanco);
        var sal3 = new CSG.Brush(sal3_Geo, this.blanco);
        var sal4 = new CSG.Brush(sal4_Geo, this.blanco);
        var sal5 = new CSG.Brush(sal5_Geo, this.blanco);

        var segmento = new THREE.Object3D();

        segmento.add(sal1);
        segmento.add(sal2);
        segmento.add(sal3);
        segmento.add(sal4);
        segmento.add(sal5);

        this.segmentoSal = segmento;

        return segmento;
    }

    createGorro() {
        var sal = this.createSal();

        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.lineTo(0.03,0);
        shape.lineTo(0.03,0.02);
        shape.lineTo(0.02,0.02);
        shape.lineTo(0.02,0.031);
        shape.lineTo(0,0.031);

        var points = shape.extractPoints(50).shape;

        var geometrias = new THREE.LatheGeometry(points, 24, 0, Math.PI*2);
        var hueco1_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.02);
        var hueco2_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.02);
        var hueco3_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.02);
        var hueco4_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.02);
        var hueco5_Geo = new THREE.CylinderGeometry(0.003, 0.003, 0.02);

        geometrias.scale(0.9, 0.9, 0.9);
        geometrias.translate(0, 0.09, 0);

        hueco1_Geo.translate(0, 0.125, 0);
        hueco2_Geo.translate(-0.012, 0.125, 0);
        hueco3_Geo.translate(0.012, 0.125, 0);
        hueco4_Geo.translate(0, 0.125, 0.012);
        hueco5_Geo.translate(0, 0.125, -0.012);

        var gorro = new CSG.Brush(geometrias, this.metal);
        var hueco1 = new CSG.Brush(hueco1_Geo, this.negro);
        var hueco2 = new CSG.Brush(hueco2_Geo, this.negro);
        var hueco3 = new CSG.Brush(hueco3_Geo, this.negro);
        var hueco4 = new CSG.Brush(hueco4_Geo, this.negro);
        var hueco5 = new CSG.Brush(hueco5_Geo, this.negro);

        var evaluador = new CSG.Evaluator();

        var gorro1 = evaluador.evaluate(gorro, hueco1, CSG.SUBTRACTION);
        var gorro2 = evaluador.evaluate(gorro1, hueco2, CSG.SUBTRACTION);
        var gorro3 = evaluador.evaluate(gorro2, hueco3, CSG.SUBTRACTION);
        var gorro4 = evaluador.evaluate(gorro3, hueco4, CSG.SUBTRACTION);
        var gorro5 = evaluador.evaluate(gorro4, hueco5, CSG.SUBTRACTION);

        var segmento = new THREE.Object3D();

        segmento.add(gorro5);
        segmento.add(sal);

        this.segmentoGorro = segmento;

        return segmento;
    }

    // 1) Escalar (crecer) la sal en Y
    updateSalGrowth(valor) {
        if (this.segmentoSal) {
            this.segmentoSal.scale.set(1, valor, 1);
        }
    }

    // 2) Rotar sombrero (+ sal) alrededor de Y
    updateGorroRotation(valor) {
        if (this.segmentoGorro) {
            this.segmentoGorro.rotation.y = valor;
        }
    }

    // 3) Rotación global alrededor de Z (muy suave)
    updateGlobalZRotation(valor) {
        this.rotation.z = valor;
    }

    // Función para crear una curva CatmullRom
    shape2CatmullRomCurve3(aShape, res = 6) {
        var v2 = aShape.extractPoints(res).shape;
        var v3 = [];
        v2.forEach((v) => {
            v3.push(new THREE.Vector3(0, v.x, v.y));
        });
        return new THREE.CatmullRomCurve3(v3);
    }

    // Animación de la torre al atacar
    playCaptureAnimation() {
        return new Promise((resolve) => {
            const origen = { escalaY: 1.0, rotY: 0.0, rotZ: 0.0 };
            const destino = { escalaY: 2.0, rotY: Math.PI * 2, rotZ: Math.PI / 50 };  // valores animados

            const duracion = 800;

            const animacion = new TWEEN.Tween(origen)
                .to(destino, duracion)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    if (this.segmentoSal) this.segmentoSal.scale.set(1, origen.escalaY, 1);
                    if (this.segmentoGorro) {
                        this.segmentoGorro.rotation.y = origen.rotY;
                        this.segmentoGorro.rotation.z = origen.rotZ;
                    }
                })
                .onComplete(() => {
                    // Resetear valores para próximas animaciones
                    origen.escalaY = 1.0;
                    origen.rotY = 0.0;
                    origen.rotZ = 0.0;
                    resolve();  // Resuelve la promesa cuando termina la animación
                });

            animacion.repeat(1);
            animacion.yoyo(true);
            animacion.start();
        });
    }

    update() {}
}

export { Torre };
