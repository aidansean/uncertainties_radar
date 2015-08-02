<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/uncertainties_radar" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=uncertainties_radar" ;
$project = new project_object("uncertainties_radar", "Uncertainties radar", "https://github.com/aidansean/uncertainties_radar", "http://aidansean.com/projects/?tag=uncertainties_radar", "uncertainties_radar/images/project.jpg", "uncertainties_radar/images/project_bw.jpg", "When dealing with systematic uncertainties in physics it's often important to know the relative contributions of each unceratinty to the overall uncertainty.  This script compares all the uncertiaties, assuming they are \(0\%\) correlated.", "Physics,Tools", "canvas,HTML,JavaScript") ;
?>