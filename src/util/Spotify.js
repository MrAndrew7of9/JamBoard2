
const clientID = '78272ce624b84226a22f0f3dc2111fa0';
const redirectURI = 'http://localhost:3000/';
let userAccessToken;
let userID;
let playlistID;

const Spotify = {

  savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) {
      return;
    }
    //fetch user id
    fetch('https://api.spotify.com/v1/me',
      {
        headers: {Authorization: `Bearer ${userAccessToken}`}
      }
    ).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    return userID = jsonResponse.id;
  });
  //fetch POST to save/create a playlist to the user's account
  fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    headers: {Authorization: `Bearer ${userAccessToken}`},
    method: 'POST',
    body: JSON.stringify({id:'200'})
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('POST playlist request failed!');
  }, networkError => console.log(networkError.message)
).then(jsonResponse => {
  return playlistID = jsonResponse.id;
});
//fetch POST to add tracks to the playlist
fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
  headers: {Authorization: `Bearer ${userAccessToken}`},
  method: 'POST',
  body: JSON.stringify({id:'200'}), //trackURIs here?
}).then(response => {
  if (response.ok) {
    return response.json();
  }
  throw new Error('POST tracks request failed!');
}, networkError => console.log(networkError.message)
).then(jsonResponse => {
  //do something
});

},//end savePlaylist method

  searchSpotify(searchTerm) {
    if (!userAccessToken) {
      this.getAccessToken();
    };
    console.log(userAccessToken);
    return fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
      {
        headers: {Authorization: `Bearer ${userAccessToken}`}
      }
    ).then(response => {
      if (response.ok) {
        return response.json();
      }
      console.log("request failed");
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    console.log(jsonResponse);
    if (jsonResponse.tracks) {
      return jsonResponse.tracks.items.map(track => ({
        ID: track.id,
        Name: track.name,
        Artist: track.artists[0].name,
        Album: track.album.name,
        URI: track.uri,
      }))
    }
  }).catch(error => {
  console.log(error);
});
},//end search method

  getAccessToken() { ///problem function
    if(userAccessToken) {
      return new Promise(resolve => resolve(userAccessToken));
    } else if(!userAccessToken) {
      let urlToParse = window.location.href;
      if (urlToParse !== redirectURI) {
        this.parseToken(urlToParse);
      } else if (urlToParse === redirectURI) {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}`;
      //reccomend adding a state to ensure to ensure valitity
      //possible add scopes for more functionality
      //redirect to sign in page & asks permission to modify user playlists
      }
    }
  },//add method that gets an access token

  parseToken(urlToParse) {
    if(urlToParse !== redirectURI) {
      //userAccessToken = urlToParse.match(/access_token=([^&]*)/);
      userAccessToken = urlToParse.match(/access_token=([^&]*)/)[1];
      let expiresIn = urlToParse.match(/expires_in=([^&]*)/);
      window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    } else {
      console.log('No Access Token recieved!/No redirect URL!');
    }
  }

//add a method that saves user's playlist to their Spotify account
};//end spotify object

export default Spotify;
