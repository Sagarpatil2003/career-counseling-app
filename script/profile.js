import { auth, db, storage } from "./firebaseConfig.js"
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js"

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/login.html"
  } else {
    document.getElementById("profileForm").addEventListener("submit", async (e) => {
      e.preventDefault()

      const loader = document.getElementById("loader")
      loader.style.display = "flex"

      const fullName = document.getElementById("fullName").value.trim()
      const education = document.getElementById("education").value.trim()
      const skills = document.getElementById("skills").value.trim()
      const experience = document.getElementById("experience").value.trim()
      const interests = document.getElementById("interests").value.trim()
  

      try {


        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          fullName,
          education,
          skills,
          experience,
          interests,
        })
        
        const snap = await getDoc(userRef)
        const role = snap.data().role
      
        if (role === "user") {
          window.location.href = "/user-dashboard.html"
        } else {
          window.location.href = "/counselor-dashboard.html"
        }

      } catch (err) {
        console.error(err)
        alert("Failed to save profile.")
      }

      loader.style.display = "none"
    })
  }
})
