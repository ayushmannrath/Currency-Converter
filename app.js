const BASE_URL = "https://api.frankfurter.dev/v2/rate";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const amount = document.querySelector(".amount input");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (const select of dropdowns) {
  for (const currcode in countryList) {
    const newOption = document.createElement("option");
    newOption.value = currcode;
    newOption.textContent = currcode;

    if (select.name === "from" && currcode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currcode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update the country flag
function updateFlag(element) {
  const currcode = element.value;
  const countrycode = countryList[currcode];
  const img = element.parentElement.querySelector("img");

  if (countrycode) {
    img.src = `https://flagsapi.com/${countrycode}/shiny/64.png`;
  }
}

// Convert currency when the button is clicked
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  const amtval = Number(amount.value);

  if (!Number.isFinite(amtval) || amtval <= 0) {
    msg.textContent = "Please enter a valid amount.";
    return;
  }

  const fromCode = fromcurr.value;
  const toCode = tocurr.value;

  if (fromCode === toCode) {
    msg.textContent = `${amtval} ${fromCode} = ${amtval.toFixed(2)} ${toCode}`;
    return;
  }

  const URL = `${BASE_URL}/${fromCode}/${toCode}`;

  msg.textContent = "Getting exchange rate...";

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Could not fetch exchange rate.");
    }

    const data = await response.json();
    const convertedAmount = amtval * data.rate;

    msg.textContent = `${amtval} ${fromCode} = ${convertedAmount.toFixed(2)} ${toCode}`;
  } catch (error) {
    msg.textContent = error.message;
  }
});

// Set the correct initial flags
updateFlag(fromcurr);
updateFlag(tocurr);
