import Header from "./components/Header"
import Entry from "./components/Entry"
import data from "./data"

function App() {

  const entryElements = data.map((entry)=>{
    return (
      <Entry 
      id={entry.id}
      img={entry.img} // or we can use {...entry} it will directly override the default entry element for the entry element itself and we don't need to img,title,country,googleMapsLink,dates,text
      title={entry.title}
      country={entry.country}
      googleMapsLink={entry.googleMapsLink}
      dates={entry.dates}
      text={entry.text}
      />
    )
  })

  return (
    <>
      <Header />
      <main className="container">
        {entryElements}
      </main>
    </>
  )
}

export default App;