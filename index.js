const express = require("express");
const bodyParser = require("body-parser");
const { createPublicKey, getPublicKeyByName } = require("./publicKeyModel");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 9000;

app.use(bodyParser.json());

app.post("/keys", async (req, res) => {
  try {
    let name = req.body.name;
    let key = req.body.key;

    if (!name || !key) {
      res.status(400).json({ isSuccess: false, message: "Missing something" });
    }

    const keyCreated = await createPublicKey(name, key);
    console.log(keyCreated);
    if (keyCreated.status) {
      res.status(201).json({ isSuccess: true, data: keyCreated.data });
    } else {
      res.status(400).json({ isSuccess: false, data: keyCreated });
    }
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      error: "Something went wrong!",
    });
  }
});

app.get("/keys/:name", async (req, res) => {
  try {
    let name = req.params.name;

    if (!name) {
      res.status(404).json({ isSuccess: false, error: "Not Found" });
    }

    const publickey = await getPublicKeyByName(name);

    if (publickey) {
      res.status(200).json({ isSuccess: true, data: publickey.data });
    } else {
      res.status(400).json({ isSuccess: false, data: publickey });
    }
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      error: "Something went wrong!",
    });
  }
});

app.listen(port, () => {
  console.log("App is running on port ", port);
});
