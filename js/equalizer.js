/**
 * WP Height Equalizer
 * Author: Reto Küpfer
 * Version: 1.3.0
 * A clean, Vanilla JS utility to synchronize element heights across rows by index position.
 */
(function() {
    /**
     * 1. UNIVERSAL EDITOR DETECTION
     * Pause the script if a backend editor is detected to ensure 
     * design stability while building.
     */
    const isEditor = 
        document.body.classList.contains('wp-admin') || 
        document.body.classList.contains('block-editor-page') ||
        window.location.search.includes('breakdance=builder') ||
        window.location.search.includes('elementor-preview') ||
        window.location.search.includes('bricks=run');

    if (isEditor) return;

    let observer = null;

    // Supported selectors to match sequentially across rows
    const targetSelectors = [
        '.bde-heading', 
        '.bde-text', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 
        'ul', 'ol',
        '.equalizer-child'
    ];

    const equalize = () => {
        const parents = document.querySelectorAll('.equalizer-parent');
        
        parents.forEach(parent => {
            // 2. IDENTIFY CONTAINER
            let container = parent;
            if (parent.children.length === 1 && parent.firstElementChild.tagName === 'DIV') {
                container = parent.firstElementChild;
            }

            const cards = Array.from(container.children).filter(el => 
                !el.classList.contains('equalizer-ignore')
            );

            if (cards.length < 2) return; // Need at least 2 cards to equalize

            // 3. RESET HEIGHTS
            // Reset to 'auto' so we can accurately measure natural height on resize/mutation
            cards.forEach(card => {
                targetSelectors.forEach(selector => {
                    card.querySelectorAll(selector).forEach(el => el.style.height = 'auto');
                });
            });

            // 4. GROUP CARDS BY VISUAL ROW
            const rows = {};
            cards.forEach(card => {
                const top = Math.round(card.getBoundingClientRect().top);
                if (!rows[top]) rows[top] = [];
                rows[top].push(card);
            });

            // 5. PROCESS EACH ROW BY POSITION INDEX
            Object.values(rows).forEach(rowCards => {
                // Skip if cards are stacked vertically (e.g., mobile viewports)
                if (rowCards.length < 2) return;

                targetSelectors.forEach(selector => {
                    // Find the maximum number of instances of this selector across any card in this row
                    const counts = rowCards.map(card => card.querySelectorAll(selector).length);
                    const maxCount = Math.max(...counts);
                    const minCount = Math.min(...counts);

                    if (maxCount === 0) return;

                    // STRUCTURAL MISMATCH DETECTION WITH DETAILED BREAKDOWN
                    if (maxCount !== minCount) {
                        const cardBreakdown = rowCards.map((card, idx) => {
                            const count = card.querySelectorAll(selector).length;
                            return `  Card ${idx + 1}: ${count} instance(s)`;
                        }).join('\n');

                        console.warn(
                            `[WP Height Equalizer] Mismatch detected for selector "${selector}" on row container:`, 
                            container,
                            `\nStructure breakdown:\n${cardBreakdown}\nSkipping this selector for this row.`
                        );
                        return; // Soft abort for this selector type only
                    }

                    // Loop through each element position index (e.g., index 0 = first paragraph, index 1 = second paragraph)
                    for (let i = 0; i < maxCount; i++) {
                        const elementsInRowIndex = rowCards.map(card => {
                            return card.querySelectorAll(selector)[i];
                        }).filter(Boolean);

                        if (elementsInRowIndex.length > 1) {
                            // Find the tallest natural height at this specific position index
                            const maxHeight = Math.max(...elementsInRowIndex.map(el => el.offsetHeight));
                            
                            if (maxHeight > 0) {
                                elementsInRowIndex.forEach(el => el.style.height = maxHeight + 'px');
                            }
                        }
                    }
                });
            });
        });
    };

    /**
     * 6. SAFE EXECUTION WRAPPER
     * Temporarily disconnects the MutationObserver to prevent 
     * the script from triggering its own infinite loops when changing heights.
     */
    const safeEqualize = () => {
        if (observer) observer.disconnect();
        
        equalize();
        
        if (observer) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    // 7. DEBOUNCE UTILITY
    let resizeTimeout;
    const debouncedEqualize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(safeEqualize, 60);
    };

    // 8. LIFECYCLE LISTENERS
    window.addEventListener('load', safeEqualize);
    window.addEventListener('resize', debouncedEqualize);
    
    if (window.MutationObserver) {
        observer = new MutationObserver(debouncedEqualize);
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();