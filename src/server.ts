import express from 'express'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { userRoute } from './routes/UserRoutes.js'
import { urlRoute } from './routes/UrlRoutes.js'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { analyticsRouter } from './routes/analyticsRoutes.js'
import { redirect } from './controllers/url.controller.js'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

dotenv.config()
const port = process.env.PORT || 3000


app.use("/api/v1/Register", userRoute)
app.use("/api/v1/url", urlRoute)
app.use("/api/v1/analytics", analyticsRouter)
app.get("/:shortCode", redirect);



app.listen(port , ()=>{
    console.log("App listenting on port:", port)
})