# Angela's Optimization of Grizz von Grizzmon's (formerly Cameron's) site

A performance optimization project, written as part of the Udacity Frontend Nanodegree.

The **[home page](https://angelaroth.github.io/frontend-nanodegree-mobile-portfolio/)** has been optimized for load-speed, and achieves [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) scores of

* 92 for Mobile
* 93 for Desktop.

The **[pizza page](https://angelaroth.github.io/frontend-nanodegree-mobile-portfolio/pizza.html)** has been optimized for jank-free scrolling of the moving background pizzas.

## Viewing the Site

The site is served over GitHub's gh-pages.

* **[home page](https://angelaroth.github.io/frontend-nanodegree-mobile-portfolio/)** [Alternately, open **index.html** in any browser]

* **[pizza page](https://angelaroth.github.io/frontend-nanodegree-mobile-portfolio/pizza.html)** [Alternately, Click on **Cam's Pizzeria** in the home page, or open **index.html** in any browser]
    * **Scroll the Page** to see the **Background Pizzas** move.
    * **Click on the Size Selector Slider** (Located just above the Menu) to watch the fixed pizzas change size.

## Change in File Structure

Storing images, JavaScript, and CSS files in multiple places struck me as unnecessarily complex for such a small site, so I moved the pizza-related code **out of the views folder** and **into the main project folder**. CSS files were moved into the main CSS folder; images were moved into the main img folder, etc.

Of the files formerly in the views folder,

* **style.css** has been renamed **pizza-style.css**
* **main.js** has been renamed **pizza-main.js**

Names of remaining files from the old **views** folder remain unchanged

## Optimizations to Main Page

### Images

1. I **downloaded** the images from all the links in the original site.
2. I made a 100px wide version of Cam's pizzeria image (using XnView for Windows) to use in the "thumbnail" on the main page.
3. I used **Grunt responsive-images**, with "quality" set to 30, to minimize all images, but PageSpeed Insights told me I could do better.
4. I ran the troublesome images through **Trimage**, and that satisfied PageSpeed Insights.  I have not bothered including my Grunt responsive-images code, because in the end using Trimage on the 5 "always tiny" images of the main page was all I needed.  If I were to optimize all the pages of this site for responsive viewing, I would use Grunt responsive-images to create different-sized images for use with _srcset_.

### Fonts

In style.css, I specified a **Verdana Font**, with defaults of Geneva and sans-serif, for `body`, `button`, `input`, `select` and `textarea`. This allowed me to delete an expensive call to the **Google Fonts stylesheet**. I don't think the original **Open Sans Font** looked noticeably better.

### Inlining Critical-Path CSS

I used the **grunt-critical** plugin to extract & inline critical-path CSS into index.html.

* I gave it two width / height options, one reflecting a desktop and the other reflecting a mobile phone in portrait mode.

The following files are included in the project folder:

* **Gruntfile.js**  (only includes code for grunt-critical)
* **package.json** (still includes devDependencies for image resizing, which I may choose to re-include in my Gruntfile in future)
* **test folder**, into which the reformatted index.htms was copied.  I have also included the pre-conversion version of index.html (titled **index-original.html**) in the test folder for comparison.

### Google-Analytics is NOT Critical to Load

So I added the **async attribute** to the script tag which calls `http://www.google-analytics.com/analytics.js`.

## Optimizations to Pizza Page

### Move Style Attributes from HTML and JavaScript to CSS File

A number of width and style attributes used to be defined in HTML (for the "hard-coded" Udacity and Cameron Special pizzas) and in Javascript (for the randomly generated pizzas). I moved width and/or height attributes of the following classes into `pizza-style.css`.

* `.mover` (existing class)
* `.randomPizzaContainer` (existing class)
* `.pizzaImageContainer` (new class)
* `.pizzaDescriptionContainer` (new class)

### Optimize Response to Pizza-Slider Size Selections

The original **`changePizzaSizes()` function** was a mess of unnecessary calculations. The only thing that happens when the pizza-slider position is changed is that `.randomPizzaContainer`s (which contain both the pizza image and the pizza description) are resized to take up 25% (small), 33.33% (medium), or 50% (large) of the screen.

These relative widths can be assigned in a simple **switch statement** which evaluates the _size_ input of the slider.  But how to actually assign them?

The brute force option would be to loop through all `.randomPizzaContainer`s and assign them a width. To avoid this lengthy loop, I added CSS styles for `.randomPizzaContainer`s which are children of class `.smallRandomPizzas`, `.randomPizzaContainer`s which are children of class `.mediumRandomPizzas`, and  `.randomPizzaContainer`s which are children of class `.largeRandomPizzas`. Now, my switch statement only has to **toggle between these three classes on the .randomPizzaContainer`s' parent container** (ID `#randomPizzas`).

This method has the added benefit of **moving CSS-stylings out of the HTML code and into the stylesheet**. Consider the case of ten "hard-coded into the HTML" pizzas instead of two, where we are altering five style properties instead of one.  The more complex things become, the nicer it is to have everything contained in one CSS "case."

### Eliminate Forced Reflow from updatePositions Function

* Now `scrollTop` is only calculated once, at the beginning of the function.
* The five possible "phase" values are also calculated once, and stored in an array for use in the loop which calculates the transform property of each moving pizza

### Change the Transform Property of moving pizzas, not the Left Position

The "starting" left position of each moving pizza is determined when it is created, and from then on it is fixed.  The "waving pizza" effect is created by changing the transform property. Now, we are just telling the pizzas how far they should move away from their previous position, we are not "hard-repositioning" them with a new left value.

Using transform allows us to **warn the browser** that a transform is coming by adding `will-change: transform` to the `.mover` class in `pizza-style.css`. Now, the browser places the moving pizzas on their **own layers**.

### Don't Create More Moving Pizzas than Necessary

The original program generates 200 moving pizzas and places them in 8 columns, making 25 rows of 8.  With each pizza being allotted a 256px square in which to move about, it would take **one funky screen** to require a grid of 8 x 25.

To avoid making (and subsequently moving) superfluous pizzas, I **calculate how many rows and columns are required** using the width of the body and the inner height of the screen (2 extra pizzas are provided per row to enhance the waving effect). I then store these pizzas in a "2-dimensional" array (an array of rows, where each row is an array of the pizzas in that row). Might it have been easier simply to assign the newly created pizzas their _top_ and _left_ positions and push them into a single "1-dimensional" array? Perhaps. But **what happens if the screen is resized?**

This question led me down a wild and crazy path toward dropping new pizzas into and plucking them out of **specific locations on the grid**.  More effort than required for this little project? Maybe. But it led me to a new understanding of how our moving pizza **objects** were being referenced by both the 2D array I'd stored them in, **and by the DOM itself**.

* **[My 2D Pizza Logic](PIZZA-ARRAY-LOGIC.md)**

* **[The Discussion Forum Post](https://discussions.udacity.com/t/removing-element-from-dom-without-getting-element-first/225576/5)** where I and mentor Stacy ponder how **element objects** work.

### Don't Update if Already Updating

The program was originally written to update moving pizza positions every time a scroll event was registered, regardless of whether positions were already being updated due to a previous scroll. Since scrolling is "rapid-fire" by nature, this seems less than ideal.

In my updated version, a scroll event triggers the `onScroll()` function, which only makes a call to `updatePositions()` if updating is not already occurring. The `updating` variable is set to true at the beginning of `onScroll()`, and reset to false at the end of `updatePositions()`.

I kept the calculation of the current Scroll Top inside `updatePositions()` because, now, `updatePositions()` is itself only called when appropriate.

* **But this didn't seem to Affect Anything:** I log an "aborted" message to the console if `onScroll()` is called when updating is already in progress, but this message **never** logs.

### Employ Request Animation Frame

In order to assist scheduling of pizza position updates, the call to `updatePositions()` inside `onScroll()` is made using `requestAnimationFrame()`.  **But**, as with employing the `onScroll()` function itself, this didn't seem to result in a noticeable decrease in frame length.
* **Curious:** I thought `onScroll()` and `requestAnimationFrame()` would provide measurable payoffs.

### Images

I optimized the giant `pizzeria.jpg` image and also the `pizza.png` sourced by the stationary pizzas.

Then I noticed that the moving pizzas were fixed at 1/3 the size of the main `pizza.png` image. So I **made a new `pizza-move.png`** which is only 1/3 the size of the original, and used this as the source for the moving pizzas. I figured, _why lug around bigger pizzas than necessary?_  My change means that one more image needs to be downloaded, but I do think it resulted in marginal fps improvements!  (This was the last change I made.)
