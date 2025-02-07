const path = require("path")
const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const compression = require("compression")
const cors = require("cors")
const helmet = require("helmet")

const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")

const userRouter = require("./routers/userRouter")
const viewRouter = require("./routers/viewRouter")
const bicycleRouter = require("./routers/bicycleRouter")
const reviewRouter = require("./routers/reviewRouter")
const helpers = require("./utils/helpers")
const bookingRouter = require("./routers/bookingRouter")

const { webhookCheckout } = require("./controllers/bookingController")

/**
 * Initialize app
 */
const app = express()

/**
 * Add Security HTTP Headers
 * Helmet - It is help us to secure HTTP Headers return by express app
 */
app.use(helmet())

/**
 * Enable trust proxy
 */
app.enable("trust proxy")

/**
 * Pug setup and read static files
 */
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

/**
 * Implement cors
 */
app.use(cors())
app.options("*", cors())

/**
 * Development logger
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

const limitRequest = maximumReq =>
  rateLimit({
    max: maximumReq,
    windowMs: 1 * 60 * 60 * 1000,
    handler: (req, res) => {
      const message =
        "Too many request with that IP! Please try again in an hour"

      res.status(429).json({
        message,
      })
    },
  })

/**
 * This function does - maximum request in one hour from the same IP
 */
const requestLimitApi = limitRequest(100)
const requestLimitAll = limitRequest(200)
const requestLimitApiForAccount = limitRequest(50)

app.use("/api", requestLimitApi)
app.use("/api/v1/users/login", requestLimitApiForAccount)
app.use("/api/v1/users/signup", requestLimitApiForAccount)
app.use("/", requestLimitAll)

/**
 * Payment for bike: This routes only work on production
 */
app.post(
  "/webhook-checkout-payment",
  express.raw({ type: "application/json" }),
  webhookCheckout
)

/**
 * Define body parser
 */
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.locals.h = helpers
  next()
})

app.use(compression())

/**
 * Mount routers
 */
app.use("/", viewRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/bicycle", bicycleRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/booking", bookingRouter)

/**
 * Handle Unknown routes for both Development and Production Environment
 */
if (process.env.NODE_ENV === "production") {
  app.all("*", (req, res, next) => {
    next(new AppError(`Page Not Found`, 404))
  })
}

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} to this server!`, 404))
})

/**
 * Global Error Handler
 */
app.use(globalErrorHandler)

module.exports = app
