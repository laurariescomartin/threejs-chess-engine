import * as THREE from 'three'
import * as CSG from '../libs/three-bvh-csg.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class Rey extends THREE.Object3D {

    constructor(){
        super();

        //Material
        const negro = new THREE.MeshStandardMaterial({
            color: 0x000000,
                });

        const blanco = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
                });

        const carne = new THREE.MeshStandardMaterial({
            color: 0xFCD0B4,
                });

        const rosa = new THREE.MeshStandardMaterial({
            color: 0xffc5d3,
                });

        const amarillo = new THREE.MeshStandardMaterial({
            color: 0xefb810,
                });
    
        //PAN
        const objLoader = new OBJLoader();
        objLoader.load('../Rey/pan/pan.obj', (object) => {
            // Aplicar un material básico porque no hay mtl
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: 0xfcd09b }); // color pan
                }
            });

            // Posicionar la figura
            object.scale.set(0.06, 0.06, 0.06);
            object.position.set(0.09, 0.15, 0.04);
            object.rotation.set(Math.PI / 2, 0, -Math.PI / 2);

            this.add(object);
        });


        //---------------------------------------------------------------------------------------

        //PIEZA 1 
        //Geometria Figura 1
        var base1_Geo = new THREE.BoxGeometry(0.15, 0.03, 0.15);
        var base2_Geo = new THREE.BoxGeometry(0.15, 0.03, 0.15);

        //Mover Elementos
        base2_Geo.rotateY(Math.PI*1/4);

        //Mesh
        var basePeon1 = new THREE.Mesh(base1_Geo, amarillo);
        var basePeon2 = new THREE.Mesh(base2_Geo, amarillo);

        //---------------------------------------------------------------------------------------

        //PIEZA 2 
        //Geometria Figura 2
        var cilindro1_Geo = new THREE.CylinderGeometry(0.07, 0.07, 0.02);
        var toro1_Geo = new THREE.TorusGeometry(0.068, 0.004);
        var cilindro2_Geo = new THREE.CylinderGeometry(0.05, 0.07, 0.075);
        var cilindro3_Geo = new THREE.CylinderGeometry(0.04, 0.05, 0.08);
        var toro2_Geo = new THREE.TorusGeometry(0.051, 0.004);
        var esfera_Geo = new THREE.SphereGeometry(0.05);
        var brazo1_Geo = new THREE.CylinderGeometry(0.01, 0.01, 0.06);
        var brazo2_Geo = new THREE.CylinderGeometry(0.01, 0.01, 0.06);
        var mano1_Geo = new THREE.SphereGeometry(0.01);
        var mano2_Geo = new THREE.SphereGeometry(0.01);

        //Mover Elementos
        cilindro1_Geo.translate(0, 0.025, 0);

        toro1_Geo.rotateX(Math.PI*1/2);
        toro1_Geo.translate(0, 0.039, 0);

        cilindro2_Geo.translate(0, 0.072, 0);

        cilindro3_Geo.translate(0, 0.149, 0);

        toro2_Geo.rotateX(Math.PI*1/2);
        toro2_Geo.translate(0, 0.11, 0);

        esfera_Geo.translate(0, 0.22, 0);

        brazo1_Geo.rotateZ(Math.PI*1/2);
        brazo1_Geo.rotateY(-Math.PI*1/8);
        brazo1_Geo.translate(0.06, 0.15, 0.01);

        brazo2_Geo.rotateZ(Math.PI*1/2);
        brazo2_Geo.rotateY(Math.PI*1/8);
        brazo2_Geo.translate(-0.06, 0.15, 0.01);

        mano1_Geo.translate(0.095, 0.15, 0.024);
        mano2_Geo.translate(-0.095, 0.15, 0.024);
        
        //Brush 
        var cilidro1 = new CSG.Brush(cilindro1_Geo, negro);
        var toro1 = new CSG.Brush(toro1_Geo, blanco);
        var cilindro2 = new CSG.Brush(cilindro2_Geo, blanco);
        var cilindro3 = new CSG.Brush(cilindro3_Geo, blanco);
        var toro2 = new CSG.Brush(toro2_Geo, negro);
        var esfera = new CSG.Brush(esfera_Geo, carne);
        var brazo1 = new CSG.Brush(brazo1_Geo, blanco);
        var brazo2 = new CSG.Brush(brazo2_Geo, blanco);
        var mano1 = new CSG.Brush(mano1_Geo, carne);
        var mano2 = new CSG.Brush(mano2_Geo, carne);

        //Operaciones Booleanas
        //Objeto Evaluador -> SIEMPRE es necesario para hacer las operaciones
        var evaluador = new CSG.Evaluator();

        var cuerpo_P1 = evaluador.evaluate(cilidro1, cilindro2, CSG.ADDITION);
        var cuerpo_Final = evaluador.evaluate(cuerpo_P1, toro1, CSG.SUBTRACTION);

        //---------------------------------------------------------------------------------------

        //FIGURA 3
        //Geometria
        var ojo1_Geo = new THREE.SphereGeometry(0.01);
        var ojo2_Geo = new THREE.SphereGeometry(0.01);
        var pupila1_Geo = new THREE.SphereGeometry(0.005);
        var pupila2_Geo = new THREE.SphereGeometry(0.005);
        var nariz_Geo = new THREE.SphereGeometry(0.01);

        //Mover Geometria
        ojo1_Geo.translate(-0.017, 0.23, 0.04);
        ojo2_Geo.translate(0.017, 0.23, 0.04);
        pupila1_Geo.translate(-0.017, 0.23, 0.05);
        pupila2_Geo.translate(0.017, 0.23, 0.05);

        nariz_Geo.scale(1.5, 0.8, 1);
        nariz_Geo.translate(0, 0.218, 0.05);

        //Brush 
        var ojo1 = new CSG.Brush(ojo1_Geo, blanco);
        var ojo2 = new CSG.Brush(ojo2_Geo, blanco);
        var pupila1 = new CSG.Brush(pupila1_Geo, negro);
        var pupila2 = new CSG.Brush(pupila2_Geo, negro);

        var nariz = new CSG.Brush(nariz_Geo, rosa);

        //---------------------------------------------------------------------------------------

        //FIGURA 4
        //Geometria
        var gorro_Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.08);
        var gorro_PA1_Geo = new THREE.SphereGeometry(0.03);
        var gorro_PA2_Geo = new THREE.SphereGeometry(0.03);
        var gorro_PA3_Geo = new THREE.SphereGeometry(0.03);
        var gorro_PA4_Geo = new THREE.SphereGeometry(0.03);

        //Mover Geometria
        gorro_Geo.translate(0, 0.27, 0);
        gorro_PA1_Geo.translate(0.022, 0.31, 0.02);
        gorro_PA2_Geo.translate(-0.022, 0.31, 0.02);
        gorro_PA3_Geo.translate(0.022, 0.31, -0.02);
        gorro_PA4_Geo.translate(-0.022, 0.31, -0.02);

        //Brush 
        var gorro = new CSG.Brush(gorro_Geo, blanco);
        var gorro_A1 = new CSG.Brush(gorro_PA1_Geo, blanco);
        var gorro_A2 = new CSG.Brush(gorro_PA2_Geo, blanco);
        var gorro_A3 = new CSG.Brush(gorro_PA3_Geo, blanco);
        var gorro_A4 = new CSG.Brush(gorro_PA4_Geo, blanco);
        //---------------------------------------------------------------------------------------


        this.add(basePeon1);
        this.add(basePeon2);

        this.add(cuerpo_Final);
        this.add(cilindro3);
        this.add(toro2);        
        this.add(esfera);
        this.add(brazo1);
        this.add(brazo2);
        this.add(mano1);
        this.add(mano2);

        this.add(ojo1);
        this.add(ojo2);
        this.add(pupila1);
        this.add(pupila2);
        this.add(nariz);

        this.add(gorro);
        this.add(gorro_A1);
        this.add(gorro_A2);
        this.add(gorro_A3);
        this.add(gorro_A4);
    }


    update(){}
}

export { Rey }