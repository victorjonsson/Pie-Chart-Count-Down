# Pie Chart Count Down #

jQuery plugin that makes it possible to create pie charts displaying time ticking down (using CSS animations). 
At the moment this plugin only support webkit browsers (Google Chrome, Safari) and there's also som flickering
of the graphics going on, but I will try to fix these issues as soon as possible

[Live example can be viewed here](http://victorjonsson.se/pie-chart-count-down)

## Usage example ##

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

## Actions ##

You can call actions on a timer thats counting down. The actions you can choose from is pause, resume
stop and toggle. Example:

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