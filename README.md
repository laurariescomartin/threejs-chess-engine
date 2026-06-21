# ♟️ ChefDrez - Interactive 3D Chess Engine

ChefDrez es una implementación avanzada de ajedrez desarrollada con **Three.js**, que fusiona la estrategia clásica con una experiencia visual inmersiva. En este proyecto, las piezas de ajedrez se transforman en utensilios de cocina sobre una tabla de cortar, convirtiendo cada partida en un "duelo culinario".

Este proyecto destaca por su arquitectura modular, el uso de lógica de juego desacoplada y animaciones asíncronas para una experiencia de usuario dinámica.

## 🏗️ Arquitectura Técnica

El software está diseñado siguiendo un patrón de separación de responsabilidades para garantizar escalabilidad y mantenimiento:

* **Motor de Reglas (`Ajedrez.js`):** Actúa como el núcleo lógico del sistema. Gestiona la matriz del tablero y utiliza un **patrón Strategy** para validar los movimientos legales de cada pieza, lo que permite añadir nuevos tipos de movimientos de forma independiente.
* **Orquestador Visual (`MyScene.js`):** Gestiona el renderizado 3D, el bucle principal (`update`), el sistema de iluminación dinámica y los eventos de interacción mediante `Raycaster`.
* **Sistema de Piezas:** Cada pieza es un objeto 3D (`THREE.Object3D`) con lógica encapsulada. La **Torre** destaca por implementar un método de animación personalizado (`playCaptureAnimation`) que permite coreografías únicas al capturar, sincronizadas mediante **Promesas**.

## 🧠 Retos Técnicos y Soluciones

* **Sincronización Asíncrona:** El mayor desafío fue coordinar la lógica del tablero con las animaciones visuales de captura. Resolví la concurrencia utilizando **`Promises`** para asegurar que el motor lógico solo actualice el tablero una vez que la animación de ataque (gestionada por `TWEEN.js`) haya finalizado por completo.
* **Optimización del Render Loop:** La integración del `deltaTime` en el método `update` garantiza que todas las animaciones y transiciones de cámara sean fluidas, independientemente de la tasa de refresco del navegador.
* **Modularidad y POO:** Implementé una jerarquía de clases que permite la extensión del juego (añadir nuevas piezas o reglas) sin modificar la lógica central del tablero, cumpliendo con principios de diseño de software sólido.

## 💡 Experiencia de Usuario (UX)

La iluminación es un elemento narrativo clave en ChefDrez:
* **Entorno Adaptativo:** La iluminación responde al contexto; el escenario cambia de tonalidad mediante `PointLight` según la pieza seleccionada, intensificando el dramatismo en momentos críticos como las capturas de la Torre.
* **Control de Cámara Cinemático:** Mediante `TWEEN.js`, la cámara rota automáticamente hacia el jugador que tiene el turno, mejorando la legibilidad del juego y manteniendo al usuario inmerso en la acción.

## 📺 Demostración Funcional

Puedes ver una demostración técnica de las mecánicas y animaciones de captura aquí:

https://github.com/user-attachments/assets/0a552c56-56f9-4a3f-8d57-d15c5dd0c9ba

## 🛠️ Stack Tecnológico

* **Core:** JavaScript (ES6+), Three.js.
* **Animación:** TWEEN.js, catmullRomCurve3.
* **Entorno:** WebGL, Raycasting para interacción.

---

## 🚀 Cómo ejecutar el proyecto

1. Clonar este repositorio.
2. Utilizar un servidor local (como *Live Server* en VS Code) para evitar errores de CORS con los módulos de Three.js.
3. Abrir `index.html` en el navegador.
