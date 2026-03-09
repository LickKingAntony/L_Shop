import { apiGetCart, apiLogout, apiMe, apiRemoveCartItem, apiUpdateCartItem } from "../api.js";
import { navigate } from "../router.js";
import { getState, updateState } from "../state.js";
import { apiGetProducts } from "../api.js";
function findProduct(products, productId) {
    return products.find(p => p.id === productId) ?? null;
}
function createHeader() {
    const header = document.createElement("header");
    header.className = "header";
    const title = document.createElement("div");
    title.className = "logo";
    title.textContent = "L_Shop";
    header.appendChild(title);
    const nav = document.createElement("nav");
    nav.className = "nav";
    const mainLink = document.createElement("a");
    mainLink.href = "/";
    mainLink.textContent = "Товары";
    mainLink.setAttribute("data-link", "true");
    nav.appendChild(mainLink);
    const cartLink = document.createElement("a");
    cartLink.href = "/cart";
    cartLink.textContent = "Корзина";
    cartLink.setAttribute("data-link", "true");
    nav.appendChild(cartLink);
    const deliveryLink = document.createElement("a");
    deliveryLink.href = "/delivery";
    deliveryLink.textContent = "Доставка";
    deliveryLink.setAttribute("data-link", "true");
    nav.appendChild(deliveryLink);
    const state = getState();
    if (state.currentUser) {
        const logoutLink = document.createElement("a");
        logoutLink.href = "/";
        logoutLink.textContent = "Выйти";
        logoutLink.addEventListener("click", async (event) => {
            event.preventDefault();
            await apiLogout();
            updateState({
                currentUser: null,
                cartItems: [],
                deliveries: []
            });
            navigate("/");
        });
        nav.appendChild(logoutLink);
    }
    else {
        const authLink = document.createElement("a");
        authLink.href = "/register";
        authLink.textContent = "Войти";
        authLink.setAttribute("data-link", "true");
        nav.appendChild(authLink);
    }
    header.appendChild(nav);
    return header;
}
function createCartRow(item, product) {
    const row = document.createElement("div");
    row.className = "cart-row";
    const title = document.createElement("div");
    title.className = "cart-title";
    const titleText = product ? product.title : item.productId;
    title.textContent = titleText;
    title.setAttribute("data-title", "basket");
    row.appendChild(title);
    const price = document.createElement("div");
    price.className = "cart-price";
    const priceValue = product ? product.price : 0;
    price.textContent = `${priceValue} BYN`;
    price.setAttribute("data-price", "basket");
    row.appendChild(price);
    const quantityWrapper = document.createElement("div");
    quantityWrapper.className = "cart-quantity";
    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    quantityWrapper.appendChild(minusButton);
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = String(item.quantity);
    quantityWrapper.appendChild(quantityInput);
    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    quantityWrapper.appendChild(plusButton);
    row.appendChild(quantityWrapper);
    const total = document.createElement("div");
    total.className = "cart-total";
    const totalValue = priceValue * item.quantity;
    total.textContent = `${totalValue} BYN`;
    row.appendChild(total);
    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    row.appendChild(removeButton);
    minusButton.addEventListener("click", async () => {
        const current = Number(quantityInput.value);
        const next = current - 1;
        if (next <= 0) {
            const items = await apiRemoveCartItem(item.productId);
            if (!items) {
                return;
            }
            updateState({ cartItems: items });
            navigate("/cart");
            return;
        }
        const items = await apiUpdateCartItem(item.productId, next);
        if (!items) {
            return;
        }
        updateState({ cartItems: items });
        navigate("/cart");
    });
    plusButton.addEventListener("click", async () => {
        const current = Number(quantityInput.value);
        const next = current + 1;
        const items = await apiUpdateCartItem(item.productId, next);
        if (!items) {
            return;
        }
        updateState({ cartItems: items });
        navigate("/cart");
    });
    removeButton.addEventListener("click", async () => {
        const items = await apiRemoveCartItem(item.productId);
        if (!items) {
            return;
        }
        updateState({ cartItems: items });
        navigate("/cart");
    });
    return row;
}
export function renderCartPage(root) {
    const state = getState();
    const container = document.createElement("div");
    container.className = "page";
    const header = createHeader();
    container.appendChild(header);
    const title = document.createElement("h1");
    title.textContent = "Корзина";
    container.appendChild(title);
    const info = document.createElement("div");
    info.className = "info-box";
    if (!state.currentUser) {
        info.textContent = "Для работы с корзиной нужно войти в аккаунт.";
        container.appendChild(info);
        root.innerHTML = "";
        root.appendChild(container);
        return;
    }
    if (state.cartItems.length === 0) {
        info.textContent = "Корзина пуста.";
        container.appendChild(info);
        const link = document.createElement("a");
        link.href = "/";
        link.textContent = "Перейти к товарам";
        link.setAttribute("data-link", "true");
        container.appendChild(link);
        root.innerHTML = "";
        root.appendChild(container);
        void apiGetCart().then(items => {
            updateState({ cartItems: items });
        });
        return;
    }
    const list = document.createElement("div");
    list.className = "cart-list";
    let totalSum = 0;
    state.cartItems.forEach(item => {
        const product = findProduct(state.products, item.productId);
        const row = createCartRow(item, product);
        const priceValue = product ? product.price : 0;
        totalSum += priceValue * item.quantity;
        list.appendChild(row);
    });
    container.appendChild(list);
    const bottom = document.createElement("div");
    bottom.className = "cart-bottom";
    const totalText = document.createElement("div");
    totalText.textContent = `Итого: ${totalSum} BYN`;
    bottom.appendChild(totalText);
    const deliveryButton = document.createElement("button");
    deliveryButton.textContent = "Оформить доставку";
    deliveryButton.addEventListener("click", () => {
        navigate("/delivery");
    });
    bottom.appendChild(deliveryButton);
    container.appendChild(bottom);
    root.innerHTML = "";
    root.appendChild(container);
    void apiMe().then(user => {
        if (!user) {
            return;
        }
        updateState({
            currentUser: user,
            deliveries: user.deliveries
        });
    });
    if (state.products.length === 0) {
        void apiGetProducts(state.productFilters).then(products => {
            updateState({ products });
        });
    }
    void apiGetCart().then(items => {
        updateState({ cartItems: items });
    });
}
