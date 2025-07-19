import { auth, db } from "./firebaseConfig.js"
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"



function showMessage(message, type = "error") {
  const box = document.getElementById("messageBox")
  box.textContent = message
  box.className = type === "error" ? "error" : "success"
  box.style.display = "block"
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const selectedRole = document.getElementById('role').value


  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const userDocRef = doc(db, "users", user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const storedRole = userDocSnap.data().role
    console.log(storedRole)
      if (storedRole !== selectedRole) {
        showMessage("Selected role doesn't match registered role.")
        return
      }

      showMessage("Login successful!", "success")

      setTimeout(() => {
        window.location.href =
          storedRole === "user"
            ? "/user-dashboard.html"
            : "/counselor-dashboard.html"
      }, 1000)
    } else {
      showMessage("User role not found. Please contact support.")
    }

  } catch (err) {
    showMessage(err.message)
  }
})
