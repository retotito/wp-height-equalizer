=== WP Height Equalizer ===
Contributors: retotito
Tags: layout, columns, height, equalizer, design
Requires at least: 6.0
Tested up to: 6.7
Stable tag: 1.3.0
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt

== Description ==

Stop fighting with uneven cards and jagged rows. **WP Height Equalizer** is a plug-and-play utility designed to bring flawless visual alignment to your grids and multi-column layouts. 

Unlike blanket scripts, this plugin uses an intelligent **top-down structural approach**. Simply add a single class to your row container, and the plugin automatically maps and synchronizes the inner elements row-by-row based on their exact positional order.

### Key Features:
* **Zero Configuration:** No need to add utility classes to every single inner heading or paragraph. Set it on the parent container, and it just works.
* **Intelligent Row-Grouping:** Dynamically calculates which cards are visually in the same row. When layout columns stack vertically on mobile viewports, equalization automatically pauses to maintain standard readability.
* **Built for Page Builders:** Fully optimized for loop-generated structures like Breakdance Repeaters, Elementor Loops, WooCommerce grids, or custom theme templates.
* **Performance Focused:** Extremely lightweight Vanilla JS utility with built-in event debouncing. It automatically disconnects its MutationObserver during style injection to ensure zero layout thrashing or browser freezes.

== How It Works & Supported Elements ==

Add the class `equalizer-parent` to your main layout container (Section, Grid, Row, or Div). The plugin will scan the child cards and synchronize matching elements sequentially (e.g., matching the 1st paragraph across all columns, then the 2nd paragraph, etc.).

### Automatically Supported Elements:
* **Headings:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, and `.bde-heading`
* **Text Blocks:** `p` and `.bde-text`
* **Lists:** `ul` and `ol` (Perfect for lining up features/bullet points)
* **Custom Control:** Use `.equalizer-child` to manually force-sync a custom element, or `.equalizer-ignore` to exclude a specific card entirely from the calculation.

---

### Supported DOM Structure (Direct Siblings)
The plugin targets grids where every individual card is a direct sibling under a single shared parent container. This is how Repeaters, Post Loops, and WooCommerce grids natively output HTML:

[equalizer-parent] (The Grid Container)
  ├── [Card 1] ──> <h3> ──> <p>
  ├── [Card 2] ──> <h3> ──> <p>
  └── [Card 3] ──> <h3> ──> <p>

### Unsupported DOM Structure (Nested Column Stacking)
Avoid using this on multi-column layouts where multiple content cards are stacked vertically inside separate column silos. 

While it looks like a flat grid on your screen, the code structures them in isolation:

       VISUAL LAYOUT (On Screen)               DOM STRUCTURE (In Code)
   =================================      =================================
   [   COLUMN 1   ]   [   COLUMN 2   ]      [equalizer-parent]
   +--------------+   +--------------+        ├── [Column element 1]
   |  [ Card A ]  | = |  [ Card C ]  | <──┐   │     ├── [Card A] (Index 0)
   |  (Index 0)   | Y |  (Index 0)   |    │   │     └── [Card B] (Index 1)
   +--------------+ L +--------------+    ├───┼── [Column element 2]
   |  [ Card B ]  | E |  [ Card D ]  | <──┘   │     ├── [Card C] (Index 0)
   |  (Index 1)   | V |  (Index 1)   |        └──   └── [Card D] (Index 1)
   +--------------+ E +--------------+
                    L
   ========================================================================
   THE PROBLEM: 
   Card A and Card C sit on the same visual Y-LEVEL, but they live in 
   completely different DOM branches. 
   
   Our script loops through elements by their index position *inside their 
   respective column*. If you delete Card D, Column 1 still has 2 cards, 
   but Column 2 only has 1. The script detects this index mismatch (2 vs 1) 
   and will refuse to equalize the row, leaving Card A and Card C un-synced.
   ========================================================================

== Developer-Friendly Error Logging ==

Because the script matches elements sequentially by their layout position, it relies on structural symmetry across cards in the same row. If a card is missing an element, the plugin handles it gracefully:

* **Soft Fallback:** It skips equalization *only* for the mismatched element type on that specific row, ensuring the rest of the layout (like headers) still syncs perfectly.
* **Smart DevTools Output:** It prints a detailed structural breakdown directly to your browser console, pointing you to the exact card that is missing a text block or list, saving you manual inspection time.

== How to Use ==

1. **The Parent:** Add the CSS class `equalizer-parent` to your container.
2. **The Result:** The plugin automatically detects and levels your headers, text, and lists on the frontend.
3. **Builder Safe:** The script automatically goes dormant when you open backend editors (Breakdance, Elementor, Bricks, Gutenberg) to ensure design environment stability.