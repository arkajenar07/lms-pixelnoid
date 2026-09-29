/**
 * Mengompresi file gambar ke format WebP dengan batas ukuran tertentu (default 150 KB).
 */
export async function compressImageToWebP(
  file: File,
  maxSizeBytes: number = 150 * 1024
): Promise<{ file: File; originalSize: number; compressedSize: number; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar valid.'))
    }

    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)

      try {
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height

        // Batasi dimensi awal jika foto sangat besar (kamera HP 4K/48MP)
        const MAX_INITIAL_DIM = 1600
        if (width > MAX_INITIAL_DIM || height > MAX_INITIAL_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_INITIAL_DIM) / width)
            width = MAX_INITIAL_DIM
          } else {
            width = Math.round((width * MAX_INITIAL_DIM) / height)
            height = MAX_INITIAL_DIM
          }
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          return reject(new Error('Gagal menginisialisasi canvas untuk kompresi gambar.'))
        }

        let quality = 0.85
        let blob: Blob | null = null
        let attempts = 0
        const maxAttempts = 12

        while (attempts < maxAttempts) {
          canvas.width = width
          canvas.height = height

          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          blob = await new Promise<Blob | null>((res) => {
            canvas.toBlob((b) => res(b), 'image/webp', quality)
          })

          if (!blob) {
            return reject(new Error('Gagal mengonversi gambar ke format WebP.'))
          }

          // Berhenti jika ukuran sudah memenuhi target <= maxSizeBytes
          if (blob.size <= maxSizeBytes) {
            break
          }

          // Turunkan kualitas bertahap
          if (quality > 0.45) {
            quality = Math.max(0.4, quality - 0.12)
          } else {
            // Jika kualitas sudah rendah, kecilkan dimensi canvas
            width = Math.round(width * 0.82)
            height = Math.round(height * 0.82)
            quality = 0.75
          }

          attempts++
        }

        if (!blob) {
          return reject(new Error('Gagal menghasilkan file WebP.'))
        }

        // Buat file baru dengan nama berekstensi .webp
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        const webpFile = new File([blob], `${baseName}.webp`, {
          type: 'image/webp',
          lastModified: Date.now()
        })

        // Buat Data URL untuk preview instan
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            file: webpFile,
            originalSize: file.size,
            compressedSize: webpFile.size,
            dataUrl: reader.result as string
          })
        }
        reader.onerror = () => {
          resolve({
            file: webpFile,
            originalSize: file.size,
            compressedSize: webpFile.size,
            dataUrl: ''
          })
        }
        reader.readAsDataURL(blob)

      } catch (err) {
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Gagal membaca gambar yang diunggah.'))
    }

    img.src = objectUrl
  })
}
