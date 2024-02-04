import cors from "cors"
import express from "express"
const app = express()
var cors_list = ["*", "http://localhost:3000", "https://dexchat-madjid123.vercel.app"]

export default app