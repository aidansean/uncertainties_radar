from project_module import project_object, image_object, link_object, challenge_object

p = project_object('uncertainties_radar', 'Uncertainties radar')
p.domain = 'http://www.aidansean.com/'
p.folder_name = 'aidansean'
p.path = 'uncertainties_radar'
p.preview_image    = image_object('%s/images/project.jpg'   %p.path, 150, 250)
p.preview_image_bw = image_object('%s/images/project_bw.jpg'%p.path, 150, 250)
p.github_repo_name = 'uncertainties_radar'
p.mathjax = True
p.tags = 'Physics,Tools'
p.technologies = 'canvas,HTML,JavaScript'
p.links.append(link_object(p.domain, 'uncertainties_radar', 'Live page'))
p.introduction = 'When dealing with systematic uncertainties in physics it\'s often important to know the relative contributions of each unceratinty to the overall uncertainty.  This script compares all the uncertiaties, assuming they are \(0\%\) correlated.'
p.overview = '''The script arranges the uncertainties by size, then adds the uncertainties in quadrature and then expresses them as a radial distance from the lower left corner, showing the effect of each uncertainty.  This makes it easy to determine where to focus effort in an analysis, and which areas of analysis will not give much benefit in terms of systematic uncertainty reduction.'''

p.challenges.append(challenge_object('The output needs to be clear and easy to read.', 'The code needed to create the relevant geometry is fairly trivial to write.  The only difficult part was adding the labels in such a way that they are all unambiguous and legible.  At the moment the script works, but for a much larger list of systematic unceratinties, the labels may fall outside the plot area.', 'To be revisited'))

