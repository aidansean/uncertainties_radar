var canvas  = null ;
var context = null ;

// Sizes
var cw = 750 ;
var ch = 650 ;
var r_large = 500 ;

var lw_start     = 3 ;
var lw_increment = 2 ;

var triangle_opacity = 0.2  ;
var annulus_opacity  = 0.05 ;

// Position of centre of rings
var cx =      100 ;
var cy = ch - 100 ;

var pi = Math.PI ;
var nRings = 5 ;
var ring_increment = 0 ;

var total_uncertainty = 0 ;
var uncertainties = [] ;
uncertainties.push( new uncertainties_object('statistical'      , 0.07, 'stat', [255,  0,  0]) ) ;
uncertainties.push( new uncertainties_object('jet energy scale' , 0.08, 'syst', [0  ,200,  0]) ) ;
uncertainties.push( new uncertainties_object('electron ID'      , 0.03, 'syst', [0  ,0  ,255]) ) ;
uncertainties.push( new uncertainties_object('electron scale'   , 0.01, 'syst', [255,0  ,255]) ) ;
uncertainties.push( new uncertainties_object('background shape' , 0.02, 'syst', [  0,255,255]) ) ;

order_uncertainties(['stat','syst']) ;
var total_angle = 0 ;
for(var i=0 ; i<uncertainties.length ; i++){
  total_uncertainty = sqrt(pow(total_uncertainty,2)+pow(uncertainties[i].value,2)) ;
  if(i>0) total_angle += atan2(uncertainties[i].value,total_uncertainty) ;
}
if(total_angle>0.5*pi) cx = 300 ;

function order_uncertainties(types){
  if(types==undefined){
    uncertainties.sort( function(a,b){ return (a.value < b.value) } ) ;
    return ;
  }
  else{
    var uncs_out = [] ;
    for(var i=0 ; i<types.length ; i++){
      var uncs_tmp = [] ;
      for(var j=uncertainties.length-1 ; j>=0 ; j--){
        if(uncertainties[j].type==types[i]){
          var u = uncertainties.splice(j,1)[0] ;
          uncs_tmp.push(u) ;
        }
      }
      uncs_tmp.sort( function(a,b){ return (a.value < b.value) } ) ;
      for(var j=0 ; j<uncs_tmp.length ; j++){
        uncs_out.push(uncs_tmp[j]) ;
      }
    }
    uncertainties = uncs_out ;
    return ;
  }
  return ;
}

function get_ring_increment(){
  // Rework this later
  // Taken from bom_plotter for now
  var range    = total_uncertainty ;
  var logRange = floor(log(range)/log(10)) ;
  var tick     = pow(10,logRange) ;
  var nTicks   = floor(range/tick) ;
  while(nTicks>10){
    tick *= 5 ;
    nTicks = floor(range/tick) ;
  }
  while(nTicks<5){
    tick /= 5 ;
    nTicks = floor(range/tick) ;
  }
  nTicks += 1 ;
  nRings = nTicks ;
  return tick ;
}
function get_distance_from_unc(unc){ return r_large*unc/((nRings+1)*ring_increment) ; }

