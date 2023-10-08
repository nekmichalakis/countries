import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {

  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
        console.log(`ran axios`)
      })
  }, [])

  useEffect(() => {
    console.log(`ran use effect`)
    if (search) {
      setFilteredCountries(allCountries.filter(c => c.name.common.toUpperCase().includes(search.toUpperCase())))
    }
    else {
      setFilteredCountries(allCountries)
    }
  }, [search])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (country) => {
    setFilteredCountries([country])
  }
  
  return (
    <>
      <div>
        find countries
        <input value={search} onChange={handleSearch}></input>
      </div>
      <Countries filteredCountries={filteredCountries} handleShow={handleShow} />
    </>
  )
}

const Countries = ({filteredCountries, handleShow}) => {

  console.log(filteredCountries)

  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (filteredCountries.length === 1) {
    return <CountryView country={filteredCountries[0]} />
  }
  return (
    <div>
      {filteredCountries.map((c, i) => 
        <div key={i}>
          {c.name.common} <button onClick={() => handleShow(c)}>show</button>
        </div>
      )}
    </div>
  )
}

const CountryView = ({country}) => {

  const api_key = import.meta.env.VITE_WEATHER_KEY
  const [weatherObject, setWeatherObject] = useState()

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&APPID=${api_key}`)
      .then(response => {
        setWeatherObject(response.data)
      })
  }, [])

  console.log(weatherObject)

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map((lang, i) => 
          <li key={i}>{lang}</li>
        )}
      </ul>
      <div>
        <img src={country.flags.png} />
      </div>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {(weatherObject?.main.temp - 273.15).toFixed(2)} Celcius</div>
      <div>
        <img src={`https://openweathermap.org/img/wn/${weatherObject?.weather[0].icon}@2x.png`} />
      </div>
      <div>wind {weatherObject?.wind.speed} m/s</div>
    </div>
  )
} 

export default App
