import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const count = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  function addItem(artwork) {
    const existing = items.value.find((item) => item.id === artwork.id)

    if (existing) {
      existing.quantity += 1
      return
    }

    items.value.push({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      image: artwork.image,
      quantity: 1,
    })
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function clearCart() {
    items.value = []
  }

  return { items, count, subtotal, addItem, removeItem, clearCart }
})