function plot_uncertainties(){
  context.lineCap   = 'round' ;
  for(var lw=lw_start ; lw>0 ; lw-=lw_increment){
    context.lineWidth = lw ;
    var opacity = 1.0-0.2*lw ;
    var tot   = 0 ;
    var angle = 0 ;
    for(var i=1 ; i<uncertainties.length ; i++){
      var u  = uncertainties[i] ;
      var u0 = uncertainties[0] ;
      var color = 'rgba(' + u.rgb[0] + ',' + u.rgb[1] + ',' + u.rgb[2] + ',' + opacity + ')' ;
      context.strokeStyle = color ;
      var unc0 = u0.value ;
      var unc  = u .value ;
      // Make a triangle and rotate it
      var uw = (i==1) ? unc0 : tot ;
      var uh = unc ;
      var tw = get_distance_from_unc(uw) ;
      var th = get_distance_from_unc(uh) ;
      tot = sqrt(uw*uw+uh*uh) ;
      if(i==1){
        uncertainties[0].lx = cx + get_distance_from_unc(0.5*unc0) ;
        uncertainties[0].ly = cy ;
        uncertainties[0].angle = 0 ;
      }
    
      var points = [] ;
      points.push([0 ,0 ]) ;
      points.push([tw,0 ]) ;
      points.push([tw,th]) ;
      for(var j=0 ; j<points.length ; j++){
        var x_out = cx + (points[j][0]*cos(angle) - points[j][1]*sin(angle)) ;
        var y_out = cy - (points[j][1]*cos(angle) + points[j][0]*sin(angle)) ;
        points[j] = [x_out,y_out] ;
      }
      
      if(i==1){
        context.beginPath() ;
        context.strokeStyle = 'rgba(' + u0.rgb[0] + ',' + u0.rgb[1] + ',' + u0.rgb[2] + ',' + opacity + ')' ;
        context.moveTo(points[0][0],points[0][1]) ;
        context.lineTo(points[1][0],points[1][1]) ;
        context.stroke() ;
        
        context.beginPath() ;
        context.strokeStyle = 'rgba(' + u.rgb[0] + ',' + u.rgb[1] + ',' + u.rgb[2] + ',' + opacity + ')' ;
        context.moveTo(points[1][0],points[1][1]) ;
        context.lineTo(points[2][0],points[2][1]) ;
        context.stroke() ;
      }
      else{
        context.beginPath() ;
        for(var j=0 ; j<points.length ; j++){
          if(j==0){ context.moveTo(points[j][0],points[j][1]) ; }
          else    { context.lineTo(points[j][0],points[j][1]) ; }
        }
        if(i==uncertainties.length-1) context.lineTo(points[0][0],points[0][1]) ;
        context.stroke() ;
      }
      if(lw==lw_start-lw_increment){
        context.beginPath() ;
        for(var j=0 ; j<points.length ; j++){
          if(j==0){ context.moveTo(points[j][0],points[j][1]) ; }
          else    { context.lineTo(points[j][0],points[j][1]) ; }
        }
        if(i==uncertainties.length-1) context.lineTo(points[0][0],points[0][1]) ;
        context.fillStyle = 'rgba(' + u.rgb[0] + ',' + u.rgb[1] + ',' + u.rgb[2] + ',' + triangle_opacity + ')' ;
        context.fill() ;
      }
      var theta = atan2(th,tw) ;
      uncertainties[i].angle = angle ;
      uncertainties[i].theta = theta ;
      uncertainties[i].lx = 0.5*(points[1][0]+points[2][0]) ;
      uncertainties[i].ly = 0.5*(points[1][1]+points[2][1]) ;
      angle += theta ;
    }
  }
}
function plot_uncertainty_labels(){
  var min_dy = 50 ;
  var current_y = 0 ;
  
  var u0 = uncertainties[0] ;
  var color = 'rgb(' + u0.rgb[0] + ',' + u0.rgb[1] + ',' + u0.rgb[2] + ')' ;
  var lx1 = u0.lx ;
  var ly1 = u0.ly ;
  var lx2 = 550 ;
  var ly2 = cy + min_dy ;
  context.beginPath() ;
  context.strokeStyle = color ;
  context.moveTo(lx1,ly1) ;
  context.lineTo(lx1,ly2) ;
  context.lineTo(lx2,ly2) ;
  context.stroke() ;
  context.fillStyle = 'rgb(0,0,0)' ;
  context.fillText(u0.name + ' (' + (100*u0.value).toFixed(1) + '%)', lx2+10, ly2+5) ;
  
  for(var i=1 ; i<uncertainties.length ; i++){
    var u = uncertainties[i] ;
    var lx1 = u.lx ;
    var ly1 = u.ly ;
    var a  = u.angle ;
    
    var has_kink = true ;
    if(i==1){
      current_y = ly1 ;
    }
    else{
      current_y = current_y - min_dy ;
      if(ly1<current_y){
        current_y = ly1 ;
        has_kink = false ;
      }
    }
    var lx2 = 550 ;
    var ly2 = ly1 - 100*sin(a) ;
    ly2 = current_y ;
    
    var color = 'rgb(' + u.rgb[0] + ',' + u.rgb[1] + ',' + u.rgb[2] + ')' ;
    context.beginPath() ;
    context.strokeStyle = color ;
    if(has_kink){
      var delta_y = ly2 - ly1 ;
      var delta_x = -delta_y/tan(u.angle+0.5*u.theta) ;
      context.moveTo(lx1,ly1) ;
      context.lineTo(lx1+delta_x,ly1+delta_y) ;
      context.lineTo(lx2,ly2) ;
    }
    else{
      context.moveTo(lx1,ly1) ;
      context.lineTo(lx2,ly2) ;
    }
    context.stroke() ;
    context.fillStyle = 'rgb(0,0,0)' ;
    context.fillText(u.name + ' (' + (100*u.value).toFixed(1) + '%)', lx2+10, current_y+5) ;
  }
}

