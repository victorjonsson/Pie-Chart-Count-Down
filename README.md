# Pie Chart Count Down #

jQuery plugin that makes it possible to create pie charts displaying time ticking down (using CSS animations). This
plugin is based on the CSS animations written by [Tom Genoni](http://atomeye.com/projects/sass-css-spinner.html) and
the CSS animation plugin by [Joe Lambert](http://www.joelambert.co.uk/cssa). This plugin is tested successfully in the
latest versions of Safari, Chrome and Mozilla (fallback available in the other browsers).

[Live example can be viewed here](http://victorjonsson.se/pie-chart-count-down/?from=github).

## How to use it ##

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="js/jquery.piechartcountdown.min.js"></script>
    <script>
      function startCounter() {
        $('#counter').pieChartCountDown({
            time : 10,
            color : '#FF0000',
            background: '#111111',
            size : 80,
            border: 8,
            infinite : false,
            callback : function($counter) {
                alert('Count down finished');
            }
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

*action* (String) - An action of some sort that controls an ongoing count down (destroy is the only supported action at the moment)

## Options ##

* **size (Number)** — The diameter of the pie chart (pixels).
* **time (Number)** — The number of seconds to count down from (one spin).
* **background (String)** — Background color behind the pie chart.
* **color (String)** — The color of the pie chart.
* **callback (Function)** — The function that will be called when time is up.
* **border (Number)** — The size of the border around the pie chart (default is 0)
* **infinite (Boolean)** — Set this option to true if you want the pie chart spinner to go on forever until
you stop it your self by calling *$('element').pieChartCountDown('destroy')*
* **unSupportedCallback (Function | Object)** — Function that will be called if CSS animations isn't supported by the browser. In
case you don't define this callback function the plugin will fall back on an ordinary counter displaying
the number of seconds left until the time is up. You can also override the fall back by defining an object implementing the
same functions as the fall back object.

## Road map ##

- Add actions "pause" and "resume"
- Make it optional to display a number representing the time left, positioned above the pie chart