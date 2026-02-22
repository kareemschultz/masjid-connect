export async function shareOrCopy(data: { title: string; text: string }): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  try {
    if (navigator.share) {
      await navigator.share(data)
      return true
    }
    await navigator.clipboard.writeText(data.text)
    return true
  } catch {
    try {
      await navigator.clipboard.writeText(data.text)
      return true
    } catch {
      return false
    }
  }
}
