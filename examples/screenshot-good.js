// ✅ GOOD CODE: Easy to skim, clear intent, low cognitive load.

function calculateCartTotal(items, taxRate) {
    if (!items || items.length === 0) {
        return 0;
    }

    const subtotal = calculateSubtotal(items);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return Number(total.toFixed(2));
}

function calculateSubtotal(items) {
    return items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}

// Score: 100/100 (Excellent)
