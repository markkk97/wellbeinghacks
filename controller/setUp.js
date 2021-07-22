export function setUpScene(params) {
    //new scene 
    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);

    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    //renderer.physicallyCorrectLights = false;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    containerCanvas.appendChild(renderer.domElement);

    // Add a camera
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
       
        0.1,
        1000
    );
    camera.position.z = 25 
    camera.position.x = 0;
    camera.position.y = -3;
}