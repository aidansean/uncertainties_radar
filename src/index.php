<?php
$title = 'Uncertainties radar' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('functions.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
<div class="right">
  <canvas id="canvas_uncertainties" width="750" height="650"></canvas>
</div>
<?php foot() ; ?>
