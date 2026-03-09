const apiBase = "/api";
export async function apiRegister(body) {
    try {
        const response = await fetch(`${apiBase}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.user;
    }
    catch {
        return null;
    }
}
export async function apiLogin(body) {
    try {
        const response = await fetch(`${apiBase}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.user;
    }
    catch {
        return null;
    }
}
export async function apiLogout() {
    try {
        await fetch(`${apiBase}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });
    }
    catch {
    }
}
export async function apiMe() {
    try {
        const response = await fetch(`${apiBase}/auth/me`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.user;
    }
    catch {
        return null;
    }
}
export async function apiGetProducts(query) {
    try {
        const params = new URLSearchParams();
        if (query.search) {
            params.set("search", query.search);
        }
        if (query.category) {
            params.set("category", query.category);
        }
        if (query.available) {
            params.set("available", query.available);
        }
        if (query.sort) {
            params.set("sort", query.sort);
        }
        const queryString = params.toString();
        const url = queryString ? `${apiBase}/products?${queryString}` : `${apiBase}/products`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            return [];
        }
        const data = (await response.json());
        return data.products;
    }
    catch {
        return [];
    }
}
export async function apiGetCart() {
    try {
        const response = await fetch(`${apiBase}/cart`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            return [];
        }
        const data = (await response.json());
        return data.items;
    }
    catch {
        return [];
    }
}
export async function apiAddToCart(productId, quantity) {
    try {
        const response = await fetch(`${apiBase}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ productId, quantity })
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.items;
    }
    catch {
        return null;
    }
}
export async function apiUpdateCartItem(productId, quantity) {
    try {
        const response = await fetch(`${apiBase}/cart/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ quantity })
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.items;
    }
    catch {
        return null;
    }
}
export async function apiRemoveCartItem(productId) {
    try {
        const response = await fetch(`${apiBase}/cart/${productId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.items;
    }
    catch {
        return null;
    }
}
export async function apiGetDeliveries() {
    try {
        const response = await fetch(`${apiBase}/deliveries`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            return [];
        }
        const data = (await response.json());
        return data.deliveries;
    }
    catch {
        return [];
    }
}
export async function apiCreateDelivery(body) {
    try {
        const response = await fetch(`${apiBase}/deliveries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            return null;
        }
        const data = (await response.json());
        return data.delivery;
    }
    catch {
        return null;
    }
}
