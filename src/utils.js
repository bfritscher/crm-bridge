import { useMainStore } from './stores/main'

export function nl2br(text) {
  return text ? text.replace(/\n/g, '<br>') : ''
}

export function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export function debounce(fn, wait) {
  let timeout
  return function () {
    clearTimeout(timeout)
    const args = arguments
    const that = this
    timeout = setTimeout(function () {
      fn.apply(that, args)
    }, wait)
  }
}

export function getMailRecipients(type) {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item[type].getAsync((asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
        resolve(asyncResult.value)
      } else {
        reject(asyncResult.error)
      }
    })
  })
}

export function setMailRecipients(type, emailArray) {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item[type].setAsync(emailArray, (asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
        resolve()
      } else {
        reject(asyncResult.error)
      }
    })
  })
}

export function addMailRecipients(type, emailArray) {
  const mainStore = useMainStore()
  if (mainStore.isOutlook) {
    return new Promise((resolve, reject) => {
      Office.context.mailbox.item[type].addAsync(emailArray, (asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          resolve()
        } else {
          reject(asyncResult.error)
        }
      })
    })
  } else {
    return new Promise((resolve) => {
      sendEmail(emailArray, '', '')
      resolve()
    })
  }
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sendEmail(recipients, subject, body) {
  // Construct the mailto URL with displayName and emailAddress
  const mailtoUrl =
    `mailto:${recipients.map((recipient) => `${encodeURIComponent(recipient.displayName)} <${recipient.emailAddress}>`).join(',')}` +
    `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  // Create an anchor element
  const anchor = document.createElement('a')
  anchor.href = mailtoUrl

  // Append the anchor to the document body
  document.body.appendChild(anchor)

  // Simulate a click on the anchor
  anchor.click()

  // Remove the anchor from the document body
  document.body.removeChild(anchor)
}
