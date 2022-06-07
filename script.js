// ScrollTrigger
		  function animateFrom(elem, direction) {
			direction = direction || 1;
			var x = 0,
				y = direction * 100;
			if(elem.classList.contains("gs_reveal_fromLeft")) {
			  x = -100;
			  y = 0;
			} else if (elem.classList.contains("gs_reveal_fromRight")) {
			  x = 100;
			  y = 0;
			}
			elem.style.transform = "translate(" + x + "px, " + y + "px)";
			elem.style.opacity = "0";
			gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
			  duration: 1.25, 
			  x: 0,
			  y: 0, 
			  autoAlpha: 1, 
			  ease: "expo", 
			  overwrite: "auto"
			});
		  }
		  
		  function hide(elem) {
			gsap.set(elem, {autoAlpha: 0});
		  }
		  
		  document.addEventListener("DOMContentLoaded", function() {
			gsap.registerPlugin(ScrollTrigger);
			
			gsap.utils.toArray(".gs_reveal").forEach(function(elem) {
			  hide(elem); // assure that the element is hidden when scrolled into view
			  
			  ScrollTrigger.create({
				trigger: elem,
				onEnter: function() { animateFrom(elem) }, 
				onEnterBack: function() { animateFrom(elem, -1) },
				onLeave: function() { hide(elem) } // assure that the element is hidden when scrolled into view
			  });
			});
		  });
		  



//HERO PAGE

const preload = () => {

  let manager = new THREE.LoadingManager();
  manager.onLoad = function() { 
    const environment = new Environment( typo, particle );
  }

  var typo = null;
  const loader = new THREE.FontLoader( manager );
  const font = loader.load('./fonts/Appetite New_Regular.json', function ( font ) { typo = font; });
  const particle = new THREE.TextureLoader( manager ).load( 'https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');

}

if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll))
  preload ();
else
  document.addEventListener("DOMContentLoaded", preload ); 

class Environment {

  constructor( font, particle ){ 

    this.font = font;
    this.particle = particle;
    this.container = document.querySelector( '#magic' );
    this.scene = new THREE.Scene();
    this.createCamera();
    this.createRenderer();
    this.setup()
    this.bindEvents();
  }

  bindEvents(){

    window.addEventListener( 'resize', this.onWindowResize.bind( this ));
    
  }

  setup(){ 

    this.createParticles = new CreateParticles( this.scene, this.font, this.particle, this.camera, this.renderer );
  }

  render() {
    
     this.createParticles.render()
     this.renderer.render( this.scene, this.camera )
  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth /  this.container.clientHeight, 1, 10000 );
    this.camera.position.set( 0,0, 100 );

  }

  createRenderer() {

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

    this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild( this.renderer.domElement );

    this.renderer.setAnimationLoop(() => { this.render() })

  }

  onWindowResize(){

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

  }
}

class CreateParticles {
	
	constructor( scene, font, particleImg, camera, renderer ) {
    
		this.scene = scene;
		this.font = font;
		this.particleImg = particleImg;
		this.camera = camera;
		this.renderer = renderer;
		
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2(-200, 200);
		
		this.colorChange = new THREE.Color();

		this.buttom = false;

		this.data = {

			text: '0xhug',
			amount: 1500,
			particleSize: 1,
			particleColor: 0xffffff,
			textSize: 25,
			area: 250,
			ease: .05,
		}

		this.setup();
		this.bindEvents();

	}


	setup(){

		const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
		const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
		this.planeArea = new THREE.Mesh( geometry, material );
		this.planeArea.visible = false;
		this.createText();

	}

	bindEvents() {

		document.addEventListener( 'mousedown', this.onMouseDown.bind( this ));
		document.addEventListener( 'mousemove', this.onMouseMove.bind( this ));
		document.addEventListener( 'mouseup', this.onMouseUp.bind( this ));
		
	}

