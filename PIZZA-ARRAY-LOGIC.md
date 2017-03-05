# Logic Behind the If/Loop Structure of `onResize()`

This took me so much longer than it should have, and I suspect it results in zero to negligible gains for our site, but once I was half-way through it and realized this, I wanted to at least make it work.  Maybe if our "grid of pizzas" was close to 1000 x 2000 instead of around 4 x 6 or 8 x 3, this method would be worthwhile.

It all came about when I realized that the number of required pizzas would change if the user resized their window. For instance, if the user loads the page with their window only filling half the screen, and then they switch it to be full screen without reloading, they won't have enough pizzas to fill their new larger window. Without giving it _too_ much thought (a failing, perhaps?) I saw two solutions:

1. A combination of guessing what the user would do and creating more pizzas than required to fill the current window. I.e., always provide enough moving pizzas to fill the whole screen, even if the window only takes up 1/4 of the screen. But if the user never enlarges his window, you have 4x the required pizzas for no reason; this seemed less than ideal.
2. Listen for a resizing of the screen, and when it happens update the array of moving pizzas. I liked the sound of this because, while creating / destroying moving pizzas sounded like time-gobbling work, it would be only be done on a screen resize when the user would be expecting a "jagged visual shift" (i.e we're into 100ms time allowance territory).

But how to update the moving pizza array?

1. The easiest, most bashing the piece into place approach would be to empty my array and fill it from scratch. (And with our small arrays, this would probably work just fine.)
2. It's tempting to simply calculate if the number of required pizzas has increased or decreased, and then `push()` new pizzas onto the pizza array and append them as new children to the DOM, or `pop()` superfluous pizzas and remove a corresponding number of children from the DOM. This would prevent destroying 24 pizzas and adding 30 when you really only need to add 6.
3. But **as screen width changes, so does the number of columns**. Upon changing from a 4 x 6 grid to a 3 x 8 grid, **although you still have 24 pizzas, the `style.left` and `style.top` properties of the pizzas have changed**. I.e., if all the pizzas are stored in a 1-dimensional array, the 4th pizza in that array (pizzaArray[3]) will go from having `style.left = (3*256)` and `style.top = 0` to having `style.left = 0` and `style.top = 256`.
4. A solution to this would be to keep the number of columns fixed, and only worry about rows. Then, we would only have to listen for vertical changes in screen size, and we could push an pop entire rows worth of pizzas as required.  But this returns us to the problem of **how many** columns to create, and potentially creating (and manipulating) more than we need.

And this is where the idea for my crazy if / loop structure was born. I assign each moving pizza a place in a **2-Dimensional Array** (an array of rows, where each row is an array of the pizzas in that row).

Now, if I have to remove pizzas from the bottom **or from the left**, I can do so without touching the remaining pizzas.  If I need more pizzas, I can put them exactly where needed, again without disturbing the pizzas which are already nicely placed. If I need more columns and fewer rows, I can do that too.

A pleasing symmetry of this is that my "array" of pizzas always exactly mirrors the grid in the DOM. And, **when I want to remove (or change) a pizza**, I simply have to refer to that particular pizza object, which is being "pointed" to by both my array of pizzas and by the DOM. There is no need to "get" it first using commands like `getElementById()`:

        function removeMover(i, j) {
          var element = moverArray[i][j];
          element.outerHTML = "";
          delete element;

          moverArray[i].splice(j, 0);
        }

I still give my moving pizzas unique ID's when I create them. I originally thought these would be necessary to hand-pluck them from the DOM, but it isn't!  I've kept the ID assignment in my code purely for the pleasure of watching unique ID-ed pizzas pop into and out of the generated HTML code as I resize my screen in DevTools. Try it!

