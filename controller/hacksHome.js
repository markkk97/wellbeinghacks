//import { setUpScene } from './setUp.js';
//(function() {
    // Set our main variables
    export var scene,  
    renderer,
    camera,
    model,                              // Our character
    neck,                               // Reference to the neck bone in the skevaron
    waist,                               // Reference to the waist bone in the skevaron
    possibleAnims,                      // Animations found in our file
    mixer,                              // THREE.js animations mixer
    idle,    
    activeAction,
    previousAction,  
    sphere,  
    fileAnimations,                    // Idle, the default state our character returns to
    clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
    currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
    raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
    loaderAnim = document.getElementById('js-loader'),
    containerCanvas = document.querySelector('.container-canvas'),
    controller =  document.getElementById("controller"),
    audioController =  document.getElementById("audio-controller"),
    vid = document.getElementById("video-exercise");
    


    export const 
    //model
    MODEL_PATH = '../model/character/sophie_november.glb',
    //MODEL_PATH = '../model/character/bot4.glb',
    //MODEL_PATH = '../model/character/michelle_home3.glb',

   // MODEL_PATH2 = '../model/character/listHacks.glb',
   MODEL_PATH2 = '../model/character/sophie_november.glb',
    //MODEL_PATH2 = '../model/character/bot4.glb',

    //canvas
     canvas = document.querySelector('#c'),
    
    //back color
     backgroundColor = 0xf1f1f1;
  

    //init(); 
    

    export function init() {
     

        //new scene 
        scene = new THREE.Scene();
        scene.background = new THREE.Color('#ffffff');
        scene.fog = new THREE.Fog(backgroundColor, 60, 100);

        // Init the renderer
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        //renderer.physicallyCorrectLights = true;
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
        camera.position.z = 25; 
        camera.position.x = 0;
        camera.position.y = -3;
           
        //setUpScene();
        
        const mtl = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          skinning: true 
        });
	

       // Add hemisphere lights
       var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 8);
       scene.add(hemiLight);


      // Add directional lights
      let d = 8.25;
      let dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(40,80,60);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 1500;
      dirLight.shadow.camera.left = d * -1;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = d * -1;     
      scene.add(dirLight);

         //light helper
        // const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
        // scene.add( helper );

      //cast realistic colors  
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure= 2.3;
      
      // Floor
      var floorGeometry = new THREE.PlaneGeometry(100, 100);

      var floorMaterial = new THREE.MeshPhongMaterial({
      color: '#0D1117'
      });

      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
      floor.receiveShadow = true;
      floor.position.y = -11;
      scene.add(floor);


        // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				// mesh.rotation.x = - Math.PI / 2;
				// mesh.receiveShadow = true;
				// scene.add( mesh );


      //circle behinf character
      var geometry = new THREE.SphereGeometry(8, 32, 32);
      var material = new THREE.MeshPhongMaterial({ color: 0x5CA8B2, shininess:40,  }); // 0xf2ce2e 
      sphere = new THREE.Mesh(geometry, material);


      
      sphere.position.z = -15;
      sphere.position.y = 1;
      sphere.position.x = -0.25;            
      scene.add(sphere);

     

    


//       geometry = new THREE.SphereGeometry(1, 32, 32);
// material = new THREE.MeshPhongMaterial({
//   color: 0x777777,
//   shininess: 400,
// });
// sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

