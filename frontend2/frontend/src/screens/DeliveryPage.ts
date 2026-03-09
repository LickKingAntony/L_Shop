import { apiCreateDelivery, apiGetCart, apiGetDeliveries, apiLogout, apiMe } from "../api.js"
import { navigate } from "../router.js"
import { getState, updateState } from "../state.js"

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

export function renderDeliveryPage(root: HTMLElement): void {
  const state = getState()
  const container = document.createElement("div")
  container.className = "page"

  const header = createHeader()
  container.appendChild(header)

  const title = document.createElement("h1")
  title.textContent = "Оформление доставки"
  container.appendChild(title)

  const info = document.createElement("div")
  info.className = "info-box"

  if (!state.currentUser) {
    info.textContent = "Для оформления доставки нужно войти в аккаунт."
    container.appendChild(info)
    root.innerHTML = ""
    root.appendChild(container)
    return
  }

  if (state.cartItems.length === 0) {
    info.textContent = "В корзине нет товаров."
    container.appendChild(info)
    const link = document.createElement("a")
    link.href = "/"
    link.textContent = "Перейти к товарам"
    link.setAttribute("data-link", "true")
    container.appendChild(link)
    root.innerHTML = ""
    root.appendChild(container)
    void apiGetCart().then(items => {
      updateState({ cartItems: items })
    })
    return
  }

  const form = document.createElement("form")
  form.className = "card"
  form.setAttribute("data-delivery", "true")

  const addressInput = document.createElement("input")
  addressInput.type = "text"
  addressInput.name = "address"
  addressInput.placeholder = "Адрес"
  form.appendChild(addressInput)

  const phoneInput = document.createElement("input")
  phoneInput.type = "tel"
  phoneInput.name = "phone"
  phoneInput.placeholder = "Телефон"
  form.appendChild(phoneInput)

  const emailInput = document.createElement("input")
  emailInput.type = "email"
  emailInput.name = "email"
  emailInput.placeholder = "Email"
  form.appendChild(emailInput)

  const paymentSelect = document.createElement("select")
  paymentSelect.name = "paymentMethod"
  const paymentOptions = [
    { value: "", label: "Способ оплаты" },
    { value: "card", label: "Карта" },
    { value: "cash", label: "Наличными" }
  ]
  paymentOptions.forEach(optionData => {
    const option = document.createElement("option")
    option.value = optionData.value
    option.textContent = optionData.label
    paymentSelect.appendChild(option)
  })
  form.appendChild(paymentSelect)

  const errorText = document.createElement("div")
  errorText.className = "error-text"
  form.appendChild(errorText)

  const submitButton = document.createElement("button")
  submitButton.type = "submit"
  submitButton.textContent = "Оформить"
  form.appendChild(submitButton)

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault()
    errorText.textContent = ""
    const address = addressInput.value.trim()
    const phone = phoneInput.value.trim()
    const email = emailInput.value.trim()
    const paymentMethod = paymentSelect.value
    if (!address || !phone || !email || !paymentMethod) {
      errorText.textContent = "Заполните все поля"
      return
    }
    const delivery = await apiCreateDelivery({
      address,
      phone,
      email,
      paymentMethod
    })
    if (!delivery) {
      errorText.textContent = "Не удалось оформить доставку"
      return
    }
    const items = await apiGetCart()
    const deliveries = await apiGetDeliveries()
    updateState({
      cartItems: items,
      deliveries
    })
    navigate("/cart")
  })

  container.appendChild(form)

  const deliveriesBlock = document.createElement("div")
  deliveriesBlock.className = "deliveries-list"

  const deliveriesTitle = document.createElement("h2")
  deliveriesTitle.textContent = "Мои доставки"
  deliveriesBlock.appendChild(deliveriesTitle)

  if (state.deliveries.length === 0) {
    const empty = document.createElement("div")
    empty.textContent = "Пока нет доставок."
    deliveriesBlock.appendChild(empty)
  } else {
    state.deliveries.forEach(delivery => {
      const row = document.createElement("div")
      row.className = "delivery-row"
      const text = document.createElement("div")
      text.textContent = `${delivery.address} (${delivery.items.length} позиций)`
      row.appendChild(text)
      const time = document.createElement("div")
      time.textContent = new Date(delivery.createdAt).toLocaleString()
      row.appendChild(time)
      deliveriesBlock.appendChild(row)
    })
  }

  container.appendChild(deliveriesBlock)

  root.innerHTML = ""
  root.appendChild(container)

  void apiMe().then(user => {
    if (!user) {
      return
    }
    updateState({
      currentUser: user,
      deliveries: user.deliveries
    })
  })

  void apiGetDeliveries().then(deliveries => {
    updateState({ deliveries })
    renderDeliveryPage(root)
  })
}


