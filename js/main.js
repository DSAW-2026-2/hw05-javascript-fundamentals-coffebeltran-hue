/**
 * main.js
 * DOM manipulation, event listeners and form wiring for WebDining.
 * Validation rules themselves live in validation.js (js/validation.js).
 */

document.addEventListener("DOMContentLoaded", () => {
    const MENU_ITEMS = [
        {
            id: "bowl-andino",
            name: "Bowl Andino",
            category: "Bowls",
            price: 14000,
            description: "Quinoa, grilled chicken, avocado and roasted vegetables."
        },
        {
            id: "ensalada-cesar",
            name: "Ensalada César",
            category: "Salads",
            price: 12000,
            description: "Romaine lettuce, parmesan, croutons and grilled chicken."
        },
        {
            id: "wrap-vegetariano",
            name: "Wrap Vegetariano",
            category: "Wraps",
            price: 11000,
            description: "Hummus, roasted vegetables and spinach in a whole-wheat wrap."
        },
        {
            id: "jugo-de-mango",
            name: "Jugo de Mango",
            category: "Juices",
            price: 5000,
            description: "Fresh mango juice, no added sugar."
        },
        {
            id: "pasta-al-pesto",
            name: "Pasta al Pesto",
            category: "Pasta",
            price: 13000,
            description: "Penne pasta with basil pesto and cherry tomatoes."
        },
        {
            id: "sandwich-de-pollo",
            name: "Sándwich de Pollo",
            category: "Sandwiches",
            price: 10000,
            description: "Grilled chicken breast, lettuce and tomato on ciabatta bread."
        },
        {
            id: "smoothie-de-fresa",
            name: "Smoothie de Fresa",
            category: "Juices",
            price: 6000,
            description: "Strawberry, banana and yogurt smoothie."
        }
    ];

    const currencyFormatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

    // ---- Menu rendering ----
    const menuList = document.querySelector("#menu-list");
    const menuEmptyMessage = document.querySelector("#menu-empty");
    const menuSearchInput = document.querySelector("#menu-search");
    const dishSelect = document.querySelector("#order-dish");

    function createMenuItemElement(item) {
        const li = document.createElement("li");
        li.className =
            "rounded-xl border-2 border-[#29266b] bg-white p-5 text-[#080736] shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white";
        li.dataset.itemId = item.id;

        const title = document.createElement("h3");
        title.className = "text-lg font-semibold text-[#29266b] dark:text-[#d9d8e8]";
        title.textContent = item.name;

        const category = document.createElement("span");
        category.className = "mt-1 block text-xs font-semibold uppercase tracking-wide text-[#d9c77a]";
        category.textContent = item.category;

        const description = document.createElement("p");
        description.className = "mt-2 leading-relaxed";
        description.textContent = item.description;

        const price = document.createElement("p");
        price.className = "mt-3 font-bold";
        price.textContent = currencyFormatter.format(item.price);

        li.append(title, category, description, price);
        return li;
    }

    function renderMenu(items) {
        menuList.innerHTML = "";

        if (items.length === 0) {
            menuEmptyMessage.classList.remove("hidden");
            return;
        }

        menuEmptyMessage.classList.add("hidden");

        const fragment = document.createDocumentFragment();
        items.forEach((item) => fragment.appendChild(createMenuItemElement(item)));
        menuList.appendChild(fragment);
    }

    function populateDishSelect(items) {
        items.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = `${item.name} — ${currencyFormatter.format(item.price)}`;
            dishSelect.appendChild(option);
        });
    }

    function filterMenu(query) {
        const normalizedQuery = query.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
            return MENU_ITEMS;
        }

        return MENU_ITEMS.filter((item) => {
            const haystack = `${item.name} ${item.category} ${item.description}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }

    renderMenu(MENU_ITEMS);
    populateDishSelect(MENU_ITEMS);

    // Real-time filter: updates the list on every keystroke.
    menuSearchInput.addEventListener("input", (event) => {
        const filtered = filterMenu(event.target.value);
        renderMenu(filtered);
    });

    // ---- Order form validation ----
    const orderForm = document.querySelector("#order-form");
    const orderSuccess = document.querySelector("#order-success");

    const fieldValidators = {
        name: window.WebDiningValidation.validateName,
        email: window.WebDiningValidation.validateEmail,
        dish: window.WebDiningValidation.validateDish,
        quantity: window.WebDiningValidation.validateQuantity,
        notes: window.WebDiningValidation.validateNotes
    };

    function getErrorElement(fieldName) {
        return orderForm.querySelector(`.error-message[data-error-for="${fieldName}"]`);
    }

    function showFieldError(fieldName, message) {
        const errorElement = getErrorElement(fieldName);
        if (!errorElement) return;

        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
    }

    function clearFieldError(fieldName) {
        const errorElement = getErrorElement(fieldName);
        if (!errorElement) return;

        errorElement.textContent = "";
        errorElement.classList.add("hidden");
    }

    function validateField(fieldName) {
        const field = orderForm.elements[fieldName];
        const validator = fieldValidators[fieldName];

        if (!field || !validator) return true;

        const result = validator(field.value);

        if (result.valid) {
            clearFieldError(fieldName);
        } else {
            showFieldError(fieldName, result.message);
        }

        return result.valid;
    }

    // Validate each field in real time as the user types or leaves the field.
    Object.keys(fieldValidators).forEach((fieldName) => {
        const field = orderForm.elements[fieldName];
        if (!field) return;

        field.addEventListener("input", () => validateField(fieldName));
        field.addEventListener("blur", () => validateField(fieldName));
    });

    orderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        orderSuccess.classList.add("hidden");

        const fieldNames = Object.keys(fieldValidators);
        const results = fieldNames.map((fieldName) => validateField(fieldName));
        const isFormValid = results.every(Boolean);

        if (!isFormValid) {
            const firstInvalidField = fieldNames.find((fieldName, index) => !results[index]);
            if (firstInvalidField && orderForm.elements[firstInvalidField]) {
                orderForm.elements[firstInvalidField].focus();
            }
            return;
        }

        orderSuccess.classList.remove("hidden");
        orderForm.reset();
    });
});
