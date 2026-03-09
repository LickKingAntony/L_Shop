import { apiGetCart, apiGetDeliveries, apiGetProducts, apiMe } from "./api.js"
import { initRouter, renderCurrentRoute } from "./router.js"
import { getState, setState } from "./state.js"

async function bootstrap(): Promise<void> {
  initRouter()
  renderCurrentRoute()
  const user = await apiMe()
  if (user) {
    const cartItems = await apiGetCart()
    const deliveries = await apiGetDeliveries()
    setState({
      ...getState(),
      currentUser: user,
      cartItems,
      deliveries
    })
  }
  const products = await apiGetProducts(getState().productFilters)
  setState({
    ...getState(),
    products
  })
  renderCurrentRoute()
}

void bootstrap()


