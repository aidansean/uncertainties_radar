<?php

header("Content-type: image/svg+xml") ;

$string = array() ;

$canvas_width  = 500 ;
$canvas_height = 500 ;
$total_error = 0 ;

$number_of_errors = 7 ;
$errors[0] = 0.058 ;                          $error_names[0] = 'Statistical' ;    // Statistical
$errors[1] = 0.0023 ;                         $error_names[1] = 'Tracking' ;       // Tracking
$errors[2] = 0.0083 ;                         $error_names[2] = 'PID' ;            // PID
$errors[3] = 0.0178488 ;                      $error_names[3] = 'Numerator cuts' ; // Vertexing
$errors[4] = 0.0100868*0.215873*$errors[0] ;  $error_names[4] = 'Pull' ;           // Pull
$errors[5] = 0.0004 ;                         $error_names[5] = 'Theory' ;         // Theory
$errors[6] = 0.057 ;                          $error_names[6] = 'Denominator' ;    // Pull
echo '<!-- ' ; print_r($errors) ; echo ' -->' . PHP_EOL ;
array_multisort($errors, $error_names) ;

$string[] = '<svg width="' . $canvas_width . '" height="' . $canvas_height . '" ' 
. 'version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' . PHP_EOL ;

$c_x = $canvas_width/6 ;
$c_y = $canvas_height*7/8 ;
$r = 0.5*$c_y ; // min(0.8*$c_x, 0.8*$c_y) ;
$outer_radius = 0.075 ;
$outer_radius = 0.0875 ;

$number_of_rings = 6 ;
$number_of_rings = 7 ;
$text_offset = 10 ;
for($i=$number_of_rings ; $i>0 ; $i--){
	$string[] = '<circle ' 
		. 'cx="' . write_out($c_x) . '" ' 
		. 'cy="' . write_out($c_y) . '" ' 
		. 'r="' . write_out($i*$r/$number_of_rings) . '" ' 
		. '' . style(0) 
		. '/>' . PHP_EOL ;
	$string[] = '<text x="' . write_out($c_x-$text_offset) . '" ' 
		. 'y="' . write_out($c_y-$i*$r/$number_of_rings-$text_offset) . '" ' 
		. 'text-anchor="middle" font-size="12">' . write_out(100*$outer_radius*$i/$number_of_rings) . '%'
		. '</text>' . PHP_EOL ;
}

$offset = 0 ;
$cumulative_error = $errors[count($errors)-1] ;

$right_angle_size = 10 ;
$line_length = 50 ;
for($i=$number_of_errors-1 ; $i>0 ; $i--){
	$x_a = $r*$cumulative_error/$outer_radius ;
	$y_a = 0 ;
	
	$x_b = $x_a ;
	$y_b = $r*$errors[$i-1]/$outer_radius ;
	
	$x_aa = $c_x + cos(-$offset)*$x_a + sin(-$offset)*$y_a ;
	$y_aa = $c_y + sin(-$offset)*$x_a - cos(-$offset)*$y_a ;
	$x_bb = $c_x + cos(-$offset)*$x_b + sin(-$offset)*$y_b ;
	$y_bb = $c_y + sin(-$offset)*$x_b - cos(-$offset)*$y_b ;
	
	$string[] = '<polygon points="' 
	. write_out($c_x) . ',' . write_out($c_y) 
	. ' ' . write_out($x_aa) . ',' . write_out($y_aa) 
	. ' ' . write_out($x_bb) . ',' . write_out($y_bb) 
	. ' " ' . style($i) . ' />' . PHP_EOL ;
	
	$x_ff = $x_aa + 0.5*($x_bb-$x_aa) ;
	$y_ff = $y_aa + 0.5*($y_bb-$y_aa) ;
	$r_ff = sqrt(($x_ff-$c_x)*($x_ff-$c_x)+($y_ff-$c_y)*($y_ff-$c_y)) ;
	$x_gg = $x_ff + $line_length*($x_ff-$c_x)/$r ;
	$y_gg = $y_ff + $line_length*($y_ff-$c_y)/$r ;
	
	$string[] = '<line ' 
		. 'x1="' . write_out($x_ff) . '" ' 
		. 'y1="' . write_out($y_ff) . '" ' 
		. 'x2="' . write_out($x_gg) . '" ' 
		. 'y2="' . write_out($y_gg) . '" ' 
		. ' stroke-width="1" stroke="rgb(0,0,0)"/>' ;
	
	$string[] = '<text ' 
		. 'x="' . write_out($x_gg+10) . '" ' 
		. 'y="' . write_out($y_gg+5) . '" ' 
		. 'text-anchor="start" font-size="12" ' 
		. 'transform="rotate(' . write_out(atan2($y_gg-$c_y,$x_gg-$c_x)*180/pi()) . ',' . $x_gg . ',' . $y_gg . ')" '
		. '>' . $error_names[$i-1] . ' (' . write_out(100*$errors[$i-1]) . '%)'  
		. '</text>' . PHP_EOL ;
	
	if($y_b>2*$right_angle_size){
		$x_c = $x_a - $right_angle_size ;
		$y_c = 0 ;
		
		$x_d = $x_c ;
		$y_d = $right_angle_size ;
		
		$x_e = $x_a ;
		$y_e = $y_d ;
		
		$x_cc = $c_x + cos(-$offset)*$x_c + sin(-$offset)*$y_c ;
		$y_cc = $c_y + sin(-$offset)*$x_c - cos(-$offset)*$y_c ;
		$x_dd = $c_x + cos(-$offset)*$x_d + sin(-$offset)*$y_d ;
		$y_dd = $c_y + sin(-$offset)*$x_d - cos(-$offset)*$y_d ;
		$x_ee = $c_x + cos(-$offset)*$x_e + sin(-$offset)*$y_e ;
		$y_ee = $c_y + sin(-$offset)*$x_e - cos(-$offset)*$y_e ;
		
		$string[] = '<line ' 
		. 'x1="' . write_out($x_cc) . '" ' 
		. 'y1="' . write_out($y_cc) . '" ' 
		. 'x2="' . write_out($x_dd) . '" ' 
		. 'y2="' . write_out($y_dd) . '" ' 
		. style($i) . '/>' . PHP_EOL ;
		$string[] = '<line ' 
		. 'x1="' . write_out($x_dd) . '" ' 
		. 'y1="' . write_out($y_dd) . '" ' 
		. 'x2="' . write_out($x_ee) . '" ' 
		. 'y2="' . write_out($y_ee) . '" ' 
		. style($i) . '/>' . PHP_EOL ;
	}
	$offset += atan2($errors[$i-1], $cumulative_error) ;
	$cumulative_error = sqrt($cumulative_error*$cumulative_error + $errors[$i-1]*$errors[$i-1]) ;
}

