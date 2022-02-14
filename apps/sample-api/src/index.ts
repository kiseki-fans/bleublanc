import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import { getCorsOrigin } from './utils'

dotenv.config()

const corsOptions = {
  origin: getCorsOrigin(),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}

const app = express()

app.set('trust proxy', true) //for express to trust nginx for https delivery
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// app.all('*', (req, res, next) => {
//   console.log(req.method + ' ' + req.url);
//   next();
// });

// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     next();
//   } else {
//     next();
//   }
// });

//==============================================================
// api routes
//==============================================================

app.get('/magicitems', (req, res) => {
  setTimeout(() => {
    res.send(['hamtaro'])
  }, 2000)
})

app.post('/login', (req, res) => {
  setTimeout(() => {
    res.send({
      user: {
        username: 'userA',
        permissions: ['AMAZING_ADMIN_PERMISSION'],
      }
    })
  }, 2000)
})

app.listen(4001, function () {
  console.log('Example app listening on port 4001!')
})
