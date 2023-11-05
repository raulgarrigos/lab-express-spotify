require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

app.get("/artist-search", async (req, res, next) => {
  try {
    console.log(req.query.artist);

    const response = await spotifyApi.searchArtists(req.query.artist);
    console.log("The received data from the API: ", response.body);
    res.render("artist-search-results.hbs", {
      oneArtist: response.body,
    });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
    next(error);
  }
});

app.get("/albums/:artistId", async (req, res, next) => {
  try {
    console.log(req.params.artistId);
    const response = await spotifyApi.getArtistAlbums(req.params.artistId);
    console.log("Artist albums", response.body);
    res.render("albums.hbs", {
      albums: response.body,
    });
  } catch (error) {
    console.log("The error while searching albums occurred: ", error);
    next(error);
  }
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
