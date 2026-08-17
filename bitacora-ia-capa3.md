# Capa 3 — Bitácora de IA

**Selector / event listener trabajado:** `#menu-search` — filtro de búsqueda en tiempo real sobre la lista del menú (`js/main.js`).

## Código original sugerido por la IA

```javascript
const searchInput = document.getElementById("menu-search");

searchInput.onkeyup = function() {
    const value = searchInput.value;
    const items = document.querySelectorAll("#menu-list li");

    items.forEach(function(item) {
        if (item.textContent.includes(value)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
};
```

## Versión final (ajustada por mí)

```javascript
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

menuSearchInput.addEventListener("input", (event) => {
    const filtered = filterMenu(event.target.value);
    renderMenu(filtered);
});
```

## Diferencias y por qué las hice

- **`onkeyup` → `addEventListener("input")`:** `input` también captura pegado con el mouse (clic derecho → pegar) y entrada por voz, no solo el teclado. `onkeyup` se queda corto en esos casos.
- **Comparación de texto sin normalizar → `.trim().toLowerCase()`:** la versión original de la IA era sensible a mayúsculas/minúsculas y a espacios extra, así que buscar "Bowl" no encontraba "bowl". Agregué la normalización para que la búsqueda sea consistente.
- **Filtrar solo por `textContent` del `<li>` → filtrar sobre los datos (`MENU_ITEMS`) por nombre, categoría y descripción:** leer el texto ya renderizado en el DOM es fràgil (se rompe si cambio el HTML de la tarjeta) y solo buscaba por lo que aparecía visualmente. Filtrar sobre el arreglo de datos es más confiable y permite buscar también por categoría o descripción, no solo por el nombre visible.
- **Esconder/mostrar con `style.display` → re-renderizar la lista con `renderMenu()`:** con `display: none` los elementos ocultos seguían en el DOM (y en el tab order). Prefería reconstruir la lista completa a partir de los resultados filtrados, así el DOM siempre refleja exactamente lo que se está mostrando, y de paso reuso la misma función `renderMenu()` que ya usaba para el primer render del menú.
- **Sin mensaje de "sin resultados" → agregué `#menu-empty`:** la sugerencia original no contemplaba qué pasa si la búsqueda no encuentra nada; el usuario se quedaba viendo una lista vacía sin explicación.

## Selector / event listener del formulario (opcional, si quieres incluir un segundo ejemplo)

*(Deja esta sección para cuando definan si van a documentar también la validación del formulario, por ejemplo el `blur`/`input` sobre `#order-email`, siguiendo el mismo formato: código original → versión final → diferencias.)*
