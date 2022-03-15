import express from "express";
import fs from "fs";
import cors from "cors";
import https from "https";
import path from "path";

let configTxt = fs.readFileSync("../config.json");
const config = JSON.parse(configTxt);

const secrets = {
	privKey: fs.readFileSync(config.privateKeyPath, "utf8"),
	cert: fs.readFileSync(config.certificatePath, "utf8")
};
const credentials = {
	"key": secrets.privKey,
	"cert": secrets.cert
};
//-----------------------------------------------------------------------------
const app = express();
const PORT = config.port;
app.use(cors());


app.use("/api/v1/gas", express.static('public'))
app.get("/" , (req, res) => {
	res.status(200).send(new Date().toString());
});

// debug server
// const startServer = () => {
// 	app.listen(PORT, () => {
// 		console.log('app listening on ' + PORT)
// 	})
// }

const startServer = () => {
	https.createServer(credentials, app).listen(PORT, () => {
		console.log(`secure server running on port ${PORT}`);
	});
}

// Write to isOnline.txt
fs.writeFileSync('./public/isOnline.txt', 'Yes');

export default startServer;