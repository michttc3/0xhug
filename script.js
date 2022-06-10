





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
		  

// Custom Cursor
document.addEventListener("DOMContentLoaded", function(event) {
	var cursor = document.querySelector(".custom-cursor");
	var links = document.querySelectorAll("a");
	var initCursor = false;
  
	for (var i = 0; i < links.length; i++) {
	  var selfLink = links[i];
  
	  selfLink.addEventListener("mouseover", function() {
		cursor.classList.add("custom-cursor--link");
	  });
	  selfLink.addEventListener("mouseout", function() {
		cursor.classList.remove("custom-cursor--link");
	  });
	}
  
	window.onmousemove = function(e) {
	  var mouseX = e.clientX;
	  var mouseY = e.clientY;
  
	  if (!initCursor) {
		// cursor.style.opacity = 1;
		TweenLite.to(cursor, 0.3, {
		  opacity: 1
		});
		initCursor = true;
	  }
  
	  TweenLite.to(cursor, 0, {
		top: mouseY + "px",
		left: mouseX + "px"
	  });
	};
  
	window.onmouseout = function(e) {
	  TweenLite.to(cursor, 0.3, {
		opacity: 0
	  });
	  initCursor = false;
	};
  });
  



// Preloader

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

		  var scene = document.getElementById('scene');
		  var parallax = new Parallax(scene);
		  
		 