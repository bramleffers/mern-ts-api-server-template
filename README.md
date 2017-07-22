Template for a full-featured [MERN stack](http://mern.io)/[Typescript](http://www.typescriptlang.org) & [Swagger](https://swagger.io)/[InversifyJS](http://inversify.io) APIs server with [nodemon](https://nodemon.io) to monitor for any changes in your source and automatically restart Node server
# I. Features
- Node/ExpressJS Server with nodemon
- Inversify for DI/IoC to build testable RESTful APIs
- Swagger UI specs & Generates code using swagger-cli tool
- Mongoose & strongly-typed model objects
- Logging
- OAuth2
- Configuration:
    - Settings isolation for development/test/uat/production
    - CORS: cross-origin config (to allow hosted client in difference server/port)
    - Server port config
    - Connection string to MongoDB
    - Logger
# II. Using the template
```bash
npm install
npm start
chrome http://localhost:3000
```
# III. Create the template
## 1. Init ExpressJS/Typescript with nodemon
### Install npm packages
```bash
# Create package.json
npm init -y

# Install development tools
npm install --save-dev typescript ts-node nodemon @types/debug @types/node @types/express

# Install development libs
npm install --save express
```
### Create tsconfig.json
```bash
node ./node_modules/typescript/lib/tsc --init
```
```json
{
  "compilerOptions": {
    "target": "es6",
    "sourceMap": true
  }
  ,"exclude": [
    ".vscode",
    "node_modules",
    "bin",
    "config"
  ]
  ,"include": [
    "**/*.ts"
  ]
}
```
### Start command in package.json
```json
..
"scripts": {
  "start": "./node_modules/.bin/nodemon --watch **/*.ts --ignore node_modules/ --ignore bin/ --ignore .vscode/ --ignore config/ --exec .\\node_modules\\.bin\\ts-node index.ts"
},
..
```
### Create index.ts
```typescript
import * as express from 'express';

const app = express();
app.get('/', (req, res) => { res.send(`<b>Time:</b> ${new Date()}`); });
app.listen(3000, () => console.log('Server listening on port 3000!'));
```
### Test
```bash
npm start
chrome http://localhost:3000
```
