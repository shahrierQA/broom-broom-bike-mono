import "@babel/polyfill"

import { signup, login, logout } from "./account"
import { forgotPassword, resetPassword } from "./recoverPassword"
import { updateSettings } from "./updateSettings"
import { createBicycle } from "./admin"
import { postReview, editReview } from "./review"
import { bookingDetails, resetBookingDetails } from "./booking"
import { bookBicycle } from "./stripe"
import { showAlert } from "./alert"

/**
 * Define DOM Elements
 */
const loginForm = document.getElementById("form-login")
const signupForm = document.getElementById("form-signup")
const forgotForm = document.getElementById("form-forgotPassword")
const resetForm = document.getElementById("form-resetPassword")
const logoutBtn = document.getElementById("user-logout")
const userProfileForm = document.getElementById("form-update-profile")
const userPasswordForm = document.getElementById("form-update-password")
const bicycleReviewFormCreate = document.getElementById("form-review-create")
const bicycleReviewFormEdit = document.getElementById("form-review-edit")
const resetDetails = document.getElementById("reset-booking-details")
const bookingBiycleForm = document.getElementById("bicycle__details-form")
const bicycleBookBtn = document.getElementById("book-btn")

/**
 * Booking a bicycle
 */
if (bicycleBookBtn) {
  bicycleBookBtn.addEventListener("click", e => {
    e.target.textContent = "Processing..."
    const { bikeId } = e.target.dataset

    bookBicycle(bikeId)
  })
}

/**
 * Fillup bicycle form to choose a bicycle
 */
if (bookingBiycleForm) {
  bookingBiycleForm.addEventListener("submit", e => {
    e.preventDefault()

    document.getElementById("btn__action-book").innerHTML =
      'Booking <i class="fas fa-spinner fa-pulse"></i>'

    const bookedForHours = document.querySelector(".input-booked-for").value
    const pickupLocation = document.querySelector(
      ".input-pickup-location"
    ).value
    const quantity = document.querySelector(".input-quantity").value
    const bicycleId = document.getElementById("booking__bicycle-id").value

    bookingDetails(pickupLocation, bicycleId, quantity, bookedForHours)
  })
}

/**
 * Reset bicycle booking details
 */
if (resetDetails) {
  resetDetails.addEventListener("click", () => {
    document.getElementById("reset-booking-details").innerHTML =
      'Resetting <i class="fas fa-spinner fa-pulse"></i>'

    const bicycleSlug = document.getElementById("bicycle-slug").value
    const bicycleId = document.getElementById("bicycle-id").value

    resetBookingDetails(bicycleSlug, bicycleId)
  })
}

/**
 * Signup form
 */
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault()

    document.getElementById("btn__action-signup").innerHTML =
      'Signing in <i class="fas fa-spinner fa-pulse"></i>'

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const passwordConfirm = document.getElementById("passwordConfirm").value
    const phoneNumber = document.getElementById("phoneNumber").value

    signup(name, email, password, passwordConfirm, phoneNumber)
  })
}

/**
 * For login to user account
 */
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault()

    document.getElementById("btn__action-login").innerHTML =
      'Logging in <i class="fas fa-spinner fa-pulse"></i>'

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    await login(email, password)
    document.getElementById("btn__action-login").innerHTML = "Log in"
  })
}

/**
 * For forgot user password
 */
if (forgotForm) {
  forgotForm.addEventListener("submit", e => {
    e.preventDefault()

    const email = document.getElementById("email").value

    document.getElementById("send-reset-btn").innerHTML =
      '<i class="fas fa-spinner fa-pulse"></i>'
    forgotPassword(email)
  })
}

/**
 * For Reset user password
 */
if (resetForm) {
  resetForm.addEventListener("submit", e => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const passwordConfirm = document.getElementById("passwordConfirm").value
    const tokenID = document.getElementById("token__id").value

    document.getElementById("reset-btn").innerHTML =
      '<i class="fas fa-spinner fa-pulse"></i>'

    resetPassword(password, passwordConfirm, tokenID)
  })
}

