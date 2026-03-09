import { apiAddToCart, apiGetProducts, apiLogout, apiMe } from "../api.js"
import { navigate } from "../router.js"
import { getState, setState, updateState } from "../state.js"
import { Product } from "../types"

function createHeader(): HTMLElement {
  const header = document.createElement("header")
  header.className = "header"

  const title = document.createElement("div")
  title.className = "logo"
  title.textContent = "L_Shop"
  header.appendChild(title)

  const nav = document.createElement("nav")
  nav.className = "nav"

  const mainLink = document.createElement("a")
  mainLink.href = "/"
  mainLink.textContent = "Товары"
  mainLink.setAttribute("data-link", "true")
  nav.appendChild(mainLink)

  const cartLink = document.createElement("a")
  cartLink.href = "/cart"
  cartLink.textContent = "Корзина"
  cartLink.setAttribute("data-link", "true")
  nav.appendChild(cartLink)

  const deliveryLink = document.createElement("a")
  deliveryLink.href = "/delivery"
  deliveryLink.textContent = "Доставка"
  deliveryLink.setAttribute("data-link", "true")
  nav.appendChild(deliveryLink)

  const state = getState()
  if (state.currentUser) {
    const logoutLink = document.createElement("a")
    logoutLink.href = "/"
    logoutLink.textContent = "Выйти"
    logoutLink.addEventListener("click", async event => {
      event.preventDefault()
      await apiLogout()
      updateState({
        currentUser: null,
        cartItems: [],
        deliveries: []
      })
      navigate("/")
    })
    nav.appendChild(logoutLink)
  } else {
    const authLink = document.createElement("a")
    authLink.href = "/register"
    authLink.textContent = "Войти"
    authLink.setAttribute("data-link", "true")
    nav.appendChild(authLink)
  }

  header.appendChild(nav)
  return header
}

function createFilters(): HTMLElement {
  const state = getState()
  const wrapper = document.createElement("div")
  wrapper.className = "filters"

  const searchInput = document.createElement("input")
  searchInput.type = "text"
  searchInput.placeholder = "Поиск по названию или описанию"
  searchInput.value = state.productFilters.search
  wrapper.appendChild(searchInput)

  const categorySelect = document.createElement("select")
  const categories = [
    { value: "", label: "Все категории" },
    { value: "electronics", label: "Электроника" },
    { value: "clothes", label: "Одежда" },
    { value: "food", label: "Еда" },
    { value: "other", label: "Другое" }
  ]
  categories.forEach(optionData => {
    const option = document.createElement("option")
    option.value = optionData.value
    option.textContent = optionData.label
    if (state.productFilters.category === optionData.value) {
      option.selected = true
    }
    categorySelect.appendChild(option)
  })
  wrapper.appendChild(categorySelect)

  const availableSelect = document.createElement("select")
  const availableOptions = [
    { value: "", label: "Все товары" },
    { value: "true", label: "В наличии" },
    { value: "false", label: "Нет в наличии" }
  ]
  availableOptions.forEach(optionData => {
    const option = document.createElement("option")
    option.value = optionData.value
    option.textContent = optionData.label
    if (state.productFilters.available === optionData.value) {
      option.selected = true
    }
    availableSelect.appendChild(option)
  })
  wrapper.appendChild(availableSelect)

  const sortSelect = document.createElement("select")
  const sortOptions = [
    { value: "", label: "Без сортировки" },
    { value: "price_asc", label: "Цена по возрастанию" },
    { value: "price_desc", label: "Цена по убыванию" }
  ]
  sortOptions.forEach(optionData => {
    const option = document.createElement("option")
    option.value = optionData.value
    option.textContent = optionData.label
    if (state.productFilters.sort === optionData.value) {
      option.selected = true
    }
    sortSelect.appendChild(option)
  })
  wrapper.appendChild(sortSelect)

  const applyButton = document.createElement("button")
  applyButton.textContent = "Применить"
  wrapper.appendChild(applyButton)

  applyButton.addEventListener("click", async () => {
    const nextFilters = {
      search: searchInput.value.trim(),
      category: categorySelect.value,
      available: availableSelect.value,
      sort: sortSelect.value
    }
    updateState({
      productFilters: nextFilters
    })
    const products = await apiGetProducts(nextFilters)
    updateState({ products })
    navigate("/")
  })

  return wrapper
}

function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("div")
  card.className = "product-card"

  const title = document.createElement("div")
  title.className = "product-title"
  title.textContent = product.title
  title.setAttribute("data-title", product.title)
  card.appendChild(title)

  const description = document.createElement("div")
  description.className = "product-description"
  description.textContent = product.description
  card.appendChild(description)

  const price = document.createElement("div")
  price.className = "product-price"
  price.textContent = `${product.price} BYN`
  price.setAttribute("data-price", String(product.price))
  card.appendChild(price)

  const meta = document.createElement("div")
  meta.className = "product-meta"
  const categorySpan = document.createElement("span")
  categorySpan.textContent = product.category
  meta.appendChild(categorySpan)
  const availableSpan = document.createElement("span")
  availableSpan.textContent = product.available ? "В наличии" : "Нет в наличии"
  meta.appendChild(availableSpan)
  card.appendChild(meta)

  const controls = document.createElement("div")
  controls.className = "product-controls"

  const quantityInput = document.createElement("input")
  quantityInput.type = "number"
  quantityInput.min = "1"
  quantityInput.value = "1"
  controls.appendChild(quantityInput)

  const button = document.createElement("button")
  button.textContent = "В корзину"
  controls.appendChild(button)

  const state = getState()
  const canUseCart = Boolean(state.currentUser)
  if (!canUseCart) {
    button.disabled = true
    button.textContent = "Войдите, чтобы добавить"
  } else if (!product.available) {
    button.disabled = true
    button.textContent = "Нет в наличии"
  }

  button.addEventListener("click", async () => {
    const quantityValue = Number(quantityInput.value)
    if (!quantityValue || quantityValue <= 0) {
      return
    }
    const items = await apiAddToCart(product.id, quantityValue)
    if (!items) {
      return
    }
    updateState({ cartItems: items })
  })

  card.appendChild(controls)

  return card
}

export function renderMainPage(root: HTMLElement): void {
  const container = document.createElement("div")
  container.className = "page"

  const header = createHeader()
  container.appendChild(header)

  const filters = createFilters()
  container.appendChild(filters)

  const list = document.createElement("div")
  list.className = "products-grid"

  const state = getState()
  if (state.products.length === 0) {
    const loading = document.createElement("div")
    loading.textContent = "Загрузка товаров..."
    list.appendChild(loading)
  } else {
    state.products.forEach(product => {
      const card = createProductCard(product)
      list.appendChild(card)
    })
  }

  container.appendChild(list)

  root.innerHTML = ""
  root.appendChild(container)

  void apiMe().then(user => {
    if (!user) {
      return
    }
    setState({
      ...getState(),
      currentUser: user,
      cartItems: user.cartItems,
      deliveries: user.deliveries
    })
  })

  if (state.products.length === 0) {
    void apiGetProducts(state.productFilters).then(products => {
      updateState({ products })
      renderMainPage(root)
    })
  }
}


