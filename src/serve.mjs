import express from "express";
import fs from "fs";
import cors from "cors";
import https from "https";
import path from "path";

//const config = require("./config.json");
// const secrets = {
// 	privKey: fs.readFileSync('./secrets/certs/key.pem', 'utf8'),
// 	cert: fs.readFileSync('./secrets/certs/cert.pem', 'utf8')
// };
// const credentials = {
// 	"key": secrets.privKey,
// 	"cert": secrets.cert
// };
//-----------------------------------------------------------------------------
const app = express();
const PORT = 8005 ;// config.port;
app.use(cors());


app.use("/api/gas", express.static('public'))
app.get("/" , (req, res) => {
	res.status(200).send(new Date().toString());
});

// debug server
const startServer = () => {
	app.listen(PORT, () => {
		console.log('app listening on ' + PORT)
	})
}

// https.createServer(credentials, app).listen(PORT, () => {
// 	console.log(`secure server running on port ${PORT}`);
// });

export default startServer;