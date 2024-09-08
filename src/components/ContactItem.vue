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
    <div v-if="contact._meta?.external_url">
      <a
        :href="contact._meta.external_url"
        target="_blank"
        class="color-control-fg button"
        @click.stop=""
      >
        <i class="ms-Icon ms-Icon--OpenInNewTab"></i>
      </a>
    </div>
    <menu-button
      v-if="contact.isNotFound"
      :options="getCreateOptions()"
      @select="($event) => mainStore.addContact($event, contact)"
    >
      <i class="ms-Icon ms-Icon--AddFriend"></i>
    </menu-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { stripHtml, nl2br } from '@/utils'
import { getCreateOptions } from '@/stores/config'
import { useMainStore } from '@/stores/main'
import MenuButton from './MenuButton.vue'

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

const mainStore = useMainStore()

const avatarSizeObj = computed(() => {
  return { width: props.avatarSize, height: props.avatarSize }
})

const contactName = computed(() => {
  return `${props.contact.firstname} ${props.contact.lastname}`
})

const formattedTitle = computed(() => {
  return props.contact.isLoading
    ? 'Loading...'
    : stripHtml(props.contact.isNotFound ? props.contact.email : props.contact.title || '')
})

const avatarInitials = computed(() => {
  return (
    ((props.contact.firstname && props.contact.firstname[0].toUpperCase()) || '') +
    ((props.contact.lastname && props.contact.lastname[0].toUpperCase()) || '')
  )
})

const formattedInfo = computed(() => {
  return nl2br(stripHtml(props.contact.info || ''))
})
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
