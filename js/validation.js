/**
 * validation.js
 * Client-side validation module for the WebDining order form.
 * All validation logic lives here, isolated from DOM manipulation (main.js).
 * Each validator receives a raw value and returns:
 *   { valid: boolean, message: string }
 */

function validateName(value) {
    const trimmed = (value || "").trim();

    if (trimmed.length === 0) {
        return { valid: false, message: "Please enter your full name." };
    }

    if (trimmed.length < 3) {
        return { valid: false, message: "Name must be at least 3 characters long." };
    }

    // Letters (including accented characters) and spaces only.
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nameRegex.test(trimmed)) {
        return { valid: false, message: "Name can only contain letters and spaces." };
    }

    return { valid: true, message: "" };
}

function validateEmail(value) {
    const trimmed = (value || "").trim();

    if (trimmed.length === 0) {
        return { valid: false, message: "Please enter your email." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return { valid: false, message: "Please enter a valid email address." };
    }

    return { valid: true, message: "" };
}

function validateDish(value) {
    if (!value || value.trim().length === 0) {
        return { valid: false, message: "Please select a dish." };
    }

    return { valid: true, message: "" };
}

function validateQuantity(value) {
    if (value === null || value === undefined || value === "") {
        return { valid: false, message: "Please enter a quantity." };
    }

    const quantity = Number(value);

    if (!Number.isInteger(quantity)) {
        return { valid: false, message: "Quantity must be a whole number." };
    }

    if (quantity < 1) {
        return { valid: false, message: "Quantity must be at least 1." };
    }

    if (quantity > 10) {
        return { valid: false, message: "Quantity cannot exceed 10 per order." };
    }

    return { valid: true, message: "" };
}

function validateNotes(value) {
    const trimmed = (value || "").trim();

    if (trimmed.length > 200) {
        return { valid: false, message: "Notes cannot exceed 200 characters." };
    }

    return { valid: true, message: "" };
}

// Expose validators as a single namespace so main.js can use them
// without relying on ES module imports (kept as plain, dependency-free scripts).
window.WebDiningValidation = {
    validateName,
    validateEmail,
    validateDish,
    validateQuantity,
    validateNotes
};
