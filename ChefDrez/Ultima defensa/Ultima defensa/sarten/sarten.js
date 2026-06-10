import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

class sarten extends THREE.Object3D{
    constructor(){
        super();

        this.material_sarten =  new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.3,
            metalness: 0.5,
        });
        this.material_fuera = new THREE.MeshStandardMaterial({color:0x000000 });
        
        //Creamos las geometrías

        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.lineTo(0.05,0);
        shape.quadraticCurveTo(0.06,0,0.06,0.008);
        shape.lineTo(0.06,0.02);
        shape.lineTo(0.05,0.02);
        shape.lineTo(0.05,0.001);
        shape.lineTo(0,0.001);

        var points = shape.extractPoints(50).shape;

        var geometria = new THREE.LatheGeometry (points, 24, 0, Math.PI*2);
        geometria.rotateX(Math.PI/2);
        geometria.translate(0,0.15,0);
        var sarten_dentro= new CSG.Brush(geometria, this.material_sarten);

        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.lineTo(0.055,0);
        shape.quadraticCurveTo(0.065,0,0.065,0.008);
        shape.lineTo(0.065,0.02);
        shape.lineTo(0.055,0.02);
        shape.lineTo(0.055,0.0009);
        shape.lineTo(0,0.0009);

        var points = shape.extractPoints(50).shape;

        var geometria1 = new THREE.LatheGeometry (points, 24, 0, Math.PI*2);
        geometria1.rotateX(Math.PI/2);
        geometria1.translate(0,0.15,0);
        var sarten_fuera= new CSG.Brush(geometria1, this.material_fuera);

        var evaluador= new CSG.Evaluator();
        var sarten_entera= evaluador.evaluate(sarten_dentro,sarten_fuera,CSG.ADDITION);

        var mango = new THREE.CylinderGeometry(0.009,0.009,0.08);
        var parte_chica_mngo = new THREE.BoxGeometry(0.018,0.018,0.018);
        var agujero_mango = new THREE.CylinderGeometry(0.003,0.003,0.05);

        parte_chica_mngo.rotateX(Math.PI/2);
        parte_chica_mngo.translate(0,0.08,0.009);
        mango.translate(0,0.04,0.008);
        agujero_mango.rotateX(Math.PI/2);
        agujero_mango.translate(0,0.018,0);

        var mango_brush= new CSG.Brush(mango,this.material_fuera);
        var agujero_brush = new CSG.Brush(agujero_mango, this.material_fuera);
        
        var evaluador= new CSG.Evaluator();
        var mango_entero= evaluador.evaluate(mango_brush,agujero_brush,CSG.SUBTRACTION);
        this.add(mango_entero);
          
        var mesh = new THREE.Mesh(parte_chica_mngo, this.material_sarten);
        this.add(mesh);
        this.add(sarten_entera);
        }

    update(){}
}

export { sarten }