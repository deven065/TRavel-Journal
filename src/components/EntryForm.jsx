import { useState } from 'react'
import MediaUploader from './MediaUploader'
import { uploadFile } from '../firebase/firebaseService'
import '../styles/AdminPanel.css'

function EntryForm({ onSubmit, entryData = null, existingEntries = [] }) {
    const [formData, setFormData] = useState(entryData || {
        title: '',
        country: '',
        googleMapsLink: '',
        dates: '',
        text: '',
        photos: [],
        videos: []
    })
    const [isUploading, setIsUploading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleMediaUpdate = (type, media) => {
        setFormData(prev => ({
            ...prev,
            [type]: media
        }))
    }async (e) => {
        e.preventDefault()
        
        if (!formData.title || !formData.country || formData.photos.length === 0) {
            alert('Please fill in all required fields and add at least one photo!')
            return
        }

        setIsUploading(true)

        try {
            // Upload all photos that need uploading
            const uploadedPhotos = await Promise.all(
                formData.photos.map(async (photo) => {
                    if (photo.needsUpload && photo.file) {
                        const cloudUrl = await uploadFile(photo.file, 'photos')
                        return { ...photo, url: cloudUrl, needsUpload: false, file: null }
                    }
                    return photo
                })
            )

            // Upload all videos that need uploading
            const uploadedVideos = await Promise.all(
                formData.videos.map(async (video) => {
                    if (video.needsUpload && video.file) {
                        const cloudUrl = await uploadFile(video.file, 'videos')
                        return { ...video, url: cloudUrl, needsUpload: false, file: null }
                    }
                    return video
                })
            )

            const newEntry = {
                id: entryData?.id || Date.now(),
                img: {
                    src: uploadedPhotos[0].url,
                    alt: formData.title
                },
                title: formData.title,
                country: formData.country,
                googleMapsLink: formData.googleMapsLink,
                dates: formData.dates,
                text: formData.text,
                photos: uploadedPhotos,
                videos: uploadedVideos
            }

            await onSubmit(newEntry)
            
            if (!entryData) {
                setFormData({
                    title: '',
                    country: '',
                    googleMapsLink: '',
                    dates: '',
                    text: '',
                    photos: [],
                    videos: []
                })
            }
        } catch (error) {
            console.error('Error submitting entry:', error)
            alert('Error uploading files. Please check your Firebase configuration and try again.')
        } finally {
            setIsUploading(false   photos: [],
                videos: []
            })
        }
    }

    return (
        <form className="entry-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <h2>{entryData ? '✏️ Edit Entry' : '➕ Add New Entry'}</h2>
                
                <div className="form-group">
                    <label>Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Mount Fuji"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Country *</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="e.g., Japan"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Dates</label>
                        <input
                            type="text"
                            name="dates"
                            value={formData.dates}
                            onChange={handleChange}
                            placeholder="e.g., 12 Jan, 2021 - 24 Jan, 2021"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Google Maps Link</label>
                    <input
                        type="url"
                        name="googleMapsLink"
                        value={formData.googleMapsLink}
                        onChange={handleChange}
                        placeholder="https://maps.app.goo.gl/..."
                    />
                </div>
 disabled={isUploading}>
                {isUploading 
                    ? '⏳ Uploading to Cloud...' 
                    : (entryData ? '💾 Update Entry' : '✨ Create Entry')
                
                    <label>Description *</label>
                    <textarea
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        placeholder="Tell us about this amazing place..."
                        rows="4"
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <MediaUploader
                    type="photos"
                    media={formData.photos}
                    onUpdate={(photos) => handleMediaUpdate('photos', photos)}
                    required
                />
            </div>

            <div className="form-section">
                <MediaUploader
                    type="videos"
                    media={formData.videos}
                    onUpdate={(videos) => handleMediaUpdate('videos', videos)}
                />
            </div>

            <button type="submit" className="submit-btn">
                {entryData ? '💾 Update Entry' : '✨ Create Entry'}
            </button>
        </form>
    )
}

export default EntryForm
