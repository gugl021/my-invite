import { useEffect } from "react";
import "./main.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { spisak } from "./spisak.js";
("use strict");

function start() {
  // Globals
  let random = Math.random,
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    PI2 = PI * 2,
    timer = undefined,
    frame = undefined,
    confetti = [];

  let spread = 160,
    sizeMin = 15,
    sizeMax = 30 - sizeMin,
    eccentricity = 10,
    deviation = 100,
    dxThetaMin = -0.1,
    dxThetaMax = -dxThetaMin - dxThetaMin,
    dyMin = 0.13,
    dyMax = 0.18,
    dThetaMin = 0.4,
    dThetaMax = 0.7 - dThetaMin;

  let colorThemes = [
    function () {
      return color((200 * random()) | 0, (200 * random()) | 0, (200 * random()) | 0);
    },
    function () {
      let black = (200 * random()) | 0;
      return color(200, black, black);
    },
    function () {
      let black = (200 * random()) | 0;
      return color(black, 200, black);
    },
    function () {
      let black = (200 * random()) | 0;
      return color(black, black, 200);
    },
    function () {
      return color(200, 100, (200 * random()) | 0);
    },
    function () {
      return color((200 * random()) | 0, 200, 200);
    },
    function () {
      let black = (256 * random()) | 0;
      return color(black, black, black);
    },
    function () {
      return colorThemes[random() < 0.5 ? 1 : 2]();
    },
    function () {
      return colorThemes[random() < 0.5 ? 3 : 5]();
    },
    function () {
      return colorThemes[random() < 0.5 ? 2 : 4]();
    },
  ];
  function color(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return ((1 - cos(PI * t)) / 2) * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  let radius = 1 / eccentricity,
    radius2 = radius + radius;
  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    let domain = [radius, 1 - radius],
      measure = 1 - radius2,
      spline = [0, 1];
    while (measure) {
      let dart = measure * random(),
        i,
        l,
        interval,
        a,
        b,
        c,
        d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        (a = domain[i]), (b = domain[i + 1]), (interval = b - a);
        if (dart < measure + interval) {
          spline.push((dart += a - measure));
          break;
        }
        measure += interval;
      }
      (c = dart - radius), (d = dart + radius);

      // Update the domain
      for (i = domain.length - 1; i > 0; i -= 2) {
        (l = i - 1), (a = domain[l]), (b = domain[i]);
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d)
            domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2);
        // Delete interval
        else if (a < c && b > c)
          if (b <= d)
            domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  // Create the overarching container
  let container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "0";
  container.style.overflow = "visible";
  container.style.zIndex = "9999";

  // Confetto constructor
  function Confetto() {
    this.frame = 0;
    this.outer = document.createElement("div");
    this.inner = document.createElement("div");
    this.outer.appendChild(this.inner);

    let outerStyle = this.outer.style,
      innerStyle = this.inner.style;
    outerStyle.position = "absolute";
    outerStyle.width = sizeMin + sizeMax * random() + "px";
    outerStyle.height = sizeMin + sizeMax * random() + "px";
    innerStyle.width = "100%";
    innerStyle.height = "100%";
    innerStyle.opacity = "0.5";
    innerStyle.backgroundImage = "url(https://djjjk9bjm164h.cloudfront.net/petal.png)";
    innerStyle.backgroundSize = "100% 100%";

    outerStyle.perspective = "50px";
    outerStyle.transform = "rotate(" + 360 * random() + "deg)";
    this.axis = "rotate3D(" + cos(360 * random()) + "," + cos(360 * random()) + ",0,";
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + "deg)";

    this.x = window.innerWidth * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + "px";
    outerStyle.top = this.y + "px";

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i) this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      let phi = (this.frame % 7777) / 7777,
        i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      let rho = interpolation(this.splineY[i], this.splineY[j], (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i]));
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + "px";
      outerStyle.top = this.y + rho * sin(phi) + "px";
      innerStyle.transform = this.axis + this.theta + "deg)";
      return this.y > height + deviation;
    };
  }

  function poof() {
    if (!frame) {
      // Append the container
      document.body.appendChild(container);

      // Add confetti
      let theme = colorThemes[0];
      (function addConfetto() {
        let confetto = new Confetto(theme);
        confetti.push(confetto);
        container.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })(0);

      // Start the loop
      let prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        let delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        let height = window.innerHeight;

        for (let i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length) return (frame = requestAnimationFrame(loop));

        // Cleanup
        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  poof();
}

function App() {
  useEffect(() => start(), []);
  const name = spisak[location.pathname.substring(1)]?.name;
  const gender = spisak[location.pathname.substring(1)]?.gender;
  const isEnglish = Boolean(spisak[location.pathname.substring(1)]?.english);
  const isSpanish = Boolean(spisak[location.pathname.substring(1)]?.spanish);
  const isPlural = Boolean(spisak[location.pathname.substring(1)]?.plural);
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
        </div>
      </APIProvider>
    </>
  );
}

export default App;