/**
 * For logging out
 */
if (logoutBtn) logoutBtn.addEventListener("click", logout)

/**
 * For update user data
 */
if (userProfileForm) {
  userProfileForm.addEventListener("submit", async e => {
    e.preventDefault()

    document.getElementById("btn-save-profile").innerHTML =
      'Updating <i class="fas fa-spinner fa-pulse"></i>'

    // for programatically creating a multpart/form-data
    const form = new FormData()

    form.append("name", document.getElementById("name").value)
    form.append("email", document.getElementById("email").value)
    form.append("photo", document.getElementById("photo").files[0])

    await updateSettings(form, "data")
    document.getElementById("btn-save-profile").innerHTML = "Update Profile"
  })
}

/**
 * For change user password
 */
if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async e => {
    e.preventDefault()
    document.getElementById("btn-save-password").innerHTML =
      'Updating <i class="fas fa-spinner fa-pulse"></i>'

    const passwordCurrent = document.getElementById("current-password").value
    const password = document.getElementById("password").value
    const passwordConfirm = document.getElementById("confirm-password").value

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    )

    document.getElementById("btn-save-password").textContent = "Update Password"

    document.getElementById("current-password").value = ""
    document.getElementById("password").value = ""
    document.getElementById("confirm-password").value = ""
  })
}

/**
 * Bicycle review submit form
 */
if (bicycleReviewFormCreate) {
  bicycleReviewFormCreate.addEventListener("submit", async e => {
    e.preventDefault()

    document.getElementById("review-rating-btn").innerHTML =
      'Submit Review <i class="fas fa-spinner fa-pulse"></i>'

    const review = document.getElementById("review-text").value
    const rating = document.querySelector('input[type="radio"]:checked')
      ? document.querySelector('input[type="radio"]:checked').value
      : 0
    const bicycleId = document.getElementById("review-bicycle-id").value

    await postReview(review, rating, bicycleId)

    document.getElementById("review-rating-btn").innerHTML = "Submit Review"
  })
}

/**
 * Bicycle review EDIT form
 */
if (bicycleReviewFormEdit) {
  bicycleReviewFormEdit.addEventListener("submit", async e => {
    e.preventDefault()

    document.getElementById("review-rating-btn").innerHTML =
      'Editing <i class="fas fa-spinner fa-pulse"></i>'

    const review = document.getElementById("review-text").value
    const rating = document.querySelector('input[type="radio"]:checked')
      ? document.querySelector('input[type="radio"]:checked').value
      : 0
    const bicycleId = document.getElementById("review-bicycle-id").value
    const reviewId = document.getElementById("review-main-id").value

    await editReview(review, rating, bicycleId, reviewId)

    document.getElementById("review-rating-btn").innerHTML = "Edit Review"
  })
}

/** FOR Admin
 * To add a new bicycle
 */
const addBiycleForm = document.getElementById("form-add-bicycle")

if (addBiycleForm) {
  addBiycleForm.addEventListener("submit", async e => {
    e.preventDefault()

    document.getElementById("btn-save-bicycle").innerHTML =
      '<i class="fas fa-spinner fa-pulse"></i>'

    const form = new FormData()

    form.append("name", document.getElementById("bike-name").value)
    form.append(
      "description",
      document.getElementById("bike-description").value
    )
    form.append("summary", document.getElementById("bike-summary").value)
    form.append("price", document.getElementById("bike-price").value)
    form.append("imageCover", document.getElementById("image").files[0])

    await createBicycle(form)

    document.getElementById("btn-save-bicycle").innerHTML = "Add Bicycle"
  })
}

/**
 * Showing alert message for webhook checkout
 */
const alert = document.querySelector("body").dataset.alert
if (alert) showAlert("success", alert, 20)
