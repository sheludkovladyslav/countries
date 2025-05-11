import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

const getCountries = async () => {
  try {
    const url = "https://restcountries.com/v3.1/all";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Помилка при отриманні даних", response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Помилка при отриманні країн", error);
  }
};

const renderCountries = async () => {
  const countriesContainer = document.querySelector(".countries__list");
  const countries = await getCountries();
  let html = "";

  countries.map((country) => {
    html += `<li class="countries__item country">
          <div class='country__img-container'>
            <img src='${country.flags.png}' alt='' />
          </div>
            <h2 class="country__title">${country.name.common}</h2>
            <p class="country__population">Населення: ${country.population}</p>
            <p class="country__borders"> ${
              !country.borders
                ? "немає сухопутних кордонів"
                : country.borders.join(", ")
            }</p>
        </li>`;
  });

  countriesContainer.innerHTML = html;
  events();
};

const events = () => {
  const cards = document.querySelectorAll(".country");
  console.log(cards);

  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const countryName = card.querySelector(".country__title").textContent;

      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );

      if (!response.ok) {
        throw new Error("помилка при фетчі", response.status);
      }

      const data = await response.json();

      const country = data[0];
      let html = "";

      if (country.borders) {
        const bordersData = await Promise.all(
          country.borders.map(async (border) => {
            const response = await fetch(
              `https://restcountries.com/v3.1/alpha/${border}`
            );
            if (!response.ok) {
              throw new Error("помилка при фетчі", response.status);
            }
            const data = await response.json();
            return data[0];
          })
        );

        html = bordersData
          .map(
            (borderCountry) => `
              <li>
                <div class="img__container">
                  <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.official}" class="border__country-img" />
                </div>
                            
              <div class='border__country-container'>
                <h2 class="border__country-name">${borderCountry.name.official}</h2>
                <p class="border__country-population">Населення: ${borderCountry.population}</p>
              </div>

              </li>
            `
          )
          .join("");
        const instance = basicLightbox.create(`<ul>
          <li class='border__country--title'><h2 class='border__country-title'>Сусідні країни для ${countryName}</h2></li>
          ${html}</ul>`);
        instance.show();
      }
    });
  });
};

const app = () => {
  renderCountries();
};

app();
