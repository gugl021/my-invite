import React, { useEffect } from "react";
import "./main.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { spisak } from "./spisak.js";
import { start } from "./pettles.js";

("use strict");

function App() {
  useEffect(() => start(), []);
  const name = spisak[location.hash.substring(2)]?.name;
  const gender = spisak[location.hash.substring(2)]?.gender;
  const isEnglish = Boolean(spisak[location.hash.substring(2)]?.english);
  const isSpanish = Boolean(spisak[location.hash.substring(2)]?.spanish);
  const isPlural = Boolean(spisak[location.hash.substring(2)]?.plural);
  const [data, setData] = React.useState(null);
  const [tempRSVP, setTempRSVP] = React.useState(null);
  //eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState(null);
  const post = React.useCallback(
    async (value) => {
      let req = new XMLHttpRequest();
      /*req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          debugger;
        }
      };*/
      req.open("PUT", "https://api.jsonbin.io/v3/b/668d00e6ad19ca34f88505b6", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-Master-Key", "$2a$10$Pu6vPXlvxXKLNX5C0gfLge5IRH9WHFnj3gm0DuXnvpiFgDF.mKVk2");
      req.send(JSON.stringify({ ...data, [location.hash.substring(2)]: value }));
    },
    [data]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch("https://api.jsonbin.io/v3/b/668d00e6ad19ca34f88505b6", {
        headers: {
          "X-MASTER-KEY": "$2a$10$Pu6vPXlvxXKLNX5C0gfLge5IRH9WHFnj3gm0DuXnvpiFgDF.mKVk2",
          "X-ACCESS-KEY": "$2a$10$BQ6uU9SmifziXVrwVgHcceSD1K0kvghMnRkaG4ECg/fE7yIzGNLjq",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result.record);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className={"green-wrapper column"}>
          <div className={"first"}>
            <div className={"center column greet"}>
              <h2 className={"color-cornsilk black-shadow Merriweather"}>
                {gender} {name}
              </h2>
              <div className={"center sub-greet color-cornsilk black-shadow Merriweather "}>
                <span className={"Merriweather"}>
                  {isEnglish
                    ? "We happily invite you to out wedding."
                    : isSpanish
                      ? "nos complace invitarlos a nuestra boda."
                      : `Sa radošću ${isPlural ? "vas" : "te"} pozivamo da ${isPlural ? "prisustvujete" : "prisustvuješ"} našem venčanju.`}
                </span>
              </div>
            </div>

            <div className={"names-wrapper"}>
              <h2 className={"names color-cornsilk black-shadow"}>Aleksandra</h2>
              <h2 className={"names color-cornsilk black-shadow"}>&</h2>
              <h2 className={"names color-cornsilk black-shadow"}>Goran</h2>
            </div>
            <div className={"center column color-cornsilk black-shadow Merriweather uppercase date-light"}>
              <span>Subota, 31. avgust 2024.</span>
              <span>Petrovaradinska tvrđava, Atelje 21</span>
            </div>
            <div className={"center column color-cornsilk black-shadow Merriweather time"}>
              <span>Okupljanje gostiju u 16h</span>
              <span>Čin sklapanja braka u 17:30</span>
            </div>
            <div className={"column rsvp-wrapper"}>
              <h3 className={"center color-cornsilk black-shadow Merriweather"}>
                {isEnglish ? "Please RSVP" : isSpanish ? "Por favor RSVP" : `Molimo vas da ${isPlural ? "potvrdite" : "potvrdiš"} dolazak do 10. avgusta`}
              </h3>
              <div className={"row rsvp"}>
                <div>
                  <input
                    onChange={async (event) => {
                      if (event.target.checked && data?.[location.hash.substring(2)] !== "da") {
                        setTempRSVP("da");
                        setData({ ...data, [location.hash.substring(2)]: "da" });
                        await post("da");
                        return fetchData();
                      }
                    }}
                    type="radio"
                    id="da"
                    name="drone"
                    value="da"
                    checked={tempRSVP === "da" ? true : data?.[location.hash.substring(2)] === "da"}
                  />
                  <label className={"Merriweather"} htmlFor="da">
                    {isEnglish ? "Yes" : isSpanish ? "Si" : "Da"}
                  </label>
                </div>
                <div>
                  <input
                    onChange={async (event) => {
                      if (event.target.checked && data?.[location.hash.substring(2)] !== "neodlučeni") {
                        setTempRSVP("neodlučeni");
                        setData({ ...data, [location.hash.substring(2)]: "neodlučeni" });
                        await post("neodlučeni");
                        return fetchData();
                      }
                    }}
                    type="radio"
                    id="neodlučeni"
                    name="drone"
                    value="neodlučeni"
                    checked={tempRSVP === "neodlučeni" ? true : data?.[location.hash.substring(2)] === "neodlučeni"}
                  />
                  <label className={"Merriweather"} htmlFor="neodlučeni">
                    {isEnglish ? "Undecided" : isSpanish ? "indeciso" : isPlural ? "Neodlučeni" : "Neodlučen"}
                  </label>
                </div>
                <div>
                  <input
                    onChange={async (event) => {
                      if (event.target.checked && data?.[location.hash.substring(2)] !== "ne") {
                        setTempRSVP("ne");
                        setData({ ...data, [location.hash.substring(2)]: "ne" });
                        await post("ne");
                        return fetchData();
                      }
                    }}
                    type="radio"
                    id="ne"
                    name="drone"
                    value="ne"
                    checked={tempRSVP === "ne" ? true : data?.[location.hash.substring(2)] === "ne"}
                  />
                  <label className={"Merriweather"} htmlFor="ne">
                    {isEnglish ? "No" : isSpanish ? "No" : "Ne"}
                  </label>
                </div>
              </div>
            </div>
            {/*<span style={{ color: "white" }}>{tempRSVP}</span>*/}
          </div>
          <div className={"map"}>
            <Map
              style={{ width: "100%", height: "300px" }}
              defaultCenter={{ lat: 45.2497041, lng: 19.8677662 }}
              defaultZoom={17}
              gestureHandling={"greedy"}
              disableDefaultUI={true}>
              <Marker onClick={() => window.open("https://maps.app.goo.gl/whn5pmcSryLUrjC59")} position={{ lat: 45.249519, lng: 19.869372 }} />
            </Map>
          </div>
        </div>
      </APIProvider>
    </>
  );
}

export default App;
