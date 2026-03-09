import { getState, setRoute, updateState } from "./state.js";
import { renderMainPage } from "./screens/MainPage.js";
import { renderRegistrationPage } from "./screens/RegistrationPage.js";
import { renderCartPage } from "./screens/CartPage.js";
import { renderDeliveryPage } from "./screens/DeliveryPage.js";
function getRouteFromPath(pathname) {
    if (pathname === "/register") {
        return "/register";
    }
    if (pathname === "/cart") {
        return "/cart";
    }
    if (pathname === "/delivery") {
        return "/delivery";
    }
    return "/";
}
export function navigate(path) {
    if (window.location.pathname !== path) {
        window.history.pushState({}, "", path);
    }
    setRoute(path);
    renderCurrentRoute();
}
export function initRouter() {
    const route = getRouteFromPath(window.location.pathname);
    setRoute(route);
    window.addEventListener("popstate", () => {
        const nextRoute = getRouteFromPath(window.location.pathname);
        setRoute(nextRoute);
        renderCurrentRoute();
    });
    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!target) {
            return;
        }
        const link = target.closest("[data-link]");
        if (!link) {
            return;
        }
        const href = link.getAttribute("href");
        if (!href) {
            return;
        }
        if (href.startsWith("http")) {
            return;
        }
        event.preventDefault();
        const route = getRouteFromPath(href);
        navigate(route);
    });
}
export function renderCurrentRoute() {
    const root = document.getElementById("app");
    if (!root) {
        return;
    }
    const state = getState();
    if (state.currentRoute === "/register") {
        renderRegistrationPage(root);
        return;
    }
    if (state.currentRoute === "/cart") {
        renderCartPage(root);
        return;
    }
    if (state.currentRoute === "/delivery") {
        renderDeliveryPage(root);
        return;
    }
    renderMainPage(root);
}
export function setProductFilters(filters) {
    const current = getState();
    updateState({
        productFilters: {
            ...current.productFilters,
            ...filters
        }
    });
}
