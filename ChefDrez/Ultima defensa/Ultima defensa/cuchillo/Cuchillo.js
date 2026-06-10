import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/three-bvh-csg.js'

class Cuchillo extends THREE.Object3D{
    constructor(){
        super();

        this.material_cuchillo =  new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.3,
            metalness: 0.5,
        });
        this.material_mango = new THREE.MeshStandardMaterial({color: 0x000000});
        this.material_agujero = new THREE.MeshStandardMaterial({color: 0xd3d3d3});
        this.matrial_ojo = new THREE.MeshStandardMaterial({color:0xFFFFFF});
        //Creamos las geometrías

        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        shape.lineTo(0,0.009);
        shape.lineTo(0.05,0.009);
        shape.lineTo(0.03,0);
        shape.lineTo(0,0);
        
        var mango_cuchillo = new THREE.BoxGeometry(0.02,0.1,0.009);
        var agujero1 = new THREE.CylinderGeometry(0.002,0.002,0.01);
        var agujero2 = new THREE.CylinderGeometry(0.002,0.002,0.01);
        var agujero3 = new THREE.CylinderGeometry(0.002,0.002,0.01);
        var ojo_iz= new THREE.SphereGeometry(0.004);
        var pupila_iz= new THREE.SphereGeometry(0.002);
        var ojo_der= new THREE.SphereGeometry(0.004);
        var pupila_der= new THREE.SphereGeometry(0.002);

        const extrudeSettings = { depth: 0.1, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        geometry.rotateX(-Math.PI/2);
        geometry.translate(-0.01,0.1,0.0045);
        mango_cuchillo.translate(0,0.05,0);
        agujero1.rotateX(-Math.PI/2);
        agujero1.translate(0,0.08,0);
        agujero2.rotateX(-Math.PI/2);
        agujero2.translate(0,0.05,0);
        agujero3.rotateX(-Math.PI/2);
        agujero3.translate(0,0.02,0);
        ojo_iz.rotateX(-Math.PI/2);
        ojo_iz.translate(0.002,0.13,0.005);
        pupila_iz.rotateX(-Math.PI/2);
        pupila_iz.translate(0.002,0.17,0.007); 

        ojo_der.rotateX(-Math.PI/2);
        ojo_der.translate(0.006,0.13,0.005);
        pupila_der.rotateX(-Math.PI/2);
        pupila_der.translate(0.006,0.17,0.007);       

        var mesh = new THREE.Mesh(geometry, this.material_cuchillo);
        this.add(mesh);
        var mesh1 = new THREE.Mesh(mango_cuchillo, this.material_mango);
        this.add(mesh1);
        var mesh2 = new THREE.Mesh(agujero1, this.material_agujero);
        this.add(mesh2);
        var mesh3 = new THREE.Mesh(agujero2, this.material_agujero);
        this.add(mesh3);
        var mesh4 = new THREE.Mesh(agujero3, this.material_agujero);
        this.add(mesh4);
        var mesh5 = new THREE.Mesh(ojo_iz, this.matrial_ojo);
        mesh5.scale.set(1,1.3,1);
        this.add(mesh5);
        var mesh6 = new THREE.Mesh(pupila_iz, this.material_mango);
        this.add(mesh6);
        var mesh7 = new THREE.Mesh(ojo_der, this.matrial_ojo);
        mesh7.scale.set(1,1.3,1);
        this.add(mesh7);
        var mesh8 = new THREE.Mesh(pupila_der, this.material_mango);
        this.add(mesh8);
    }

    update(){}
}

export { Cuchillo }