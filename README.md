# gas-price-api

An API for retrieving the current gas price, live exchange rates (USD, EUR, JPN, etc), and volume conversions.

### API for kqwq/gas-price-globe

To serve API _and_ run cron job (update.mjs) every 24 hours, run
`npm run start`

To generate files without serving the API, run
`npm run update`

To serve the API without generating the files, run
`npm run serve`

```json
./config.json (not src/config.json)
  port: Number,
  privateKeyPath: String,
  certificatePath: String
}
```