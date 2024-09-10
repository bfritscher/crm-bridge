<template>
  <div class="dropdown" ref="dropdown">
    <button
      @click.stop="toggleDropdown"
      class="dropdown-button"
      :aria-expanded="isOpen ? 'true' : 'false'"
    >
      <slot></slot>
    </button>
    <div v-if="isOpen" class="dropdown-menu">
      <ul>
        <li
          v-for="option in options"
          :key="option"
          @click.stop="selectOption(option)"
          class="dropdown-item"
        >
          {{ option.label ?? option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true
  }
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const dropdown = ref(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  isOpen.value = false // close dropdown after selection
  emit('select', option) // emit the selected event
}

function handleClickOutside(event) {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-button {
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.dropdown-menu {
  margin-top: 5px;
  position: absolute;
  right: 0;
  left: auto;
  min-width: 150px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: var(--neutralPrimarySurface);
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--neutralSecondarySurface);
}
</style>