// var light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(0, 10, 10);
// scene.add(light);
    
    }

    function loadModel(model) {      
       //model’s traverse method to find all the meshs, and enabled the ability to cast and receive shadows.
       model.traverse(o => {                     
            o.castShadow = true; 
            o.receiveShadow = true;
       });

       // Set the models initial scale
       model.scale.set(10, 10, 10);
       //make model stand on the floor
       model.position.y = -11; 
       scene.add(model);
    }

    export function characterHome(){
      //loader
      var loader = new THREE.GLTFLoader();

      loader.load(
          MODEL_PATH,
          function(gltf) {

            model = gltf.scene;
              
            //position model in the scene
            loadModel(model);

            //loader that waits before showinfg the model
            loaderAnim.remove();

            //prepare amimations
            mixer = new THREE.AnimationMixer(model);                        
            fileAnimations = gltf.animations;

            console.log(fileAnimations);
            
              let startAnim = THREE.AnimationClip.findByName(fileAnimations, 'laying2');

                 // function mouseOut() {
              //   document.getElementById("demo").style.color = "black";
              // }
              console.log(startAnim);

              activeAction = mixer.clipAction(startAnim);
              activeAction.play(startAnim);
        
              setTimeout(function(){
             
                fadeToAction('kickup',0.8,fileAnimations,mixer,THREE);   
               
               },4000);
               
               setTimeout(function(){
               
                fadeToAction('armStretching',1,fileAnimations,mixer,THREE);   
               },5000);

               setTimeout(function(){                
               
                fadeToAction('hello',0.5,fileAnimations,mixer,THREE);   
               },10000);

               setTimeout(function(){                
               
                fadeToAction('idle',0.5,fileAnimations,mixer,THREE);   
               },12000);

              
          },
          undefined, // We don't need this function
          function(error) {
            console.error(error);
          }
        );              
    }
    
   


    export function characterList() {
  
      var loader = new THREE.GLTFLoader();

      loader.load(
          MODEL_PATH2,
          function(gltf) {

            console.log(gltf);
            
            model = gltf.scene;
              
            //position model in the scene
            loadModel(model);

            //loader that waits before showinfg the model
            loaderAnim.remove();

            //prepare amimations
            mixer = new THREE.AnimationMixer(model);                        
            let fileAnimations = gltf.animations;

            console.log(fileAnimations);
            
              let startAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

              console.log(startAnim);

              activeAction = mixer.clipAction(startAnim);
              
              activeAction.play(startAnim);
              
              $(".hack-element").on( "click", function() {
                Cookies.set('hack-id', $(this).attr('id'));                        
              });

              $(".hack-element").mouseenter(function() {
                var animPreview = $(this).attr('id');
                console.log(animPreview);
                fadeToAction(animPreview,0.5,fileAnimations,mixer,THREE); 
            }).mouseleave(function() {
              fadeToAction("happyIdle",0.5,fileAnimations,mixer,THREE); 
            });
            
      
          },
          undefined, // We don't need this function
          function(error) {
            console.error(error);
          }
        );              	

    }


   export function playExercise(actionToContinue,vid,fileAnimations) { 
      console.log(actionToContinue._clip.name);
      fadeToAction(actionToContinue._clip.name,0.8,fileAnimations,mixer,THREE);
      ///action.enabled=true; 
      vid.play();
    } 

   export function pauseExercise(vid,fileAnimations) { 
      fadeToAction("idle",0.8,fileAnimations,mixer,THREE);
      //action.enabled= false;
      vid.pause();
    } 
    
   
    
    export function characterExercise(){

      //html buttons and content needed
      
      var starter = document.getElementById("starter"),
      exerciseElements = document.getElementById("exercise-element"),
      exerciseBenefits = document.getElementById("exercise-benefits"),
      exerciseStartDiv = document.getElementById("exercise-start"),  
      hackToPLay = Cookies.get('hack-id'),
      hackJson= "../model/exercises/"+hackToPLay+".json",
      titleExercise = document.getElementById("title-exercise");

      //loader
      var loader = new THREE.GLTFLoader();

      loader.load(
          MODEL_PATH2,
          function(gltf) {
              model = gltf.scene;
              
              //position model in the scene
              loadModel(model);

              //loader that waits before showinfg the model
              loaderAnim.remove();

              //prepare amimations
              mixer = new THREE.AnimationMixer(model);                        
              let fileAnimations = gltf.animations;

              console.log(fileAnimations);
              
             
              
             //set title
            $.getJSON(hackJson, function(data) {          
              $("#title-exercise").html(data.title);
            });
              
 
              //start exercise, hide start button and reveal exercise
              // controllers and information(video)         
              starter.onclick = function () {                

                if (exerciseElements.style.display === "none") {
                  //switch the start button with the video and controllers
                  
                    exerciseElements.style.display = "block";
                    exerciseStartDiv.style.display = "none";  
                     
                    //set video                 
                    vid.setAttribute("src", "../model/exercises/" + hackToPLay + ".mp4");
                    console.log(hackToPLay);

                    
                    //play video
                    vid.play();
                    controller.innerHTML = "<i class='fa fa-pause-circle' aria-hidden='true'></i>"
                    ;   
                    //handle audio 
                    vid.muted = true;                                                    
                } else {
                  exerciseElements.style.display = "none";
                }
              }
               //logic that establishes which exercise will be played
               // add if logic that plays the right animations based on the cookie that is set
                //set start animation
              var startAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');   


              if (hackToPLay === "jj") {
                startAnim = THREE.AnimationClip.findByName(fileAnimations, 'excited');                             
                JjExerciseFlow(vid,startAnim, fileAnimations);  

              } else if(hackToPLay === "sideStretching") {
                startAnim = THREE.AnimationClip.findByName(fileAnimations, 'excited');    
                SideStretchingExerciseFlow(vid,startAnim, fileAnimations); 

              } else if(hackToPLay === "meditate") {
                meditateExerciseFlow(vid,startAnim, fileAnimations); 

              } else {
                startAnim = THREE.AnimationClip.findByName(fileAnimations, 'excited');    
                crossCrawlExerciseFlow(vid,startAnim, fileAnimations);
              }


              //progreess bar
              vid.ontimeupdate = function(){
                var percentage = ( vid.currentTime / vid.duration ) * 100;
                $("#custom-seekbar span").css("width", percentage+"%");
              };
              
              $("#custom-seekbar").on("click", function(e){
                  var offset = $(this).offset();
                  var left = (e.pageX - offset.left);
                  var totalWidth = $("#custom-seekbar").width();
                  var percentage = ( left / totalWidth );
                  var vidTime = vid.duration * percentage;
                  vid.currentTime = vidTime;
              });//click() 

              //end of the video
              vid.onended = function(e) {

                var endAnimations = ["victory","dance","jump"];
                var endAnimation = endAnimations[getRandom(0, 2)];
                console.log(getRandom(0, 2));

                fadeToAction(endAnimation,0.8,fileAnimations,mixer,THREE)

                if(endAnimation==="jump"){
                  setTimeout(function(){             
                    fadeToAction('happyIdle',0.8,fileAnimations,mixer,THREE);                    
                   },1500);
                }
                else if(endAnimation==="dance"){
                  setTimeout(function(){             
                    fadeToAction('happyIdle',0.8,fileAnimations,mixer,THREE);                    
                   },5000);
                }
                else{
                  setTimeout(function(){             
                    fadeToAction('happyIdle',0.8,fileAnimations,mixer,THREE);                    
                   },4000);
                }

                


                console.log("video ended");
                exerciseElements.style.display = "none";
                exerciseBenefits.style.display = "block";

                $.getJSON(hackJson, function(data) {
                  var b1 = data.benefits.benefit1,
                  b2 = data.benefits.benefit2;
                  //document.getElementById("benefit-image-1").html("ciao");
                  $("#benefit-image-1").attr("src","../model/exercises/pics/"+b1[0]);
                  $("#benefit-title-1").html(b1[1]);
                  $("#benefit-text-1").html(b1[2]);
                  $("#benefit-image-2").attr("src","../model/exercises/pics/"+b2[0]);
                  $("#benefit-title-2").html(b2[1]);
                  $("#benefit-text-2").html(b2[2]);
                  $("#benefit-link").attr("href", "https://www.insider.com/jumping-jacks-benefits")

              });
              };


              playController(vid,controller,fileAnimations);
              audioControllers(vid,audioController);
                                              
          },
          undefined, // We don't need this function
          function(error) {
            console.error(error);
          }
        );              
    }

    function playController(vid,controller,fileAnimations) {
      //controlling of play pause
      controller.onclick = function () { 
                         
        if (vid.paused) {
          //go back to playing                
           playExercise(previousAction,vid,fileAnimations);
           controller.innerHTML = "<i class='fa fa-pause-circle' aria-hidden='true'></i>";                            
        } else {
         //go to paused                   
           pauseExercise(vid,fileAnimations);    
           controller.innerHTML = "<i class='fa fa-play-circle' aria-hidden='true'></i>";
        }              
        
       }
      }


    function audioControllers(vid,audioController) {
     
       //controlling of audio
       audioController.onclick = function () { 
                    
         if (!vid.muted) {
           console.log("from play to mute");
           //from mute to play                
           vid.muted = true;
           audioController.innerHTML = "<i class='fa fa-volume-up' aria-hidden='true'></i>";                              
         } else {
           console.log("from mute to play ");
          //from play to mute                   
           vid.muted = false;
           audioController.innerHTML =   "<i class='fa fa-volume-off' aria-hidden='true'></i>";                              
         }                 
         
        }
      
    }

    function JjExerciseFlow(vid,startAnim,fileAnimations) {
       setTimeout(function(){             
                  fadeToAction('happyIdle',0.8,fileAnimations,mixer,THREE);                    
        },3000);
    
      activeAction = mixer.clipAction(startAnim);
      activeAction.play();

      //keeping track of which animationsn have been playd already
      var action1Played = false,
      action2Played = false, 
      action3Played = false;

      //code executed while video is playing
      vid.addEventListener("timeupdate", function(){  

        if(vid.currentTime >= 5 && action1Played == false ) {                    
            fadeToAction('jj',0.8,fileAnimations,mixer,THREE);
            action1Played = true;
           
        }
          

        if(vid.currentTime >= 53 && action2Played == false ) {          
          fadeToAction('arms',0.8,fileAnimations,mixer,THREE);
          action2Played = true;
         
      }
      });
      
    }

    function SideStretchingExerciseFlow(vid,startAnim,fileAnimations) {
      
      setTimeout(function(){             
        fadeToAction('happyIdle',0.8,fileAnimations,mixer,THREE);                    
      },3000);
      
      //flow of exercise 
      activeAction = mixer.clipAction(startAnim);
      activeAction.play();

      //keeping track of which animationsn have been playd already
      var action1Played = false;
      

      //code executed while video is playing
      vid.addEventListener("timeupdate", function(){  

        if(vid.currentTime >= 4 && action1Played == false ) {                    
            fadeToAction('sideStretching',0.8,fileAnimations,mixer,THREE);
            action1Played = true;

        }
            
      });
      
    }

    

    function animateSphere() {

      requestAnimationFrame(animateSphere);
      render();
  
  }
  
    function render() {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.02;
        
        var t = clock.getElapsedTime();

        if (t >= 6.0){
          //getting big
            clock = new THREE.Clock;           
            sphere.scale.x = 1+(t/5.0);
            sphere.scale.y = 1+(t/5.0);
            sphere.scale.z = 1+(t/5.0);  
        }
        else{   
          //getting small
          sphere.scale.x = 1-(t/3);
          sphere.scale.y = 1-(t/3);
          sphere.scale.z = 1-(t/3);   
        }
        renderer.render(scene, camera);
    }


    function meditateExerciseFlow(vid,startAnim,fileAnimations) {
      
      //breathing sphere
      animateSphere();
      
     //flow of exercise 
     activeAction = mixer.clipAction(startAnim);
     activeAction.play();

     //keeping track of which animationsn have been playd already
     var action1Played = false;
     

     //code executed while video is playing
     vid.addEventListener("timeupdate", function(){  

       if(vid.currentTime >= 2 && action1Played == false ) {                    
           fadeToAction('meditate',0.8,fileAnimations,mixer,THREE);
           action1Played = true;
          
       }
         

     });
      
    }

    function crossCrawlExerciseFlow(vid,startAnim,fileAnimations) {
      
      setTimeout(function(){             
        fadeToAction('happyIdle',0.8,fileAnimations,mixer,THREE);                    
      },3000);
      
      //flow of exercise 
      activeAction = mixer.clipAction(startAnim);
      activeAction.play();

      //keeping track of which animationsn have been playd already
      var action1Played = false,
      action2Played = false;
     

      //code executed while video is playing
      vid.addEventListener("timeupdate", function(){  

        if(vid.currentTime >= 5 && action1Played == false ) {                    
            fadeToAction('crossCrawling',0.8,fileAnimations,mixer,THREE);
            action1Played = true;
        }
        if(vid.currentTime >= 43 && action2Played == false ) {                    
          fadeToAction('arms',0.8,fileAnimations,mixer,THREE);
          action2Played = true;
      }
            
      });
      
    }

    function getRandom(min, max) {
      return Math.floor( Math.random() * (max - min + 1) + min);
    }

   export function update(){
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
      
       // update(renderer);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        var width = containerCanvas.clientWidth;
        var height = containerCanvas.clientHeight;

        //http://localhost:8888/wellbeinghacks/view/homeHacks.htmlconsole.log(width, height);
        var canvasPixelWidth = canvas.width / window.devicePixelRatio;
        var canvasPixelHeight = canvas.height / window.devicePixelRatio;
      
        const needResize =
          canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function fadeToAction(name,duration,fileAnimations,mixer,THREE) {

      previousAction = activeAction;
      //activeAction = actions[ name ];
      var getAnim =  THREE.AnimationClip.findByName(fileAnimations,name);
      //console.log(getAnim);
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


    export function ARController(){

    
      $("#play-pause").hide();

      $(".animation").click(function() {

        $("#play-pause").show();

        var activeAnimationAR,previousAnimationAR = "";
        var character = document.querySelector("#bowser-model");  
       
        activeAnimationAR =  $(this).attr('id');
        var audio = document.querySelector("#exerciseAudio");

        //Cookies.set('hack-id', activeAnimation);
        console.log(activeAnimationAR);
        
        
        character.setAttribute("animation-mixer", {clip: activeAnimationAR})     
        //audio.setAttribute("src","./assets/audio/"+activeAnimationAR+".m4a")
        //audio.play();

        controller.onclick = function () { 
                    
          if (audio.paused) {
            console.log("go back to playing");
            //go back to playing                
            character.setAttribute("animation-mixer", {clip: previousAnimationAR});
            controller.innerHTML = "<i class='fa fa-pause-circle' aria-hidden='true'></i>";   
            audio.play();                         
          } else {
            //go to paused 
            console.log("go to paused");
            previousAnimationAR =  activeAnimationAR;
            activeAnimationAR = "idle";
            character.setAttribute("animation-mixer", {clip: activeAnimationAR})      
            activeAnimationAR = previousAnimationAR;
            controller.innerHTML = "<i class='fa fa-play-circle' aria-hidden='true'></i>";
            audio.pause(); 
          }              
          
         }

         audioControllers(audio,audioController);

        audio.onended = function() {
          character.setAttribute("animation-mixer", {clip: "idle"});     
        }; 
        
        
    });
    }

    

    
//})(); // Don't add anything below this line