$x_a = $c_x + $r*0.5*$errors[count($errors)-1]/$outer_radius ;
$y_a = $c_y + 0 ;
	
$x_b = $x_a + 100*cos(pi()/6) ;
$y_b = $y_a + 100*sin(pi()/6) ;

$string[] = '<line ' 
		. 'x1="' . write_out($x_a) . '" ' 
		. 'y1="' . write_out($y_a) . '" ' 
		. 'x2="' . write_out($x_b) . '" ' 
		. 'y2="' . write_out($y_b) . '" ' 
		. ' stroke-width="1" stroke="rgb(0,0,0)"/>' ;
	
$string[] = '<text ' 
	. 'x="' . write_out($x_b+10) . '" ' 
	. 'y="' . write_out($y_b+5) . '" ' 
	. 'text-anchor="start" font-size="12" ' 
	//. 'transform="rotate(' . write_out(atan2($y_gg-$c_y,$x_gg-$c_x)*180/pi()) . ',' . $x_gg . ',' . $y_gg . ')" '
	. '>' . $error_names[count($errors)-1] . ' (' . write_out(100*$errors[count($errors)-1]) . '%)'  
	. '</text>' . PHP_EOL ;


$string[] = '<text ' 
	. 'x="' . write_out($canvas_width*0.5) . '" ' 
	. 'y="' . write_out(50) . '" ' 
	. 'text-anchor="middle" font-size="24" ' 
	. '>Total error: ' . write_out(100*$cumulative_error) . '%'  
	. '</text>' . PHP_EOL ;

$string[] = '<!-- ' . $cumulative_error . ' -->' ;
$string[] = '</svg>' ;
echo implode('', $string) ;

function write_out($float){ return sprintf('%.2f', $float) ;}

function style($i){
	if($i==0) return 'stroke="rgb(0,0,0)" fill="rgb(100,100,100)" fill-opacity="0.1"' ;
	$i=$i%12 ;
	switch($i){
		case  1: $color = 'rgb(99 ,0  ,0  )' ; break ;
		case  2: $color = 'rgb(0  ,99 ,0  )' ; break ;
		case  3: $color = 'rgb(0  ,0  ,99 )' ; break ;
		case  4: $color = 'rgb(99 ,0  ,99 )' ; break ;
		case  5: $color = 'rgb(99 ,99 ,0  )' ; break ;
		case  6: $color = 'rgb(0  ,99 ,99 )' ; break ;
		case  7: $color = 'rgb(150,0  ,0  )' ; break ;
		case  8: $color = 'rgb(0  ,150,0  )' ; break ;
		case  9: $color = 'rgb(0  ,0  ,150)' ; break ;
		case 10: $color = 'rgb(150,0  ,150)' ; break ;
		case 11: $color = 'rgb(150,150,0  )' ; break ;
		case  0: $color = 'rgb(0  ,150,150)' ; break ;
	}
	return 'stroke="' . $color . '" fill="' . $color . '" fill-opacity="0.5"' ;
}

?>