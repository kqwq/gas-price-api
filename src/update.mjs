import fs from 'fs';
import fetch from 'node-fetch';

const main = async () => {
  // Import nameToIso2.json
  const outputLocation = "./public"
  const nameToIso2 = JSON.parse(fs.readFileSync('./src/nameToIso2.json', 'utf8'));

  // If page is cached in public folder, use that
  let page, res
  if (fs.existsSync(`${outputLocation}/gas.html`)) {
    page = fs.readFileSync(`${outputLocation}/gas.html`, 'utf8');
    page = page.toString();
    console.log("Using cached page");
  } else {
    res = await fetch("https://www.globalpetrolprices.com/gasoline_prices/")
    page = await res.text()
    console.log("Fetching page");
  }

  // Get all teext after `class="graph_outside_link">` and before `</a>`
  let countries = []
  let regex = /graph_outside_link["|']>(.*?)<\/a>/g
  let match = regex.exec(page)
  while (match !== null) {
    // Ignore everything after * or & characters
    countries.push(match[1].split(/\*|&/)[0].trim())
    match = regex.exec(page)
  }
  console.log(`Found ${countries.length} countries`);

  // Get all text after `height: 15px; color: #000000;">` and before `</div>`
  let prices = []
  regex = /height: 15px; color: #000000;">(.*?)<\/div>/g
  match = regex.exec(page)
  while (match !== null) {
    prices.push(match[1])
    match = regex.exec(page)
  }

  // Zip the two arrays together
  if (countries.length !== prices.length) {
    console.error("Countries and prices don't match")
  }
  let data = {}
  for (let i = 0; i < countries.length; i++) {
    let countryName = countries[i]
    let iso2 = nameToIso2[countryName]
    if (iso2 === undefined) {
      console.error(`Couldn't find ISO2 for ${countryName}`)
      iso2 = countryName
    }
    data[iso2] = {
      price: prices[i],
    }
  }

  // Get currency exchange rates
  let symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': 'JP¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CNY': 'CN¥',
    'RON': 'L',
  }
  res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=USD,EUR,GBP,JPY,CAD,AUD,CNY,RON')
  let json = await res.json()
  json.symbols = symbols
  fs.writeFileSync(`${outputLocation}/exchangeRate.json`, JSON.stringify(json))

  // Get volume units
  let volumeConversion = {
    'Litre': 1,
    'US gal': 0.264172052358148,
    'UK gal': 0.219969248299126,
    'Oil barrel': 0.00628981,
  }
  fs.writeFileSync(`${outputLocation}/volumeConversion.json`, JSON.stringify(volumeConversion))

  // Save matches to file
  fs.writeFileSync(`${outputLocation}/price.json`, JSON.stringify(data))
  console.log("Done", new Date())

}

export default main