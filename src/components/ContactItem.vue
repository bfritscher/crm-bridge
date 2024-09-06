<template>
  <div class="contact">
    <div class="c-avatar" :style="avatarSizeObj">
      {{ avatarInitials }}
      <div
        v-if="contact.photo"
        class="c-photo"
        :style="`background-image: url('${contact.photo}')`"
      ></div>
    </div>
    <div class="c-content">
      <div class="ms-font-m">{{ contactName }}</div>
      <div v-if="!hideTitle" class="ms-font-s color-control-fg" v-html="formattedTitle"></div>
      <div v-if="!hideInfo" class="ms-font-xs color-control-fg" v-html="formattedInfo"></div>
    </div>
    <a
      v-if="contact.url"
      :href="contact.url"
      target="_blank"
      class="color-control-fg"
      @click.stop=""
    >
      <i class="ms-Icon ms-Icon--OpenInNewTab"></i>
    </a>
    <a v-if="contact.isNotFound" href="#" class="color-control-fg" @click.stop="addContact">
      <i class="ms-Icon ms-Icon--AddFriend"></i>
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  },
  hideTitle: {
    type: Boolean,
    default: false
  },
  hideInfo: {
    type: Boolean,
    default: false
  },
  avatarSize: {
    type: String,
    default: '32px'
  }
})

const avatarSizeObj = computed(() => {
  return { width: props.avatarSize, height: props.avatarSize }
})

const firstname = computed(() => {
  if (!props.contact.firstname && !props.contact.lastname) {
    const parts = props.contact.displayName.split(' ')
    return parts[0]
  }
  return props.contact.firstname
})

const lastname = computed(() => {
  if (!props.contact.firstname && !props.contact.lastname) {
    const parts = props.contact.displayName.split(' ')
    if (parts.length > 1) {
      return parts[parts.length - 1]
    }
    return ''
  }
  return props.contact.lastname
})

const contactName = computed(() => {
  return props.contact.isLoading ? props.contact.email : `${firstname.value} ${lastname.value}`
})

const formattedTitle = computed(() => {
  return props.contact.isLoading
    ? 'Loading...'
    : props.contact.isNotFound
      ? props.contact.email
      : props.contact.title || ''
})

const avatarInitials = computed(() => {
  return (
    ((firstname.value && firstname.value[0].toUpperCase()) || '') +
    ((lastname.value && lastname.value[0].toUpperCase()) || '')
  )
})

const formattedInfo = computed(() => {
  return nl2br(props.contact.info || '')
})

function nl2br(text) {
  return text ? text.replace(/\n/g, '<br>') : ''
}

function addContact() {
  // todo display services dropdown
  props.contact.isNotFound = false
}
</script>
<style scoped>
.color-control-fg {
  color: var(--control-fg-color);
}
.color-control-fg:hover {
  color: var(--body-fg-color);
}
.color-body-fg {
  color: var(--body-fg-color);
}
.contact {
  padding: 8px;
  display: flex;
}
.contact:hover {
  color: var(--control-fg-color);
  background-color: var(--control-bg-color);
}
.c-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  color: #bcc3c7;
  background-color: #3b4447;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
}

.c-photo {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: absolute;
  background-repeat: no-repeat;
}

.c-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.c-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
