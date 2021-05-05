### [Gdrive Player - Google Drive Proxy API](https://github.com/warren-bank/crx-Gdrive-Player/tree/webmonkey-userscript/es5)

[Userscript](https://github.com/warren-bank/crx-Gdrive-Player/raw/webmonkey-userscript/es5/webmonkey-userscript/Gdrive-Player.user.js) to run in both:
* the [WebMonkey](https://github.com/warren-bank/Android-WebMonkey) application for Android
* the [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) web browser extension for Chrome/Chromium

Its purpose is to:
* redirect embedded videos from [gdriveplayer.to](https://gdriveplayer.to/) to an external player

#### Notes:

* the URL format for movies is:<br>`http://database.gdriveplayer.us/player.php?imdb=${IMDB_ID}`
  - for example:
    * Iron Man 3 (2013)
      - IMDB URL: [`https://www.imdb.com/title/tt1300854/`](https://www.imdb.com/title/tt1300854/)
      - IMDB ID: `tt1300854`
      - Gdrive Player URL: [`http://database.gdriveplayer.us/player.php?imdb=tt1300854`](http://database.gdriveplayer.us/player.php?imdb=tt1300854)
* the URL format for episodes in a TV series is:<br>`http://database.gdriveplayer.us/player.php?type=series&imdb=${IMDB_ID}&season=${SEASON_NUMBER}&episode=${EPISODE_NUMBER}`
  - for example:
    * Game of Thrones (TV Series 2011–2019)
      - IMDB URL: [`https://www.imdb.com/title/tt0944947/`](https://www.imdb.com/title/tt0944947/)
      - IMDB ID: `tt0944947`
      - SEASON: 2
      - EPISODE: 3
      - Gdrive Player URL: [`http://database.gdriveplayer.us/player.php?type=series&imdb=tt0944947&season=2&episode=3`](http://database.gdriveplayer.us/player.php?type=series&imdb=tt0944947&season=2&episode=3)

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
