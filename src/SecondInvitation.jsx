import React, { useEffect } from "react";
import "./main.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { spisak } from "./spisak.js";
import { start } from "./pettles.js";
import "@fontsource/merriweather";

("use strict");

function SecondInvitation() {
  useEffect(() => start(), []);
  const name = spisak[location.pathname.substring(7)]?.name;
  const gender = spisak[location.pathname.substring(7)]?.gender;
  const isEnglish = Boolean(spisak[location.pathname.substring(7)]?.english);
  const isSpanish = Boolean(spisak[location.pathname.substring(7)]?.spanish);
  const isPlural = Boolean(spisak[location.pathname.substring(7)]?.plural);
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
      req.open("PUT", "https://api.jsonbin.io/v3/b/66942b5aacd3cb34a8662206", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-Master-Key", "$2a$10$Pu6vPXlvxXKLNX5C0gfLge5IRH9WHFnj3gm0DuXnvpiFgDF.mKVk2");
      req.send(JSON.stringify({ ...data, [location.pathname.substring(7)]: value }));
    },
    [data]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch("https://api.jsonbin.io/v3/b/66942b5aacd3cb34a8662206", {
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
            <div className={"center column greet second"}>
              <h2 className={"color-cornsilk black-shadow Merriweather"}>
                {gender} {name},
              </h2>
              <div className={"center sub-greet color-cornsilk black-shadow Merriweather "}>
                <span className={"Merriweather"}>
                  {isEnglish
                    ? "We happily invite you to our wedding."
                    : isSpanish
                      ? "nos complace invitarlos a nuestra boda."
                      : `Sa radošću ${isPlural ? "vas" : "te"} pozivamo na svadbenu žurku.`}
                </span>
              </div>
            </div>

            <div className={"names-wrapper"}>
              <h2 className={"names color-cornsilk black-shadow second-names"}>Aleksandra & Goran</h2>
            </div>
            <div className={"center column color-cornsilk black-shadow Merriweather uppercase date-light"}>
              <span>Subota, 14. septembar 2024.</span>
              <span>Fruška151, Stražilovački put 151, Sremski Karlovci 21205</span>
            </div>

            <div className={"column rsvp-wrapper"}>
              <h3 className={"center color-cornsilk black-shadow Merriweather"}>
                {isEnglish
                  ? "Please RSVP"
                  : isSpanish
                    ? "Por favor RSVP"
                    : `Molimo ${isPlural ? "vas" : "te"} da ${isPlural ? "potvrdite" : "potvrdiš"} dolazak do 20. avgusta`}
              </h3>
              <div className={"row rsvp"}>
                <div>
                  <input
                    onChange={async (event) => {
                      if (event.target.checked && data?.[location.pathname.substring(7)] !== "da") {
                        setTempRSVP("da");
                        setData({ ...data, [location.pathname.substring(7)]: "da" });
                        await post("da");
                        return fetchData();
                      }
                    }}
                    type="radio"
                    id="da"
                    name="drone"
                    value="da"
                    checked={tempRSVP === "da" ? true : data?.[location.pathname.substring(7)] === "da"}
                  />
                  <label className={"Merriweather"} htmlFor="da">
                    {isEnglish ? "Yes" : isSpanish ? "Si" : "Da"}
                  </label>
                </div>
                <div>
                  <input
                    onChange={async (event) => {
                      if (event.target.checked && data?.[location.pathname.substring(7)] !== "neodlučeni") {
                        setTempRSVP("neodlučeni");
                        setData({ ...data, [location.pathname.substring(7)]: "neodlučeni" });
                        await post("neodlučeni");
                        return fetchData();
                      }
                    }}
                    type="radio"
                    id="neodlučeni"
                    name="drone"
                    value="neodlučeni"
                    checked={tempRSVP === "neodlučeni" ? true : data?.[location.pathname.substring(7)] === "neodlučeni"}
                  />
                  <label className={"Merriweather"} htmlFor="neodlučeni">
                    {isEnglish ? "Maybe" : isSpanish ? "Quizás" : "Možda"}
                  </label>
                </div>
                <div>
                  <input
                    onChange={async (event) => {
                      if (event.target.checked && data?.[location.pathname.substring(7)] !== "ne") {
                        setTempRSVP("ne");
                        setData({ ...data, [location.pathname.substring(7)]: "ne" });
                        await post("ne");
                        return fetchData();
                      }
                    }}
                    type="radio"
                    id="ne"
                    name="drone"
                    value="ne"
                    checked={tempRSVP === "ne" ? true : data?.[location.pathname.substring(7)] === "ne"}
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
              defaultCenter={{ lat: 45.184889, lng: 19.936343 }}
              defaultZoom={17}
              gestureHandling={"greedy"}
              disableDefaultUI={true}>
              <Marker onClick={() => window.open("https://maps.app.goo.gl/bMwcRfftKpneDzso8")} position={{ lat: 45.184889, lng: 19.936343 }} />
            </Map>
          </div>
        </div>
      </APIProvider>
    </>
  );
}

export default SecondInvitation;
