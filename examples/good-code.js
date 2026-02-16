/**
 * Example of GOOD code with LOW cognitive debt
 * 
 * This file demonstrates best practices:
 * - Short, focused functions (< 30 lines)
 * - Shallow nesting (< 3 levels)
 * - Few parameters (< 4)
 * - Clear, descriptive names
 * - Minimal dependencies
 */

// Simple utility functions with clear names
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// Well-structured function with early returns (avoiding deep nesting)
function validateUser(user) {
    if (!user) {
        return { valid: false, error: 'User is required' };
    }

    if (!user.email) {
        return { valid: false, error: 'Email is required' };
    }

    if (!user.name) {
        return { valid: false, error: 'Name is required' };
    }

    return { valid: true };
}

// Function with reasonable parameters (3)
function createOrder(userId, items, shippingAddress) {
    const total = calculateTotal(items);

    return {
        userId,
        items,
        shippingAddress,
        total,
        createdAt: new Date(),
    };
}

// Clear class with focused methods
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getTotal() {
        return calculateTotal(this.items);
    }

    clear() {
        this.items = [];
    }
}

// Export for use in other modules
module.exports = {
    calculateTotal,
    formatCurrency,
    validateUser,
    createOrder,
    ShoppingCart,
};