	onMouseDown(){
		
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		const vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5);
		vector.unproject( this.camera );
		const dir = vector.sub( this.camera.position ).normalize();
		const distance = - this.camera.position.z / dir.z;
		this.currenPosition = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		
		const pos = this.particles.geometry.attributes.position;
		this.buttom = true;
		this.data.ease = .01;
		
	}

	onMouseUp(){

		this.buttom = false;
		this.data.ease = .05;
	}

	onMouseMove( ) { 

	    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}

	render( level ){ 

		const time = ((.001 * performance.now())%12)/12;
		const zigzagTime = (1 + (Math.sin( time * 2 * Math.PI )))/6;

		this.raycaster.setFromCamera( this.mouse, this.camera );

		const intersects = this.raycaster.intersectObject( this.planeArea );

		if ( intersects.length > 0 ) {

			const pos = this.particles.geometry.attributes.position;
			const copy = this.geometryCopy.attributes.position;
			const coulors = this.particles.geometry.attributes.customColor;
			const size = this.particles.geometry.attributes.size;

		    const mx = intersects[ 0 ].point.x;
		    const my = intersects[ 0 ].point.y;
		    const mz = intersects[ 0 ].point.z;

		    for ( var i = 0, l = pos.count; i < l; i++) {

		    	const initX = copy.getX(i);
		    	const initY = copy.getY(i);
		    	const initZ = copy.getZ(i);

		    	let px = pos.getX(i);
		    	let py = pos.getY(i);
		    	let pz = pos.getZ(i);

		    	this.colorChange.setHSL( .5, 1 , 1 )
		    	coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    	coulors.needsUpdate = true;

		    	size.array[ i ]  = this.data.particleSize;
		    	size.needsUpdate = true;

		    	let dx = mx - px;
		    	let dy = my - py;
		    	const dz = mz - pz;

		    	const mouseDistance = this.distance( mx, my, px, py )
		    	let d = ( dx = mx - px ) * dx + ( dy = my - py ) * dy;
		    	const f = - this.data.area/d;

		    	if( this.buttom ){ 

		    		const t = Math.atan2( dy, dx );
		    		px -= f * Math.cos( t );
		    		py -= f * Math.sin( t );

		    		this.colorChange.setHSL( .5 + zigzagTime, 1.0 , .5 )
		    		coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    		coulors.needsUpdate = true;

		    		if ((px > (initX + 70)) || ( px < (initX - 70)) || (py > (initY + 70) || ( py < (initY - 70)))){

		    			this.colorChange.setHSL( .15, 1.0 , .5 )
		    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    			coulors.needsUpdate = true;

		    		}

		    	}else{
		    	
			    	if( mouseDistance < this.data.area ){

			    		if(i%5==0){

			    			const t = Math.atan2( dy, dx );
			    			px -= .03 * Math.cos( t );
			    			py -= .03 * Math.sin( t );

			    			this.colorChange.setHSL( .15 , 1.0 , .5 )
			    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			coulors.needsUpdate = true;

							size.array[ i ]  =  this.data.particleSize /1.2;
							size.needsUpdate = true;

			    		}else{

					    	const t = Math.atan2( dy, dx );
					    	px += f * Math.cos( t );
					    	py += f * Math.sin( t );

					    	pos.setXYZ( i, px, py, pz );
					    	pos.needsUpdate = true;

					    	size.array[ i ]  = this.data.particleSize * 1.3 ;
					    	size.needsUpdate = true;
				    	}

			    		if ((px > (initX + 10)) || ( px < (initX - 10)) || (py > (initY + 10) || ( py < (initY - 10)))){

			    			this.colorChange.setHSL( .15, 1.0 , .5 )
			    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			coulors.needsUpdate = true;

			    			size.array[ i ]  = this.data.particleSize /1.8;
			    			size.needsUpdate = true;

			    		}
			    	}

		    	}

		    	px += ( initX  - px ) * this.data.ease;
		    	py += ( initY  - py ) * this.data.ease;
		    	pz += ( initZ  - pz ) * this.data.ease;

		    	pos.setXYZ( i, px, py, pz );
		    	pos.needsUpdate = true;

		    }
		}
	}

	createText(){ 

		let thePoints = [];

		let shapes = this.font.generateShapes( this.data.text , this.data.textSize  );
		let geometry = new THREE.ShapeGeometry( shapes );
		geometry.computeBoundingBox();
	
		const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		const yMid =  (geometry.boundingBox.max.y - geometry.boundingBox.min.y)/2.85;

		geometry.center();

		let holeShapes = [];

		for ( let q = 0; q < shapes.length; q ++ ) {

			let shape = shapes[ q ];

			if ( shape.holes && shape.holes.length > 0 ) {

				for ( let  j = 0; j < shape.holes.length; j ++ ) {

					let  hole = shape.holes[ j ];
					holeShapes.push( hole );
				}
			}

		}
		shapes.push.apply( shapes, holeShapes );

		let colors = [];
		let sizes = [];
					
		for ( let  x = 0; x < shapes.length; x ++ ) {

			let shape = shapes[ x ];

			const amountPoints = ( shape.type == 'Path') ? this.data.amount/2 : this.data.amount;

			let points = shape.getSpacedPoints( amountPoints ) ;

			points.forEach( ( element, z ) => {
						
				const a = new THREE.Vector3( element.x, element.y, 0 );
				thePoints.push( a );
				colors.push( this.colorChange.r, this.colorChange.g, this.colorChange.b);
				sizes.push( 1 )

				});
		}

		let geoParticles = new THREE.BufferGeometry().setFromPoints( thePoints );
		geoParticles.translate( xMid, yMid, 0 );
				
		geoParticles.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
		geoParticles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );

		const material = new THREE.ShaderMaterial( {

			uniforms: {
				color: { value: new THREE.Color( 0xffffff ) },
				pointTexture: { value: this.particleImg }
			},
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
		} );

		this.particles = new THREE.Points( geoParticles, material );
		this.scene.add( this.particles );

		this.geometryCopy = new THREE.BufferGeometry();
		this.geometryCopy.copy( this.particles.geometry );
		
	}

	visibleHeightAtZDepth ( depth, camera ) {

	  const cameraOffset = camera.position.z;
	  if ( depth < cameraOffset ) depth -= cameraOffset;
	  else depth += cameraOffset;

	  const vFOV = camera.fov * Math.PI / 180; 

	  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
	}

	visibleWidthAtZDepth( depth, camera ) {

	  const height = this.visibleHeightAtZDepth( depth, camera );
	  return height * camera.aspect;

	}

	distance (x1, y1, x2, y2){
	   
	    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	}
}









