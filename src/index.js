import express from 'express'
import dotenv from 'dotenv'
import router from './routers/index.js'
import cors from 'cors'
import chalk from 'chalk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.listen(process.env.PORT || 5000, () => {
	console.log(chalk.bold.green('Server running on port ' + process.env.PORT))
})
