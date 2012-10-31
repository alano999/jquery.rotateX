/***********************************************************
* Rotate 
* Alan Oliver
* Modifications:-
*  Version 1 30-October-2012
*   - return jQuery objects (allows to change opacity etc)
*   - make test for IE more robust
*   - doesn't work in IE9, don't try CSS for any IE version
************************************************************
* Originally based upon jquery.rotate by Wilq32 (see below)
* (VERSION: 3.1 LAST UPDATE: 13.03.2012)
***********************************************************/
/* 
* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
* 
* Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
* Website: http://code.google.com/p/jqueryrotate/ 
*/

(function ($) {
    var supportedCSS, styles = document.getElementsByTagName("head")[0].style;
    var toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" "); //MozTransform <- firefox works slower with css!!!
    for (var a = 0; a < toCheck.length; a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
    var IE = Boolean(navigator.appVersion.indexOf('MSIE')+1);

    jQuery.fn.extend({
        rotate: function (options) {
            if (this.length === 0 || typeof options == "undefined") return;
            if (typeof options == "number") options = { angle: options };
            var $newRotObjects = $();
            for (var i = 0, i0 = this.length; i < i0; i++) {
                var element = this.get(i);
                if (!element.Wilq32 || !element.Wilq32.PhotoEffect) {

                    var optionsClone = $.extend(true, {}, options);
                    var newRotObject = new Wilq32.PhotoEffect(element, optionsClone)._rootObj;

                    $newRotObjects = $newRotObjects.add(newRotObject);
                }
                else {
                    element.Wilq32.PhotoEffect._handleRotation(options);
                }
            }
            return $newRotObjects;
        },
        getRotateAngle: function () {
            var ret = [];
            for (var i = 0, i0 = this.length; i < i0; i++) {
                var element = this.get(i);
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    ret[i] = element.Wilq32.PhotoEffect._angle;
                }
            }
            return ret;
        },
        stopRotate: function () {
            for (var i = 0, i0 = this.length; i < i0; i++) {
                var element = this.get(i);
                if (element.Wilq32 && element.Wilq32.PhotoEffect) {
                    clearTimeout(element.Wilq32.PhotoEffect._timer);
                }
            }
        }
    });

    // Library agnostic interface

    Wilq32 = window.Wilq32 || {};
    Wilq32.PhotoEffect = (function () {

        if (IE) {
            return function (img, options) {
                // Make sure that class and id are also copied - just in case you would like to refeer to an newly created object
                this._img = img;

                this._rootObj = document.createElement('span');
                this._rootObj.style.display = "inline-block";
                this._rootObj.Wilq32 = { PhotoEffect: this };
                img.parentNode.insertBefore(this._rootObj, img);
                this._Loader(options);
            }
        } else if (supportedCSS) {
            return function (img, options) {
                img.Wilq32 = { PhotoEffect: this };

                this._img = this._rootObj = this._eventObj = img;
                this._handleRotation(options);
            }
        } else {
            return function (img, options) {
                // Just for now... Dont do anything if CSS3 is not supported
                this._rootObj = img;
            }
        }
    })();

    Wilq32.PhotoEffect.prototype = {
        _setupOptions: function (options) {
            this._options = this._options || {};
            if (typeof this._angle !== "number") this._angle = 0;
            if (typeof options.angle === "number") this._angle = options.angle;
            this._options.animateTo = (typeof options.animateTo === "number") ? (options.animateTo) : (this._angle);

            this._options.step = options.step || this._options.step || null;
            this._options.easing = options.easing || this._options.easing || function (x, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b; }
            this._options.duration = options.duration || this._options.duration || 1000;
            this._options.callback = options.callback || this._options.callback || function () { };
            if (options.bind && options.bind != this._options.bind) this._BindEvents(options.bind);
        },
        _handleRotation: function (options) {
            this._setupOptions(options);
            if (this._angle == this._options.animateTo) {
                this._rotate(this._angle);
            }
            else {
                this._animateStart();
            }
        },

        _BindEvents: function (events) {
            if (events && this._eventObj) {
                // Unbinding previous Events
                if (this._options.bind) {
                    var oldEvents = this._options.bind;
                    for (var a in oldEvents) if (oldEvents.hasOwnProperty(a))
                    // TODO: Remove jQuery dependency
                        jQuery(this._eventObj).unbind(a, oldEvents[a]);
                }

                this._options.bind = events;
                for (var b in events) if (events.hasOwnProperty(b))
                // TODO: Remove jQuery dependency
                    jQuery(this._eventObj).bind(b, events[b]);
            }
        },

        _Loader: function (options) {
            var width = this._img.width;
            var height = this._img.height;
            //this._img.parentNode.removeChild(this._img);
            //this._rootObj.parentNode.removeChild(this._rootObj);

            this._rootObj.appendChild(this._img);

            this._rootObj.style.width = this._img.offsetWidth;
            this._rootObj.style.height = this._img.offsetHeight;

            this._img.style.position = "absolute";

            this._rootObj = this._img;
            this._rootObj.Wilq32 = { PhotoEffect: this }

            this._rootObj.style.filter += "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=1,M21=1,M22=1,sizingMethod='auto expand')";

            this._eventObj = this._rootObj;
            this._handleRotation(options);
        },

        _animateStart: function () {
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._animateStartTime = +new Date;
            this._animateStartAngle = this._angle;
            this._animate();
        },
        _animate: function () {
            var actualTime = +new Date;
            var checkEnd = actualTime - this._animateStartTime > this._options.duration;

            // TODO: Bug for animatedGif for static rotation ? (to test)
            if (checkEnd && !this._options.animatedGif) {
                clearTimeout(this._timer);
            }
            else {
                if (this._canvas || this._vimage || this._img) {
                    var angle = this._options.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._options.animateTo - this._animateStartAngle, this._options.duration);
                    this._rotate((~ ~(angle * 10)) / 10);
                }
                if (this._options.step) {
                    this._options.step(this._angle);
                }
                var self = this;
                this._timer = setTimeout(function () {
                    self._animate.call(self);
                }, 10);
            }

            // To fix Bug that prevents using recursive function in callback I moved this function to back
            if (this._options.callback && checkEnd) {
                this._angle = this._options.animateTo;
                this._rotate(this._angle);
                this._options.callback.call(this._rootObj);
            }
        },

        _rotate: (function () {
            var rad = Math.PI / 180;
            if (IE)
                return function (angle) {
                    this._angle = angle;
                    //this._container.style.rotation=(angle%360)+"deg";
                    var _rad = angle * rad;
                    costheta = Math.cos(_rad);
                    sintheta = Math.sin(_rad);
                    var fil = this._rootObj.filters.item("DXImageTransform.Microsoft.Matrix");
                    fil.M11 = costheta; fil.M12 = -sintheta; fil.M21 = sintheta; fil.M22 = costheta;

                    this._rootObj.style.marginLeft = -(this._rootObj.offsetWidth - this._rootObj.clientWidth) / 2 + "px";
                    this._rootObj.style.marginTop = -(this._rootObj.offsetHeight - this._rootObj.clientHeight) / 2 + "px";
                }
            else if (supportedCSS)
                return function (angle) {
                    this._angle = angle;
                    this._img.style[supportedCSS] = "rotate(" + (angle % 360) + "deg)";
                }

        })()
    }
})(jQuery);