# discord.js-web-api
A backend framework that integrates [express](https://expressjs.com/) with [discord.js](https://discord.js.org/#/) and [discord-oauth2](https://www.npmjs.com/package/discord-oauth2)

# Getting started
Simply install the package `npm i discord.js-web-api`

Then import the Library in your code:
```
const WebApi = require("discord.js-web-api")
```

To get the bot up and running you will have to make an instance of Client, which is extended from the [discord.js Client class](https://discord.js.org/#/docs/main/stable/class/Client)

The Client class takes 3 parameters in the constructor
1. [ClientOptions](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions) or and empty object
2. `credentials`, this is an Object with 2 fields, `id` and `secret`, which is necessary for oauth2 to function
3. `appOptions`, this is options specific to this libraries version of Client

Simply instantiate it like such
```js
const bot = new WebApi.Client(
  {}, // discord.js client options
  {id: "123456789098765432", secret:"aBcDeFgHiJkLmNoPqRsTuVwXyZ123456"}, // credentials
  { 
    port: 80, // number, the port express will run on, defaults to 8080
    autoStartup: true, // boolean, whether to start up express automatically when the "ready" event fires, defaults to false
    rootPath: "/yee-haw", // string, the root path of all the routes added to express, example "localhost:80/yee-haw/" will be the root path, defaults to "/"
    noAuth: false, // boolean, whether not to automatically add authentication endpoints
  }
);
```

If you set `autoStartup` to `false`, you will have to manually start up express later with
```js
bot.spawnExpressProcess();
```

Once you have the class intantiated, you can continue with normal discord.js use, like `bot.login("token")`

# Default routes
Let's say you have the client set up with all default settings.

`localhost:8080/lib` - GET - This will return the library name in plain text, to tell if it is working properly

`localhost:8080/auth/token` - POST - This will return the discord token data
    - Requires the following body:
```json
  {
    "code": "string, The auth code you received from the discord api",
    "redirect_uri": "string, The redirect Uri you have set up on discord"
  }
```

`localhost:8080/auth/me` - GET - This will return the current user information
    - Requires authorization header containing the Access token
  
`localhost:8080/auth/deauth` - ANY - This will deauthorize the current token
    - Requires authorization header containing the Access token
