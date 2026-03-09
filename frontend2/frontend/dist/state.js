const initialState = {
    currentUser: null,
    products: [],
    cartItems: [],
    deliveries: [],
    currentRoute: "/",
    productFilters: {
        search: "",
        category: "",
        available: "",
        sort: ""
    }
};
let state = initialState;
export function getState() {
    return state;
}
export function setState(next) {
    state = next;
}
export function updateState(partial) {
    state = {
        ...state,
        ...partial
    };
}
export function setRoute(route) {
    state = {
        ...state,
        currentRoute: route
    };
}
