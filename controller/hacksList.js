//import { setUpScene } from './setUp.js';
(function() {
    // Set our main variables
let scene,  
    renderer,
    camera,
    model,                              // Our character
    neck,                               // Reference to the neck bone in the skeleton
    waist,                               // Reference to the waist bone in the skeleton
    possibleAnims,                      // Animations found in our file
    mixer,                              // THREE.js animations mixer
    idle,    
    activeAction,
    previousAction,                      // Idle, the default state our character returns to
    clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
    currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
    raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
    loaderAnim = document.getElementById('js-loader')
    
    containerCanvas = document.querySelector('.container-canvas');
    hackMeditate =  document.getElementById("#meditate");
    hackStrech =  document.getElementById("#streching");
    
     

    init(); 

    function init() {

        //model
        const MODEL_PATH = '../model/character/michelle_home.glb'
    
        //canvas
        const canvas = document.querySelector('#c');
        
        //back color
        const backgroundColor = 0xf1f1f1;

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
         
        
        //setUpScene();

        const mtl = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          skinning: true 
        });

        //loader
        var loader = new THREE.GLTFLoader();

        loader.load(
            MODEL_PATH,
            function(gltf) {
                // A lot is going to happen here, runs once model is loaded
                model = gltf.scene;

                
                let fileAnimations = gltf.animations;
                console.log(gltf.animations);

                //model’s traverse method to find all the meshs, and enabled the ability to cast and receive shadows.
                model.traverse(o => {
                    // if (o.isBone) {
                    //     console.log(o.name);
                    //   }
                    
                    if (o.isMesh) {
                      o.castShadow = true;
                      o.receiveShadow = true;
                    }

                   
                });

                // Set the models initial scale
                model.scale.set(10, 10, 10);

                //make model stand on the floor
                model.position.y = -11; 

                scene.add(model);

                //loader that waits before showinfg the model
                loaderAnim.remove();

                //amimations
                mixer = new THREE.AnimationMixer(model);

                numAnimations = fileAnimations.length;
                
                let startAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
                console.log();

                
              hackMeditate.onmouseover = function (){
                  console.log("hovered the element");
                  fadeToAction('dancing',0.2,fileAnimations,mixer,THREE);   
              }

              hackMeditate.onmouseout = function (){
                
                fadeToAction('idle',0.8,fileAnimations,mixer,THREE);   
            }

            hackStrech.onmouseover = function (){
              console.log("hovered the element");
              fadeToAction('hello',0.2,fileAnimations,mixer,THREE);   
          }

          hackStrech.onmouseout = function (){
            
            fadeToAction('idle',0.8,fileAnimations,mixer,THREE);   
        }



                // function mouseOut() {
                //   document.getElementById("demo").style.color = "black";
                // }
               

                activeAction = mixer.clipAction(startAnim);
			        	activeAction.play(startAnim);
          
                
               
            },
            undefined, // We don't need this function
            function(error) {
              console.error(error);
            }
          );              	

        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(50, 40, 0);

        // Add hemisphere light to scene
        scene.add(hemiLight);

        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        dirLight.position.set(-8, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;

         //Add directional Light to scene
        scene.add(dirLight);

        //light helper
        //const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
        //scene.add( helper );


        // Floor
        let floorGeometry = new THREE.PlaneGeometry(100, 100);
        let floorMaterial = new THREE.MeshPhongMaterial({
        color: 'white',
        shininess: 0,
        });

        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
        floor.receiveShadow = true;
        floor.position.y = -11;
        scene.add(floor);


        //circle behinf character
        let geometry = new THREE.SphereGeometry(8, 32, 32);
        let material = new THREE.MeshBasicMaterial({ color: 0x0085FF }); // 0xf2ce2e 
        let sphere = new THREE.Mesh(geometry, material);
        sphere.position.z = -15;
        sphere.position.y = -2.5;
        sphere.position.x = -0.25;
        scene.add(sphere);
    
    }

    function update(){
        //run the animations
        if (mixer) {
            mixer.update(clock.getDelta());
          }
        //check the windowsize
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
      
        update();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        let width = containerCanvas.clientWidth;
        let height = containerCanvas.clientHeight;

        //http://localhost:8888/wellbeinghacks/view/homeHacks.htmlconsole.log(width, height);
        let canvasPixelWidth = canvas.width / window.devicePixelRatio;
        let canvasPixelHeight = canvas.height / window.devicePixelRatio;
      
        const needResize =
          canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function fadeToAction( name,duration,fileAnimations,mixer,THREE) {

      previousAction = activeAction;
      //activeAction = actions[ name ];
      getAnim =  THREE.AnimationClip.findByName(fileAnimations,name);
      console.log(getAnim);
      activeAction = mixer.clipAction(getAnim);

      console.log(previousAction,activeAction);

      if ( previousAction !== activeAction ) {

        previousAction.fadeOut( duration );

      }

      activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();

    }
})(); // Don't add anything below this line