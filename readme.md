jquery.rotateX
==============

Rotate images with optional animation and easing
------------------------------------------------

Based upon and directly replaces _jquery.rotate.js_ version 3.1, with one 
important difference... the ***.rotate()*** method in this version returns a
jQuery selection, making it easier to manipulate the rotating objects
created by this plugin.

# Usage

Download the file _jquery.rotateX.js_ and place it in one of your web application's
folders then add a reference just above the `</head>` tag of each page in which it will be used.

For example, if the file is in your website's "/scripts" folder, use this line:-

	<script type="text/javascript" src="scripts/jquery.rotateX.js"></script>


# Methods

**Summary explanation for all supported methods, parameters and options**

## rotate(angle)

**Rotate the selected images**

***Returns:*** jQuery selection of newly created rotating images

***Parameters:***

* **angle**

	***[Number]*** - _default 0 (zero)_ - Angle value in degrees, for immediate rotation

	Example:

		$("#img").rotate(45);


## rotate(options)

**Rotate the selected images, with optional animation and easing**

***Returns:*** jQuery selection of newly created rotating images

***Parameters:***

* **options**

	***[Object]*** Object containing options for rotation. 
	
	***Supported options:***

	* *angle*

		***[Number]*** - default _0 (zero)_ - Angle value in degrees, for immediate rotation

		Example:

			$("#img").rotate({angle:45});

	* *bind*

		***[Object]*** Object containing events to bind on to a rotation object. $(this) inside events points to a rotation object - this way you can chain execution of rotations - $(this).rotate(...)

		Example:

			$("#img").rotate({bind:{
				click: function(){
					$(this).rotate({
						angle: 0, 
						animateTo: 180
					});
				}
			} });

	* *animateTo*

		***[Number]*** - default _0 (zero)_ - Angle value in degrees, for rotation to be animated to from current angle value (or given angle option value)

	    Example:
	
			(See bind example above for usage)

	* *duration*

		***[Number]*** - default _1000_ - Specifies a duration of animation, in milliseconds, when using animateTo action

		Example:

			$("#img").rotate({bind:{
				click: function(){
					$(this).rotate({
						duration: 6000,
						angle: 0, 
						animateTo: 100
					});
				}
			} });

	* *step*

		***[Function]*** - default _null_ - A function that will be executed on every animation step.
		
		Arguments:

		___currentAngle___ The current angle is provided as first argument.

	* *easing*

		***[Function]*** - default _(see below)_ - Easing function is used to make animation look more natural. 
		
		The function uses five parameters (x,t,b,c,d) to support easing from http://gsgd.co.uk/sandbox/jquery/easing/ (for more details please see documentation at their website). Remember to include easing plugin before using it in jQueryRotate!

		Default function:

			function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }

		Where:
			* t: current time, 
			* b: begInnIng value,
			* c: change In value, 
			* d: duration,
			* x: unused

		No easing (linear easing): 

			function(x, t, b, c, d) { return (t/d)*c ; }

		Example:

			$("#img").rotate({bind:{
				click: function(){
					$(this).rotate({
						angle: 0, 
						animateTo: 180,
						easing: $.easing.easeInOutElastic
					});
				}
			} });

	* *callback*

		***[Function]*** A function to be called when animation finishes.

		Example:

			$("#img").rotate({bind:{
				click: function(){
					$(this).rotate({
						angle: 0, 
						animateTo: 180,
						callback: function() { alert(1); }
					});
				}
			} });


## getRotateAngle

**Get the current angle of the selected rotating objects**

***Returns:*** Array of integers. The current angle of each selected 
rotating object.

***Parameters:*** (none)

Example:

	$("#img").rotate({
		angle: 45, 
        bind: {
			click : function(){
				alert($(this).getRotateAngle());
            }
        }
	});

## stopRotate
 
**Stop rotation of the selected rotating object**

***Returns:*** (nothing)

***Parameters:*** (none)
 
Example: 

	$("#img").rotate({
		bind: {
			click: function(){
				$("#img").rotate({
					angle: 0,
                    animateTo: 180,
                    duration: 6000
                });
                setTimeout(function(){
                    $("#img").stopRotate();
                }, 1000);
            }
        }
	});
 