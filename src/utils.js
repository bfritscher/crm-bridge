export function nl2br(text) {
  return text ? text.replace(/\n/g, '<br>') : ''
}

export function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}
