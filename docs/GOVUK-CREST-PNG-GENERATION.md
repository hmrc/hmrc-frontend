### How-to regenerate 1x and 2x versions from SVG if it has been updated

If [govuk-frontend](https://github.com/alphagov/govuk-frontend/) provides an updated svg file for [govuk-crest](https://github.com/alphagov/govuk-frontend/blob/main/dist/assets/images/govuk-crest.svg), you can use any software to convert the file to png format. For vector-based illustrations (svg files), you could use [Inkscape](https://inkscape.org/), or any other vector-based software that allows exporting to the png file format.

`govuk-crest-2x` may not be included in [govuk-frontend](https://github.com/alphagov/govuk-frontend/). If that's the case, you will need to take the govuk-crest file and upscale it yourself, using any vector-based software that allows you to do so. Then you will need to export it as a png file.

### Step-by-step instructions for how to recreate govuk-crest-2x in Inkscape 1.4.1 in Linux

1. Open govuk-crest in Inkscape
2. Select all of the parts of the crest (Ctrl+A, or click and drag to select all)
3. In the menu, click `Object > Transform`
4. In the `Transform` tab, click on the `Scale` tab
5. Set `height` and `width` to `200%` and click Apply
6. Right click an empty part of the page behind the svg and click `Document Properties`
7. Set `Width` to `250px` and ensure Height increases along with it - If not, update `Height` to `204px`.
8. Select all of the parts of the crest and at the top of Inkscape, set `X:` to `10` and `Y:` to `0`
    1. Note: If the crest image has changed, it might be worth double checking the `X` and `Y` values and make sure it's about centred.
9. In the menu, click `File > Save As` and select `Optimized SVG (*.svg)`.
10. In this Optimized SVG Output window, set `Number of significant digits for coordinates` to `2`.
11. In this Optimized SVG Output window, tick/untick the following:
    1. Tick `Shorten Colour Values`
    2. Tick `Convert CSS attributes to XML attributes`
    3. Tick `Collapse groups`
    4. Tick `Create groups for similar attributes`
    5. Untick `Keep editor data`
    6. Untick `Keep unreferenced definitions`
    7. Untick `Work around renderer bugs`
12. In this Optimized SVG Output window, click the `SVG Output` tab and tick/untick the following:
    1. Tick `Remove the XML definition`
    2. Tick `Remove metadata`
    3. Tick `Remove comments`
    4. Ensure everything else on this tab is unticked
13. In this Optimized SVG Output window, click the `IDs` tab and tick all three of the options
14. Press OK
15. Use a command-line tool like [svgo](https://github.com/svg/svgo), or an online tool like [svgomg](https://github.com/jakearchibald/svgomg/) to further optimise the file. 
    1. Make sure you keep a Number Precision of at least 2
16. Open the optimised file in Inkscape
17. In the menu, click `File > Export`
18. In the `Export` tab, ensure the `Page` option is selected
19. Ensure `Optimized PNG (*.png)` is selected
20. Click the gear icon next to the `Optimized PNG` selection
21. Set the `Level:` to `Ten Compression Trials`
22. Select Lossy Options and tick all three options 
23. Click the folder icon on the file path to choose where to save the file - Remember to give the file a name like `govuk-crest-2x.png`.
24. Click Export
