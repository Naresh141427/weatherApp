import { useState, useEffect, CSSPropertiest } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import search_icon from "../../assets/search.png";
import clear_icon from "../../assets/clear.png";
import cloud_icon from "../../assets/cloud.png";
import drizzle_icon from "../../assets/drizzle.png";
import rain_icon from "../../assets/rain.png";
import snow_icon from "../../assets/snow.png";
import wind_icon from "../../assets/wind.png";
import humidity_icon from "../../assets/humidity.png";

import "./weather.styles.css";

const WeatherApp = () => {
  let [loading, setLoading] = useState(true);
  const [weatherIcon, setWeatherIcon] = useState(clear_icon);
  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState(null);
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const apiKey = "714edf573d64f3d2b8d0192666fc82db";

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const response = await fetch("https://api.ipify.org");
      const ip = await response.text();
      getCurrentLocation(ip);
    } catch (error) {
      console.error("Error fetching user's IP address:", error);
    }
  };

  const getCurrentLocation = async (ip) => {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      if (data.status !== "success")
        throw new Error("Cannot finding the Location");
      fecthWeatherData(data.city);
    } catch (error) {
      console.error("Error while getting the location", error);
    }
  };

  const fecthWeatherData = async (location) => {
    if (!location) return;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === "404") {
      alert(data.message);
      return;
    }

    try {
      const {
        main: { humidity, temp },
        wind: { speed },
        name,
        weather: [{ icon }],
      } = data;

      switch (icon) {
        case "01d":
        case "01n":
          setWeatherIcon(clear_icon);
          break;
        case "02d":
        case "02n":
          setWeatherIcon(cloud_icon);
          break;
        case "03d":
        case "03n":
        case "04d":
        case "04n":
          setWeatherIcon(drizzle_icon);
          break;
        case "09d":
        case "09n":
        case "10d":
        case "10n":
          setWeatherIcon(rain_icon);
          break;
        case "13d":
        case "13n":
          setWeatherIcon(snow_icon);
          break;
        default:
          setWeatherIcon(clear_icon);
      }
      setLoading(false);
      setHumidity(humidity);
      setTemp(temp);
      setWind(speed);
      setCity(name);
      setSearchText("");
    } catch (e) {
      console.lod(`Error while searching: ${e.message}`);
    }
  };

  const handlingSearchClick = () => {
    fecthWeatherData(searchText);
  };

  const handlingSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const renderLoader = () => (
    <div className="loader-container">
      <BeatLoader color="yellow" />
    </div>
  );

  const renderWeatherUi = () => (
    <>
      <div className="search-container">
        <input
          type="text"
          className="city-input"
          placeholder="Searh City"
          onChange={handlingSearchText}
          value={searchText}
        />
        <div className="search-icon" onClick={handlingSearchClick}>
          <img src={search_icon} alt="searchIcon" />
        </div>
      </div>
      <div className="weather-image">
        <img src={weatherIcon} alt="cloudIcon" />
      </div>

      <div className="weather-temp">{temp}°c</div>
      <div className="weather-loaction">{city}</div>

      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="" className="icon" />
          <div className="data">
            <div className="wind-speed">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <div className="weather-container">
      {loading ? renderLoader() : renderWeatherUi()}
    </div>
  );
};

export default WeatherApp;