$(window).scroll(function() {
	if ($(document).scrollTop() > 50) {
		$('.nav').addClass('affix');
		console.log("OK");
	} else {
		$('.nav').removeClass('affix');
	}
});

$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked menu");
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();

});





//cursor


const cursor = document.querySelector('#cursor');
const cursorCircle = cursor.querySelector('.cursor__circle');

const mouse = { x: -100, y: -100 }; // mouse pointer's coordinates
const pos = { x: 40, y: 40 }; // cursor's coordinates
const speed = 0.7; // between 0 and 1

const updateCoordinates = e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

window.addEventListener('mousemove', updateCoordinates);


function getAngle(diffX, diffY) {
  return Math.atan2(diffY, diffX) * 180 / Math.PI;
}

function getSqueeze(diffX, diffY) {
  const distance = Math.sqrt(
    Math.pow(diffX, 2) + Math.pow(diffY, 2)
  );
  const maxSqueeze = 0.80;
  const accelerator = 1500;
  return Math.min(distance / accelerator, maxSqueeze);
}


const updateCursor = () => {
  const diffX = Math.round(mouse.x - pos.x);
  const diffY = Math.round(mouse.y - pos.y);
  
  pos.x += diffX * speed;
  pos.y += diffY * speed;
  
  const angle = getAngle(diffX, diffY);
  const squeeze = getSqueeze(diffX, diffY);
  
  const scale = 'scale(' + (1 + squeeze) + ', ' + (1 - squeeze) +')';
  const rotate = 'rotate(' + angle +'deg)';
  const translate = 'translate3d(' + pos.x + 'px ,' + pos.y + 'px, 0)';

  cursor.style.transform = translate;
  cursorCircle.style.transform = rotate + scale;
};

function loop() {
  updateCursor();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);



const cursorModifiers = document.querySelectorAll('[cursor-class]');

cursorModifiers.forEach(curosrModifier => {
  curosrModifier.addEventListener('mouseenter', function() {
    const className = this.getAttribute('cursor-class');
    cursor.classList.add(className);
  });
  
  curosrModifier.addEventListener('mouseleave', function() {
    const className = this.getAttribute('cursor-class');
    cursor.classList.remove(className);
  });
});



//Text Distort
$(window).scroll(function(){
	scroll();
  });
  
  scroll();
  
  function scroll(){
	var top = $('html, body').scrollTop();
	var el = $("#distort").find("feDisplacementMap");
	
	el.attr('scale', top);
	$("h1").css('opacity', 1 - (top * 0.007))
  }

  //Menu 
  function menuOnClick() {
	document.getElementById("menu-bar").classList.toggle("change");
	document.getElementById("burger").classList.toggle("change");
	document.getElementById("menu-bg").classList.toggle("change-bg");
  }



//   Preloader


          // number of loaded images for preloader progress
		  var loadedCount = 0; //current number of images loaded
		  var imagesToLoad = $('.js-img-load').length; //number of slides with .bcg container
		  var loadingProgress = 0; //timeline progress - starts at 0
		   
		  $('.js-img-load').imagesLoaded({
			  
		  }).progress( function( instance, image ) {
			  loadProgress();
		  });
		   
		  function loadProgress(imgLoad, image)
		  {
			  //one more image has been loaded
			  loadedCount++;
		   
			  loadingProgress = (loadedCount/imagesToLoad);
		   
			  // GSAP tween of our progress bar timeline
			  TweenLite.to(progressTl, 0.7, {progress:loadingProgress, ease:Linear.easeNone});
		   
		  }
  
		  //progress timeline
		  var progressTl = new TimelineMax({
			  paused: true,
			  onUpdate: progressUpdate,
			  onComplete: loadComplete
		  });
		   
		  progressTl
			  //tween the progress bar width
			  .to($('.loader-progress span'), 1, {width:100, ease:Linear.easeNone});
		   
		  //as the progress bar width updates and grows we put the percentage loaded in the screen
		  function progressUpdate()
		  {
			  //the percentage loaded based on the tween's progress
			  loadingProgress = Math.round(progressTl.progress() * 100);
		   
			  //we put the percentage in the screen
			  $(".loader-text").text(loadingProgress + '%');
		   
		  }
  
  
		  function loadComplete() {
			// preloader out
			var preloaderOutTl = new TimelineMax();
		 
			preloaderOutTl
			  .to($('.loader-wrapper'), 0.3, {autoAlpha: 0, ease:Back.easeInOut})
			  .set($('body'), {className: '-=is-loading'})
			  .set($('html'), {className: '+=is-intro-leave'})
			  .set($('#intro'), {className: '+=is-loaded'})
			  .to($('#site-loader'), 0.8, {yPercent: 100, ease:Power4.easeInOut})
			  .set($('#site-loader'), {className: '+=is-hidden'});
		 
			return preloaderOutTl;
		  }


		  
