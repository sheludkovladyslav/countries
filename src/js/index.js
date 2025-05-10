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

const findCountryByName = async () => {};

const renderCountries = async () => {
  const countriesContainer = document.querySelector(".countries__list");
  const countries = await getCountries();
  let html = "";

  countries.map((country) => {
    html += `<li class="countries__item country">
            <h2 class="country__title">${country.name.common}</h2>
            <p class="country__population">${country.population}</p>
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
    card.addEventListener("click", async (event) => {
      const data = await getCountries();

      const countryName = event.target.querySelector(".country__title");

      const instance = basicLightbox.create(`<h1>modal</h1>`);
      instance.show();
    });

    console.log("event");
  });
};

const app = () => {
  renderCountries();
};

app();
