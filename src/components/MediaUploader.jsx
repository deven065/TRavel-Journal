import { useState } from 'react'
import heic2any from 'heic2any'
import '../styles/AdminPanel.css'

function MediaUploader({ type, media = [], onUpdate, required = false }) {
    const [urlInput, setUrlInput] = useState('')
    const [nameInput, setNameInput] = useState('')
    const [isConverting, setIsConverting] = useState(false)

    const handleAddMedia = () => {
        if (!urlInput.trim()) {
            alert(`Please enter a ${type === 'photos' ? 'photo' : 'video'} URL`)
            return
        }

        const newMedia = {
            id: Date.now(),
            url: urlInput,
            name: nameInput || `${type === 'photos' ? 'Photo' : 'Video'} ${media.length + 1}`
        }

        onUpdate([...media, newMedia])
        setUrlInput('')
        setNameInput('')
    }

    const handleRemoveMedia = (id) => {
        onUpdate(media.filter(item => item.id !== id))
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setIsConverting(true)
            let processedFile = file
            let fileName = file.name

            // Convert HEIC to JPEG if needed
            if (type === 'photos' && (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic'))) {
                try {
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 1 // Maximum quality
                    })
                    processedFile = new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), { 
                        type: 'image/jpeg' 
                    })
                    fileName = file.name.replace(/\.heic$/i, '.jpg')
                } catch (error) {
                    console.error('HEIC conversion error:', error)
                    alert('Error converting HEIC image. Please try a different image.')
                    setIsConverting(false)
                    return
                }
            }

            // Create a local URL with maximum quality (will be uploaded to cloud when saving)
            const localUrl = URL.createObjectURL(processedFile)
            const newMedia = {
                id: Date.now(),
                url: localUrl,
                name: nameInput || fileName,
                file: processedFile,
                originalFormat: file.type || 'unknown',
                needsUpload: true // Flag to indicate this needs cloud upload
            }
            
            onUpdate([...media, newMedia])
            setNameInput('')
            setIsConverting(false)
        } catch (error) {
            console.error('File upload error:', error)
            alert('Error uploading file. Please try again.')
            setIsConverting(false)
        }
        
        // Reset the input
        e.target.value = ''
    }

    return (
        <div className="media-uploader">
            <h3>
                {type === 'photos' ? '📸 Photos' : '🎬 Videos'} 
                {required && <span className="required"> *</span>}
            </h3>
            
            <div className="media-input-group">
                <div className="input-row">
                    <input
                        type="text"
                        placeholder={`${type === 'photos' ? 'Photo' : 'Video'} name (optional)`}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="media-name-input"
                    />
                    <input
                        type="url"
                        placeholder={`Enter ${type === 'photos' ? 'image' : 'video'} URL or upload below`}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="media-url-input"
                    />
                    <button 
                        type="button" 
                        onClick={handleAddMedia}
                        className="add-media-btn"
                    >
                        ➕ Add
                    </button>
                </div>

                <div className="file-upload-section">
                    <label className="file-upload-btn">
                        {isConverting ? '⏳ Converting...' : '📁 Upload from iPhone/Computer'}
                        <input
                            type="file"
                            accept={type === 'photos' ? 'image/*,.heic,.heif' : 'video/*,.mp4,.mov,.avi,.mkv,.wmv,.flv,.webm'}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            disabled={isConverting}
                        />
                    </label>
                    <span className="file-hint">
                        {type === 'photos' 
                            ? '✅ HEIC, JPG, PNG, WEBP supported - Full Quality' 
                            : '✅ MP4, MOV, AVI, MKV, WMV supported - Full Quality'}
                    </span>
                </div>
            </div>

            {media.length > 0 && (
                <div className="media-preview-grid">
                    {media.map((item, index) => (
                        <div key={item.id} className="media-preview-item">
                            {type === 'photos' ? (
                                <img src={item.url} alt={item.name} />
                            ) : (
                                <video src={item.url} controls />
                            )}
                            <div className="media-preview-overlay">
                                <span className="media-name">{item.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMedia(item.id)}
                                    className="remove-media-btn"
                                >
                                    🗑️
                                </button>
                            </div>
                            {index === 0 && type === 'photos' && (
                                <span className="primary-badge">Main Photo</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {media.length === 0 && required && (
                <p className="no-media-hint">
                    ⚠️ Please add at least one {type === 'photos' ? 'photo' : 'video'}
                </p>
            )}
        </div>
    )
}

export default MediaUploader
