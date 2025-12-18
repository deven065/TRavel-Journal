function Entry(props) {
    return (
        <article className="journal-entry">
            <div className="main-image-container">
                <img className="main-image" 
                    src={props.img.src} 
                    alt={props.img.alt}
                />
            </div>
            <div className="info-container">
                <div className="location-info">
                    <img className="Marker"
                        src="marker.png" 
                        alt="map marker icon"
                    />
                    <span className="country">{props.country}</span>
                    <a href={props.googleMapsLink} target="_blank" rel="noopener noreferrer">
                        View on Google Maps
                    </a>
                </div>
                <h2 className="entry-title">{props.title}</h2>
                <p className="entry-dates">{props.dates}</p>
                <p className="entry-text">{props.text}</p>
            </div>
        </article>
    )
}

export default Entry;