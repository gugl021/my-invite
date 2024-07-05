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
  //eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState(null);
  const post = React.useCallback(
    async (value) =>
      fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, [location.hash.substring(2)]: value }),
      }),
    [data]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  /*React.useEffect(() => console.log(rsvp), [rsvp]);
   */
  React.useEffect(() => {
    fetchData();
  }, []);
  // React.useEffect(() => console.log(data), [data]);

  // console.log(location.hash.substring(2), name, gender);
  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className={"green-wrapper column"}>
          <div className={"first"}>
            <div className={"center greet"}>
              <h2 className={"color-cornsilk black-shadow cormorant-garamond-regular"}>
                {gender} {name}
              </h2>
            </div>
            <div className={"center color-cornsilk black-shadow cormorant-garamond-regular "}>
              <span className={"cormorant-garamond-regular"}>
                {isEnglish
                  ? "We happily invite you to out wedding."
                  : isSpanish
                    ? "nos complace invitarlos a nuestra boda."
                    : `Sa radošću ${isPlural ? "vas" : "te"} pozivamo da ${isPlural ? "prisustvujete" : "prisustvuješ"} našem venčanju.`}
              </span>
            </div>
            <div className={"names-wrapper"}>
              <h2 className={"names color-cornsilk black-shadow"}>Aleksandra</h2>
              <br />
              <h2 className={"names color-cornsilk black-shadow"}>&</h2>
              <br />
              <h2 className={"names color-cornsilk black-shadow"}>Goran</h2>
            </div>
            <div className={"center column color-cornsilk black-shadow cormorant-garamond-regular uppercase date-light"}>
              <span>Subota, 31. avgust 2024.</span>
              <span>Petrovaradinska tvrđava, Atelje 21</span>
            </div>
            <div className={"center column color-cornsilk black-shadow cormorant-garamond-regular time"}>
              <span>Okupljanje gostiju u 16h</span>
              <span>Čin sklapanja braka u 17:30</span>
            </div>
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
          {data ? (
            <div className={"row"}>
              <div>
                <input
                  onChange={async (event) => {
                    if (event.target.checked) {
                      await post("da");
                      fetchData();
                    }
                  }}
                  type="radio"
                  id="da"
                  name="drone"
                  value="da"
                  checked={data?.[location.hash.substring(2)] === "da"}
                />
                <label htmlFor="da">Da</label>
              </div>
              <div>
                <input
                  onChange={async (event) => {
                    if (event.target.checked) {
                      await post("neodlučeni");
                      fetchData();
                    }
                  }}
                  type="radio"
                  id="neodlučeni"
                  name="drone"
                  value="neodlučeni"
                  checked={data?.[location.hash.substring(2)] === "neodlučeni"}
                />
                <label htmlFor="neodlučeni">Neodlučeni</label>
              </div>
              <div>
                <input
                  onChange={async (event) => {
                    if (event.target.checked) {
                      await post("ne");
                      fetchData();
                    }
                  }}
                  type="radio"
                  id="ne"
                  name="drone"
                  value="ne"
                  checked={data?.[location.hash.substring(2)] === "ne"}
                />
                <label htmlFor="ne">Ne</label>
              </div>
            </div>
          ) : null}
        </div>
      </APIProvider>
    </>
  );
}

export default App;
