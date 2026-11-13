"""One-off vector master generation from the installed OFL Barlow Condensed font."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
font=TTFont('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff')
glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); paths=[]; x=0
for letter in 'CADRIN':
    name=cmap[ord(letter)]; pen=SVGPathPen(glyphs);glyphs[name].draw(pen)
    paths.append(f'<path transform="translate({x} 0)" d="{pen.getCommands()}"/>')
    x+=font['hmtx'].metrics[name][0]+55
width=x-55; height=font['OS/2'].sCapHeight
Path('public/brand').mkdir(exist_ok=True)
for name,color in [('light','#f5f0e6'),('dark','#4a1725')]:
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height+120}" role="img" aria-label="CADRIN"><g fill="{color}" transform="translate(0 {height}) scale(1 -1)">{"".join(paths)}</g><path d="M{width-450} {height+105}h450" stroke="{color}" stroke-width="24"/></svg>'
    Path(f'public/brand/cadrin-{name}.svg').write_text(svg)
