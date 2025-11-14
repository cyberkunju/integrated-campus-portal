import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function ImageCropper({ onImageCropped, onCancel }) {
  const [imageSrc, setImageSrc] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageSrc(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const cropToCircle = () => {
    const image = imageRef.current
    const canvas = canvasRef.current
    
    if (!image || !canvas) return

    const size = 400 // Output size
    canvas.width = size
    canvas.height = size
    
    const ctx = canvas.getContext('2d')
    
    // Calculate crop dimensions (square from center)
    const minDim = Math.min(image.naturalWidth, image.naturalHeight)
    const sx = (image.naturalWidth - minDim) / 2
    const sy = (image.naturalHeight - minDim) / 2
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size)
    
    // Create circular clipping path
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    
    // Draw image centered and scaled
    ctx.drawImage(image, sx, sy, minDim, minDim, 0, 0, size, size)
    
    // Store the data URL for preview
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCroppedImage(dataUrl)
  }

  const handleConfirm = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas not found')
      return
    }
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('Blob created successfully:', blob.size, 'bytes')
        
        // Create a File object from blob with proper filename and extension
        const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' })
        
        if (onImageCropped) {
          onImageCropped(file)
        }
      } else {
        console.error('Failed to create blob from canvas')
        alert('Failed to process image. Please try again.')
      }
    }, 'image/jpeg', 0.9)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
        >
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Crop Profile Photo
          </h3>
          
          {!imageSrc ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <i className="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Select an image to crop
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold cursor-pointer inline-block"
              >
                Choose Image
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-8">
                {/* Original Image Preview */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Original</p>
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                      ref={imageRef}
                      src={imageSrc}
                      alt="Original"
                      className="w-full h-full object-cover"
                      onLoad={cropToCircle}
                    />
                  </div>
                </div>
                
                {/* Arrow */}
                <i className="fas fa-arrow-right text-3xl text-gray-400"></i>
                
                {/* Cropped Preview */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Preview</p>
                  {croppedImage ? (
                    <img
                      src={croppedImage}
                      alt="Cropped"
                      className="w-48 h-48 rounded-full border-4 border-blue-500 object-cover"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-full border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hidden canvas for processing */}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Buttons */}
              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setImageSrc(null)
                    setCroppedImage(null)
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-slate-800 dark:text-white rounded-lg font-semibold"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!croppedImage}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use This Photo
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
