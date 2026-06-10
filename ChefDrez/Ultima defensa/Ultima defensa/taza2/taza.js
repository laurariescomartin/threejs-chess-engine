import * as THREE from 'three';
import * as CSG from '../libs/three-bvh-csg.js';

class taza extends THREE.Object3D {
    constructor() {
        super();

        this.materialBlanco = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.3,
            metalness: 0.1
        });

        this.materialDorado = new THREE.MeshStandardMaterial({
            color: 0xFFF176,
            roughness: 0.3,
            metalness: 0.6
        });

        this.materialMorado = new THREE.MeshStandardMaterial({
            color: 0xD8B0FF,
            roughness: 0.4,
            metalness: 0.5
        });

        this.materialNegro = new THREE.MeshStandardMaterial({
            color: 0x000000
        });

        // Crear partes de la taza
        const cuerpo = this.createCuerpo();
        const base = this.createBase();
        const anillo = this.createAnillo();
        const bordeSuperior = this.createBorde();
        const ojos = this.createOjos();

        this.add(cuerpo);
        this.add(base);
        this.add(anillo);
        this.add(bordeSuperior);
        ojos.forEach(obj => this.add(obj));

        this.position.set(0, 0, 0);
    }

    createCuerpo() {
        const evaluator = new CSG.Evaluator();

        // Exterior
        const shapeExt = new THREE.Shape();
        shapeExt.quadraticCurveTo(0.03, 0.01, 0.025, 0.015);
        shapeExt.quadraticCurveTo(0.03, 0.006, 0.0038, 0.01);
        shapeExt.quadraticCurveTo(0.073, 0.027, 0.053, 0.048);
        shapeExt.quadraticCurveTo(0.028, 0.068, 0.06, 0.09);
        shapeExt.lineTo(0, 0.09);
        const pointsExt = shapeExt.extractPoints(50).shape;
        const geoExt = new THREE.LatheGeometry(pointsExt, 24);
        const brushExt = new CSG.Brush(geoExt, this.materialBlanco);

        // Interior
        const shapeInt = new THREE.Shape();
        shapeInt.quadraticCurveTo(0.09, 0.003, 0.01, 0.01);
        shapeInt.quadraticCurveTo(0.007, 0.035, 0.02, 0.04);
        shapeInt.quadraticCurveTo(0.07, 0.022, 0.05, 0.043);
        shapeInt.quadraticCurveTo(0.025, 0.063, 0.057, 0.096);
        shapeInt.lineTo(0, 0.096);
        const pointsInt = shapeInt.extractPoints(50).shape;
        const geoInt = new THREE.LatheGeometry(pointsInt, 24);
        const brushInt = new CSG.Brush(geoInt, this.materialBlanco);

        // Asa
        const geoAsa = new THREE.TorusGeometry(0.024, 0.005, 16, 100);
        geoAsa.translate(0.04, 0.06, 0);
        const brushAsa = new CSG.Brush(geoAsa, this.materialDorado);

        let cuerpo = evaluator.evaluate(brushExt, brushAsa, CSG.ADDITION);
        cuerpo = evaluator.evaluate(cuerpo, brushInt, CSG.SUBTRACTION);

        return cuerpo;
    }

    createBase() {
        const geo = new THREE.CylinderGeometry(0.03, 0.05, 0.02, 32);
        return new THREE.Mesh(geo, this.materialMorado);
    }

    createAnillo() {
        const geo = new THREE.TorusGeometry(0.02, 0.009, 16, 100);
        geo.rotateX(Math.PI / 2);
        geo.translate(0, 0.015, 0);
        return new THREE.Mesh(geo, this.materialDorado);
    }

    createBorde() {
        const geo = new THREE.TorusGeometry(0.06, 0.004, 16, 100);
        geo.rotateX(Math.PI / 2);
        geo.translate(0, 0.09, 0);
        return new THREE.Mesh(geo, this.materialDorado);
    }

    createOjos() {
        const ojo1Geo = new THREE.SphereGeometry(0.005, 16, 16);
        const ojo2Geo = new THREE.SphereGeometry(0.005, 16, 16);
        const pupila1Geo = new THREE.SphereGeometry(0.0035, 16, 16);
        const pupila2Geo = new THREE.SphereGeometry(0.0035, 16, 16);

        ojo1Geo.translate(0.018, 0.07, 0.042);
        ojo2Geo.translate(-0.018, 0.07, 0.042);
        pupila1Geo.translate(-0.018, 0.07, 0.045);
        pupila2Geo.translate(0.018, 0.07, 0.045);

        const ojo1 = new THREE.Mesh(ojo1Geo, this.materialBlanco);
        const ojo2 = new THREE.Mesh(ojo2Geo, this.materialBlanco);
        const pupila1 = new THREE.Mesh(pupila1Geo, this.materialNegro);
        const pupila2 = new THREE.Mesh(pupila2Geo, this.materialNegro);

        return [ojo1, ojo2, pupila1, pupila2];
    }

    update() {}
}

export { taza };
