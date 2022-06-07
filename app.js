require('dotenv').config();
const express = require('express');
const { send } = require('express/lib/response');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + 'public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get( "/" , (req,res)=>{
        res.render("index")
})

app.get("/artist-search", (req,res)=>{
    const searchText=(req.query.text)
spotifyApi
  .searchArtists(searchText)
  .then(data => {    
      const result= data.body.artists.items[0] 
      res.render("artist-search" ,{result})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
  const artistId =req.params.artistId
  spotifyApi.getArtistAlbums(artistId)
  .then((data) => {
    const albumsResult=data.body.items
    res.render("albums" , {albumsResult})
    console.log(albumsResult)
  })
  .catch((err) => {
    console.error(err);
  })
})

app.get("/tracks/:albumId",(req,res )=> { 
  const albumId=req.params.albumId 
  spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 })
  .then((data) =>{ 
      const trackResult=data.body.items
      console.log(trackResult)
      res.render("tracks" ,{trackResult})
   })
  .catch((err)=> {    console.log('Something went wrong!', err);
  });
})











  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
