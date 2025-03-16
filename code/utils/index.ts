export const defaultDateFormat = 'dd/MM/yyyy HH:mm:ss'

export const vPress = {
  mounted: (el: HTMLElement, binding: { value: {
    click?: () => void
    dblclick?: () => void
  } }) => {
    let pressTimer: NodeJS.Timeout
    let pressCounter = 0
    el.addEventListener('mousedown', () => {
      const val = binding.value
      pressCounter++
      if (pressCounter === 1) {
        pressTimer = setTimeout(() => {
          if (typeof val.click === 'function')
            val.click()
          clearTimeout(pressTimer)
          pressCounter = 0
        }, 250)
      }
      if (pressCounter === 2) {
        pressCounter = 0
        if (typeof val.dblclick === 'function')
          val.dblclick()
        clearTimeout(pressTimer)
      }
    })
  },
}

export async function generateThumbnail(f: File, width: number, height: number): Promise<File | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    const elem = document.createElement('canvas')
    const ctx = elem.getContext('2d')
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scaleRatio = Math.min(width, height) / Math.max(img.width, img.height)
        width = img.width * scaleRatio
        height = img.height * scaleRatio

        elem.width = width
        elem.height = height

        ctx.drawImage(img, 0, 0, width, height)
        elem.toBlob((blob) => {
          if (!blob)
            return resolve(null)
          resolve(new File([blob], f.name, { type: f.type }))
        })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(f)
  })
}
