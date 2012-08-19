/**
 * Pie Chart Count Down
 * ------------------------------------------
 * Copyright (c) 2012 Victor Jonsson (http://www.victorjonsson.se)
 * Documentation and issue tracking on Github (https://github.com/victorjonsson/Pie-Chart-Count-Down)
 *
 * @credits Tom Ashworth, CSS-animations (https://github.com/phuu)
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @requires jQuery version >= 1.6
 * @version 0.1.2
 */
(function($){

    $.fn.pieChartCountDown = function() {

        // Default options
        var options = {
            size : 60,
            time : 10,
            backgroundColor : '#FFF',
            color : '#000',
            callback : null,
            unSupportedCallback : null,
            smoothenPieOutline : true,
            infinite : false
        };

        // Create a reference to this jQuery element
        var $spinner = this;

        // Controlling an already started spinner
        if(arguments.length == 1 && typeof arguments[0] == 'string') {
            if( Utils.isInitiated ) {

                // Fallback
                if( !Utils.supportsCSSAnimation ) {
                    SpinnerFallback.executeCommand($spinner, arguments[0]);
                }
                else {
                    switch(arguments[0]) {
                        case 'pause':
                            Utils.pauseSpinner($spinner);
                            break;
                        case 'resume':
                            Utils.resumeSpinner($spinner);
                            break;
                        case 'stop':
                            Utils.removeSpinner($spinner, $spinner.css('background-color'));
                            break;
                        case 'toggle':
                            if( $spinner.attr('data-spinner-paused') !== undefined ) {
                                Utils.resumeSpinner($spinner);
                            }
                            else {
                                Utils.pauseSpinner($spinner);
                            }
                            break;
                        default:
                            throw new Error('Unkown method '+arguments[0]);
                            break;
                    }
                }
            }

            return this;
        }

        // Get the time, custom options and callback
        // from function arguments
        for(var i=0; i < arguments.length; i++) {
            var arg = arguments[i];
            var argType = typeof arg;
            if( argType == 'number' || $.isNumeric(arg) ) {
                options.time = parseInt(arg);
            }
            else if( argType == 'function' ) {
                options.callback = arg;
            }
            else if( arg !== null && arg !== false) {
                $.extend(options, arg);
            }
        }

        // Set size of pie pieces
        options.pieceSize = options.size / 2;

        // Find out whether or not CSS animations is supported
        // and some other stuff we need in order for this
        // plugin to work properly
        if( !Utils.isInitiated ) {
            Utils.init(this.get(0));
        }

        // Unsupported browser!!
        if( !Utils.supportsCSSAnimation ) {
            if(typeof options.unSupportedCallback == 'function') {
                options.unSupportedCallback($spinner);
            }
            else {
                if(typeof options.unSupportedCallback == 'object' && options.unSupportedCallback !== null)
                    SpinnerFallback = options.unSupportedCallback;

                SpinnerFallback.start($spinner, options);
            }
        }
        else {

            // In case we have restarted the spinner while it's
            // ticking down we first of all have to remove it
            Utils.removeSpinner($spinner, options.backgroundColor);

            // Create spinner masks
            var spinnerID = ++Utils.numSpinners,
                $innerMask = Utils.createMask(options.backgroundColor, 'rotate(-45deg)', options.pieceSize, options.time, 0, 'inner'+spinnerID, options.infinite),
                $secondMask = Utils.createMask(options.color, 'rotate(-45deg)', options.pieceSize, options.time, 0, 'mask', options.infinite),
                $thirdMask = Utils.createMask(options.backgroundColor, 'rotate(45deg)', options.pieceSize, options.time, -1, 'mask-two', options.infinite);

            // Create animation key frames that's unique for this spinner
            Utils.generateMaskAnimationKeyframes(options.backgroundColor, spinnerID);

            // Set callback when animation finished, resetting CSS
            // and removing mask elements
            $innerMask.bind(Utils.animationEndEvent, function() {
                Utils.removeSpinner($spinner, options.backgroundColor);
                if(typeof options.callback == 'function')
                    options.callback($spinner);
            });

            // CSS for the pie
            var spinnerWrapperCSS = {
                'display' : 'block',
                'background' : options.color,
                'width' : options.size+'px',
                'height' : options.size+'px',
                'position' : 'relative',
                'visibility' : 'visible'
            };
            spinnerWrapperCSS[Utils.pfx + 'mask-box-image'] = Utils.pfx+'radial-gradient(center,ellipse cover, '+options.color+' 66%, rgba(0,0,0,0) 68%)';
            spinnerWrapperCSS[Utils.pfx + 'mask-attachment'] = 'scroll';
            // spinnerWrapperCSS['background-image'] = Utils.pfx+'radial-gradient(center,ellipse cover, '+options.color+' 66%, rgba(0,0,0,0) 68%)';

            // Add spinner masks
            this
                .html('')
                .append($innerMask)
                .append($secondMask)
                .append($thirdMask)
                .attr('data-spinner-id', spinnerID)
                .addClass('pie-chart-spinner')
                .css(spinnerWrapperCSS)
                .show();

            var pos = this.offset();
            var width = this.outerWidth();

            // Create SVG graphic that will smoothen the outline of the pie chart
            if( options.smoothenPieOutline ) {
                Utils.smoothenCircleOutline(this, options.backgroundColor, spinnerID);
            }

            // If we have several spinners on the same page the
            // smoothing SVG circles has to be moved to the
            // correct position
            $.rePositionSmootheningCircles(spinnerID);
        }

        return this;
    };

    /**
     * This function iterates over all SVG graphic (that smoothens the outline of
     * the pie charts) and makes sure that they're in the correct position
     *
     * @param {Number} ignore - Optional
     */
    $.rePositionSmootheningCircles = function(ignore) {
        $('canvas.pie-circle').each(function() {
            var $canvas = $(this);
            var spinnerID = $canvas.attr('data-spinner');
            if( spinnerID !== undefined && ignore != spinnerID) {
                var $spinner = $('*[data-spinner-id='+spinnerID+']').eq(0);
                if($spinner !== undefined) {
                    var pos = $spinner.offset();
                    if(pos.left != parseInt($canvas.css('left'), 10) || pos.top != parseInt($canvas.css('top'), 10)) {
                        $canvas.css({
                            left : pos.left +'px',
                            top: pos.top +'px'
                        });
                    }
                }
            }
        });
    };

    /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Container for utility functions used by this jQuery plugin
     * @type {Object}
     */
    var Utils =  {

        numSpinners : 0,
        supportsCSSAnimation : false,
        type: null,
        pfx : null,
        CSSTransformRule : null,
        CSSAnimationRule : null,
        animationEndEvent : null,
        isInitiated : false,

        /**
         * This function will be generated by calling Utils.init
         * @param {String} frames
         */
        addAnimationKeyFrames : function(frames) {},

        /**
         * @param {HTMLElement} elm
         */
        init : function(elm) {
            this.isInitiated = true;
            var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
            for( var i = 0; i < domPrefixes.length; i++ ) {
                if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {

                    // Setup properties
                    this.supportsCSSAnimation = true;
                    this.type = domPrefixes[ i ].toLowerCase();
                    this.pfx = '-' +this.type+ '-';
                    this.CSSTransformRule = this.pfx+'transform';
                    this.CSSAnimationRule = this.pfx+'animation';

                    switch(this.type) {
                        case 'o':
                            this.animationEndEvent = 'oAnimationEnd';
                            break;
                        case 'webkit':
                            this.animationEndEvent = 'webkitAnimationEnd';
                            break;
                        default:
                            this.animationEndEvent = 'animationend';
                            break;
                    }

                    // Create function to be used when adding new
                    // animation key frames
                    if( document.styleSheets && document.styleSheets.length ) {
                        this.addAnimationKeyFrames = function(frames) {
                            document.styleSheets[0].insertRule( frames, 0 );
                        };
                    } else {
                        this.addAnimationKeyFrames = function(frames) {
                            var s = document.createElement( 'style' );
                            s.innerHTML = frames;
                            document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );
                        };
                    }

                    break;
                }
            }

            // There are still things left to be done before this plugin
            // works in none-webkit browsers
            if( !$.browser.safari && !$.browser.chrome )
                this.supportsCSSAnimation = false;

            // Add animation key frames used by all spinners
            if( this.supportsCSSAnimation ) {
                var maskKeyframes = '@'+this.pfx+'keyframes mask {'+
                    '0% {'+this.CSSTransformRule+': rotate(-45deg);}' +
                    '75% {'+this.CSSTransformRule+': rotate(-45deg);}' +
                    '100% {'+this.CSSTransformRule+': rotate(45deg);}' +
                    '}';

                var secondMaskKeyframes = '@'+this.pfx+'keyframes mask-two {' +
                    '0% {opacity: 0;}' +
                    '75% {opacity: 0;}' +
                    '76% {opacity: 1;}}';

                this.addAnimationKeyFrames(maskKeyframes);
                this.addAnimationKeyFrames(secondMaskKeyframes);

                // The position of the spinners might change if the
                // window is resized and therefor we need to correct
                // the position of the svg graphics.
                $(window).resize(function() {
                    $.rePositionSmootheningCircles();
                });
            }
        },


        /**
         * @param {String}color
         * @param {String} transform
         * @param {Number} size
         * @param {Number} countdownTime
         * @param {Number} leftPos
         * @param {String} animationName
         * @param {Boolean} infinite
         * @return {jQuery}
         */
        createMask : function(color, transform, size, countdownTime, leftPos, animationName, infinite) {

            var CSS = {
                'display' : 'block',
                'position' : 'absolute',
                'top' : '1px',
                'left' : leftPos + 'px',
                'background' : 'transparent',
                'border-width' : size+'px',
                'width' : '0',
                'height' : '0',
                'border-style' : 'solid',
                'border-top-color' : color,
                'border-right-color' : 'transparent',
                'border-left-color' : 'transparent',
                'border-bottom-color' : 'transparent'
            };

            CSS[this.CSSTransformRule] = transform;
            CSS[this.CSSAnimationRule] = animationName+' '+countdownTime+'s linear '+(infinite ? 'infinite':'');

            return $('<div></div>')
                .addClass('spinner-'+animationName)
                .css(CSS);
        },

        /**
         * @param {String} backgroundColor
         * @param {Number} spinnerID
         */
        generateMaskAnimationKeyframes : function(backgroundColor, spinnerID) {

            var innerKeyframes = '@'+this.pfx+'keyframes inner'+spinnerID+' {' +
                '0% {'+this.CSSTransformRule+':rotate(-45deg);}' +
                '25% {border-left-color:transparent;}' +
                '26% {border-left-color:'+backgroundColor+';}' +
                '50% {border-bottom-color:transparent;}' +
                '51% {border-bottom-color:'+backgroundColor+';}' +
                '75% {border-right-color:transparent;}' +
                '76% {border-right-color:'+backgroundColor+';}' +
                '100% {'+this.CSSTransformRule+':rotate(315deg); border-left-color:'+backgroundColor+'; border-bottom-color:'+backgroundColor+'; border-right-color:'+backgroundColor+'; }}';

            this.addAnimationKeyFrames(innerKeyframes);
        },

        /**
         * @param {String} bgColor
         * @return {Object}
         */
        getResettingCSS : function(bgColor) {
            var CSSReset = {
                backgroundColor : bgColor,
                height : 'auto',
                width : 'auto'
            };
            CSSReset[Utils.pfx + 'mask-box-image'] = 'none';
            CSSReset['background-image'] = 'none';

            return CSSReset;
        },

        /**
         * Will create a transparent circle (svg) with the same diameter
         * as the width of given element. The purpose of this function is
         * to smoothen the outline of circles created with CSS3
         * @param {jQuery} $element
         */
        smoothenCircleOutline : function($element, color, id) {
            var size = $element.outerWidth();
            var $canvas = $('<canvas width="'+size+'" height="'+size+'"></canvas>');
            $canvas
                .attr('id', 'circle-'+id)
                .addClass('pie-circle')
                .attr('data-spinner', id)
                .appendTo('body');

            var strokeSize = 5 * Math.round(Math.ceil(size / 100));
            var context = $canvas.get(0).getContext("2d");

            if( context ) {
                var centerX = size / 2;
                var centerY = size / 2;
                var radius = (size / 2) - (strokeSize / 2);

                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                context.fillStyle = "transparent";
                context.fill();
                context.lineWidth = strokeSize;
                context.strokeStyle = color;
                context.stroke();

                var pos = $element.offset();
                $canvas.css({
                    position: 'absolute',
                    top: pos.top+'px',
                    left: pos.left+'px',
                    zIndex : 9999
                });
            }
        },

        /**
         * @param {String} id
         */
        removeSmootheningCircle : function(id) {
            $('#circle-'+id).remove();
        },

        /**
         * @param {jQuery} $element
         */
        removeSpinner : function($element, bgColor)     {
            var spinnerID = $element.attr('data-spinner-id');
            if( spinnerID !== undefined ) {
                Utils.removeSmootheningCircle(spinnerID);
                $element.children().remove();
                $element.css(Utils.getResettingCSS(bgColor));
                $element.removeAttr('data-spinner-id');
                $element.removeAttr('data-spinner-paused');
                setTimeout(function() {
                    $.rePositionSmootheningCircles();
                }, 1); // needed....
            }
        },

        /**
         * @param {jQuery} $element
         */
        pauseSpinner : function($element) {
            var spinnerID = $element.attr('data-spinner-id');
            if( spinnerID !== undefined ) {
                $element.attr('data-spinner-paused', 1);
                var pauseCSS = {
                    '-ms-animation-play-state' : 'paused',
                    '-o-animation-play-state' : 'paused',
                    '-moz-animation-play-state' : 'paused',
                    '-webkit-animation-play-state' : 'paused',
                    'animation-play-state' : ' paused'
                };

                $element.find('.spinner-inner'+spinnerID).css(pauseCSS);
                $element.find('.spinner-mask').css(pauseCSS);
                $element.find('.spinner-mask-two').css(pauseCSS);
            }
        },

        /**
         * @param {jQuery} $element
         */
        resumeSpinner : function($element) {
            var spinnerID = $element.attr('data-spinner-id');
            if( spinnerID !== undefined ) {
                $element.removeAttr('data-spinner-paused');

                var resumeCSS = {
                    '-ms-animation-play-state' : 'running',
                    '-o-animation-play-state' : 'running',
                    '-moz-animation-play-state' : 'running',
                    '-webkit-animation-play-state' : 'running',
                    'animation-play-state' : ' running'
                };

                $element.find('.spinner-inner'+spinnerID).css(resumeCSS);
                $element.find('.spinner-mask').css(resumeCSS);
                $element.find('.spinner-mask-two').css(resumeCSS);
            }
        }
    };


    /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Fall back used when CSS animations isn't supported
     * @type {Object}
     */
    var SpinnerFallback = {

        id : 0,

        intervals : {},

        options : {},

        start : function($spinner, options) {

            this.remove($spinner);

            var intervalID = 'spinner' + (++this.id);

            $spinner
                .text(options.time)
                .attr('data-interval-id', intervalID)
                .css({
                    fontSize : (0.8 * options.size) + 'px',
                    background: options.backgroundColor,
                    color : options.color,
                    width : options.size,
                    height : options.size,
                    lineHeight: 'normal',
                    textAlign : 'center'
                });

            this.options[intervalID] = options;

            var self = this;

            this.intervals[intervalID] = setInterval(function() {
                var paused = $spinner.attr('data-spinner-paused');
                if( paused === undefined ) {
                    var count = parseInt($spinner.text()) - 1;
                    if(count > 0) {
                        $spinner.text(count);
                    }
                    else {
                        self.remove($spinner);
                    }
                }
            }, 1000);
        },

        executeCommand : function($spinner, cmd) {
            switch(cmd) {
                case 'pause':
                    this.pause($spinner);
                    break;
                case 'resume':
                    this.resume($spinner);
                    break;
                case 'stop':
                    this.remove($spinner);
                    break;
                case 'toggle':
                    if( $spinner.attr('data-spinner-paused') !== undefined ) {
                        this.resume($spinner);
                    }
                    else {
                        this.pause($spinner);
                    }
                    break;
                default:
                    throw new Error('Unknown method '+arguments[0]);
                    break;
            }
        },

        remove : function($spinner) {
            var intervalID = $spinner.attr('data-interval-id');
            if( intervalID !== undefined ) {

                var options = this.options[intervalID];

                clearInterval(SpinnerFallback.intervals[intervalID]);

                $spinner.text('');

                if(options) {
                    $spinner.css(Utils.getResettingCSS(options.backgroundColor));
                    if(typeof options.callback == 'function')
                        options.callback($spinner);
                }

                delete SpinnerFallback.intervals[intervalID];
                delete SpinnerFallback.options[intervalID];
            }
        },

        pause : function($spinner) {
            var intervalID = $spinner.attr('data-interval-id');
            if( intervalID !== undefined ) {
                $spinner.attr('data-spinner-paused', 1);
            }
        },

        resume : function($spinner) {
            $spinner.removeAttr('data-spinner-paused');
        }
    };

})(jQuery);