const express = require("express");
const bodyParser = require("body-parser");
const {
  createPublicKey,
  getPublicKeyByName,
} = require("./models/publicKeyModel");

const {authentication, addUser} = require("./models/userModel");
const {checkToken} = require("./middleware/checkToken");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 9000;

app.use(bodyParser.json());


app.post("/keys",checkToken, async (req, res) => {
  try {
    let name = req.body.name;
    let key = req.body.key;

    if (!name || !key) {
      res.status(400).json({ isSuccess: false, message: "Missing something" });
    }

    const keyCreated = await createPublicKey(name, key);

    if (keyCreated.status) {
      res.status(201).json({ isSuccess: true, data: keyCreated });
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

app.get("/keys/:name",checkToken, async (req, res) => {
  try {
    let name = req.params.name;

    if (!name) {
      res.status(404).json({ isSuccess: false, error: "Not Found" });
    }

    const publickey = await getPublicKeyByName(name);

    if (publickey) {
      res.status(200).json({ isSuccess: true, data: publickey });
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

app.post("/auth", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
      res.status(400).json({ isSuccess: false, message: "Missing something" });
    }

    const auth = await authentication(username, password);

    if(auth.status) {
      res.status(200).json({isSuccess:true,data: auth.data})
    } else {
      res.status(400).json({isSuccess:false,message: "Error"})
    }

    console.log(auth);


  } catch (err) {
    console.log(err)
    res.status(500).json({
      isSuccess: false,
      error: "Something went wrong!",
    });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if (!username || !password || !email) {
      res.status(400).json({ isSuccess: false, message: "Missing something" });
    }

    const user = await addUser(username, password, email);

    if(user.status) {
      res.status(201).json({isSuccess:true,data: user.data})
    } else {
      res.status(400).json({isSuccess:false,message: "Created failure"})
    }



  } catch (err) {
    console.log(err)
    res.status(500).json({
      isSuccess: false,
      error: "Something went wrong!",
    });
  }
});

app.listen(port, () => {
  console.log("App is running on port ", port);
});