function plot_rings(){
  context.strokeStyle = 'rgb(100,100,100)' ;
  context.fillStyle   = 'rgba(0,0,0,' + annulus_opacity + ')' ;
  for(var i=nRings ; i>0 ; i--){
    var r = i*r_large/(nRings+1) ;
    context.beginPath() ;
    context.arc(cx, cy, r, 0, 2*pi, true) ;
    context.stroke() ;
    context.fillOpacity = 0.05 ;
    context.fill() ;
  }
}
function plot_ring_labels(){
  context.fillStyle   = 'rgb(0,0,0)' ;
  for(var i=nRings ; i>0 ; i--){
    var r = i*r_large/(nRings+1) ;
    var x = cx - 30 ;
    var y = cy - r - 5 ;
    context.fillStyle   = 'rgb(0,0,0)' ;
    context.fillOpacity = 1.0 ;
    context.fillText((100*(i*ring_increment)).toFixed(1)+'%', x, y) ;
  }
}

function start(){
  canvas = Get('canvas_uncertainties') ;
  context = canvas.getContext('2d') ;
  context.translate(0.5, 0.5) ;
  context.font = '15px arial' ;
  context.fillStyle = 'rgb(255,255,255)' ;
  context.fillRect(0,0,cw,ch) ;
  
  ring_increment = get_ring_increment() ;
  plot_rings() ;
  plot_uncertainties() ;
  plot_ring_labels() ;
  plot_uncertainty_labels() ;
  
  context.beginPath() ;
  context.arc(cx, cy, 2, 0, 2*pi, true) ;
  context.fill() ;
  
  context.textAlign = 'center' ;
  context.font = '25px arial' ;
  context.fillText('Total uncertainty = ' + (100*total_uncertainty).toFixed(2) + '%', 0.5*cw, 50) ;
}

function uncertainties_object(name, value, type, rgb){
  this.name  = name  ;
  this.type  = type  ;
  this.value = value ;
  this.rgb   = rgb   ;
}

// Helper functions
function Get(id){ return document.getElementById(id) ; }
function cos(x)    { return Math.cos(x)     ; }
function sin(x)    { return Math.sin(x)     ; }
function tan(x)    { return Math.tan(x)     ; }
function log(x)    { return Math.log(x)     ; }
function atan2(y,x){ return Math.atan2(y,x) ; }
function pow(a,b)  { return Math.pow(a,b)   ; }
function sqrt(x)   { return Math.sqrt(x)    ; }
function floor(x)  { return Math.floor(x)   ; }
function min(x)    { return Math.min(x)     ; }
function max(x)    { return Math.max(x)     ; }