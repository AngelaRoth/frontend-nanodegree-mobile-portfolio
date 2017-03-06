# Logic Behind the If/Loop Structure of `onResize()`

This took me so much longer than it should have, and I suspect it results in zero to negligible gains for our site, but it might be more beneficial if our "grid of pizzas" was 100 x 200 instead of around 4 x 6 or 8 x 3.

It all came about when I realized that the **required number of moving pizzas will change if the user resizes their window without reloading**. A decrease in window size will result in continued manipulation of now superfluous pizzas, but an increase in window size will result in too few pizzas to fill the screen (horror!). How to avoid this?

1. We can always provide enough moving pizzas to fill the full screen, even if the initial window only takes up 1/4 of it. But if the user never enlarges his window, we have 4x the required pizzas floating about for no reason.
2. When a screen resize is registered, we can update the array of moving pizzas. Though creating and/or removing pizzas sounds like time-gobbling work, it will be only be done on a screen resize when the user is expecting a "jagged visual shift" (i.e we're into 100ms time allowance territory).

### But how to update the moving pizza array?

1. The easiest, most bashing the piece into place approach would be to empty the array and fill it from scratch, and with our small arrays this would probably work just fine. But in a 20,000-pizza array, destroying and recreating them all simply to add five seems less than ideal.
2. It is tempting to simply calculate the **change in number** of required pizzas and then add or delete the difference, but what happens if screen width changes? **What happens if you need more columns?** Upon changing from a 4 x 6 grid to a 3 x 8 grid, although the total number of pizzas remains unchanged, **the `style.left` and `style.top` properties of the pizzas do change**. In the above scenario, with pizzas stored in a 1-dimensional array, the properties of `pizzaArray[3]` would change, quickly negating the benefits of keeping old pizzas.
    * `style.left = (3*256)` / `style.top = 0` becomes...
    * `style.left = 0` / `style.top = 256`
3. One solution would be to keep the number of columns fixed, and only worry about rows. Then, we would only have to listen for vertical changes in screen size, and we could add or delete entire rows worth of pizzas as required.  But this returns us to the problem of **how many** columns to create.

### And so the idea for my crazy if / loop structure was born.

I assign each moving pizza a place in a **2-Dimensional Array** (an array of rows, where each row is an array of the pizzas in that row). If I have to remove pizzas from the bottom **or from the left**, I can do so without touching the remaining pizzas.  If I need more pizzas, I can put them exactly where needed, again without disturbing the pizzas which are already nicely placed. If I need more columns and fewer rows, I can do that too.

A pleasing symmetry of this is that my "array" of pizzas always exactly mirrors the grid in the DOM. And, **when I want to remove (or change) a pizza**, I simply have to refer to that particular pizza object, which is being "pointed" to by both my array of pizzas and by the DOM. There is no need to "get" it first using commands like `getElementById()`:

        function removeMover(i, j) {
          // remove element from DOM
          var element = moverArray[i][j];
          element.outerHTML = "";
          delete element;

          // remove element from moverArray
          moverArray[i].splice(j, 0);
        }

### Unique IDs Aren't Even Necessary

I still give my moving pizzas unique ID's when I create them. I originally thought this would be necessary to hand-pluck them from the DOM, but it isn't!  I've kept the ID assignment in my code purely for the pleasure of watching unique ID-ed pizzas pop into and out of the generated HTML code as I resize my screen in DevTools. Try it!

