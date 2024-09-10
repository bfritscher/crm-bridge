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
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item[type].addAsync(emailArray, (asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
        resolve()
      } else {
        reject(asyncResult.error)
      }
    })
  })
}
