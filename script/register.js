import { auth, db } from "./firebaseConfig.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"


document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const loader = document.getElementById("loader")
  loader.style.display = "block"

  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const role = document.getElementById("role").value

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, "users", user.uid), {
      email,
      role
    })

    alert("Registered Successfully")
    loader.style.display = "none"

    if (role === "user") {
      window.location.href = "/user-dashboard.html"
    } else if (role === "counselor") {
      window.location.href = "/counselor-dashboard.html"
    }

  } catch (err) {
    loader.style.display = "none" 

    let msg = "Registration failed"
    if (err.code) {
      switch (err.code) {
        case "auth/email-already-in-use":
          msg = "Email is already in use"
          break
        case "auth/invalid-email":
          msg = "Invalid email address"
          break
        case "auth/weak-password":
          msg = "Password should be at least 6 characters"
          break
        default:
          msg = err.message
      }
    } else {
      msg = err.message
    }

    alert(msg)
  }
})
