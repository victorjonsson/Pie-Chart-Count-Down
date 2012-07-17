# Pie Chart Count Down #

jQuery plugin that makes it possible to create pie charts displaying time ticking down (**using CSS animations**).
At the moment this plugin **only supports webkit browsers** (Google Chrome, Safari) and there's also some flickering
of the graphics going on, but I will try to fix these issues as soon as possible.

CSS3 circles is known to get quite ragged edges but this plugin uses SVG to fix that problem. [Live example can
be viewed here](http://victorjonsson.se/pie-chart-count-down).

## How to use it ##

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="js/jquery.piechartcountdown.min.js"></script>
    <script>
      function startCounter() {
        $('#counter').pieChartCountDown(20, function() {
          alert('Count down finished');
        });
      }
    </script>
  </head>
  <body>
    <div id="counter"></div>
    <a href="#" onclick="startCounter(); return false;">Count down</a>
  </body>
</html>
```

`.pieChartCountDown(time, callback)`

`.pieChartCountDown(time, options, callback)`

`.pieChartCountDown(time, options)`

`.pieChartCountDown(options)`

`.pieChartCountDown(action)`

*time* (Number) - The number of seconds to count down from.

*options* (Object) - The plugin has numerous different options that you can modify (more info below).

*callback* (Function) - The function that will be called when the count down has finished.

*action* (String) - An action of some sort that controls an ongoing count down.

## Options ##

* **size (Number)** — The diameter of the pie chart (pixels).
* **time (Number)** — The number of seconds to count down from.
* **backgroundColor (String)** — Background color behind the pie chart.
* **color (String)** — The color of the pie chart.
* **callback (Function)** — The function that will be called when time is up.
* **unSupportedCallback (Function | Object)** — Function that will be called if CSS animations isn't supported by the browser. In
case you don't define this callback function the plugin will fall back on an ordinary counter displaying
the number of seconds left until the time is up. You can also override the fall back by defining an object implementing the
same functions as the fall back object.
* **smoothenPieOutline (Boolean)** — Lets the plugin add a transparent SVG circle above the pie chart that 
will smoothen the edges of pie chart (default is true).
* **infinite (Boolean)** — Set this option to true if you want the pie chart spinner to go on forever until
you stop it your self by calling an *action* on the element.

## Actions ##

You can call actions on a timer thats counting down. The available actions is pause, resume
stop and toggle. Example:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="js/jquery.piechartcountdown.min.js"></script>
    <script>
      function startCounter($button) {

        $button.text('Pause');
        $button.get(0).onclick = function() {
            var $counter = $('#counter');
            $counter.pieChartCountDown('toggle');
            var buttonLabel = $counter.attr('data-spinner-paused') === undefined ? 'Pause':'Resume';
        };

        $('#counter').pieChartCountDown(20, function() {
          $button.text('Count Down');
          $button.get(0).onclick = function() {
            startCounter( $(this) );
          };
        });

      }
    </script>
  </head>
  <body>
    <div id="counter"></div>
    <a href="#" onclick="startCounter($(this)); return false;" id="count-button">Count down</a>
  </body>
</html>
```

## Credits ##

Big thanks to [Tom Ashworth](https://github.com/phuu) that has written the [CSS animations](http://phuu.net/2012/05/01/html-css-only-spinner.html)
used by this plugin.