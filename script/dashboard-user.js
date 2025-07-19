
import { auth, db } from "./firebaseConfig.js"
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

// Load user info and populate profile
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/login.html"
    return
  }

  try {
    const userRef = doc(db, "users", user.uid)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      const data = docSnap.data()

      document.querySelector(".username").textContent = `Hi, ${data.fullName}`
      document.getElementById("name").textContent = data.fullName || "No Name"
      document.querySelector("#profile p:nth-of-type(1)").innerHTML = `<strong>Email:</strong> ${data.email}`
      document.querySelector("#profile p:nth-of-type(2)").innerHTML = `<strong>Role:</strong> ${data.role}`
      document.querySelector("#profile p:nth-of-type(3)").innerHTML = `<strong>Education:</strong> ${data.education || '—'}`
      document.querySelector("#profile p:nth-of-type(4)").innerHTML = `<strong>Skills:</strong> ${data.skills || '—'}`

      if (data.role === "user") {
        loadCounselors()
        loadMySessions(user.uid)
      }
    }
  } catch (err) {
    console.error("Error fetching profile:", err)
  }
})
let selectedCounselorId = null
let selectedCounselorName = ""

document.getElementById("confirmBooking").addEventListener("click", bookSession)
document.getElementById("cancelBooking").addEventListener("click", () => {
  document.getElementById("bookingModal").classList.add("hidden")
})

async function loadCounselors() {
  const list = document.getElementById("counselor-list")
  list.innerHTML = ""
  const template = document.getElementById("counselor-template")
  const q = query(collection(db, "users"), where("role", "==", "counselor"))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach(docSnap => {
    const counselor = docSnap.data()
    const clone = template.content.cloneNode(true)
    // clone.querySelector(".counselor-name").textContent = counselor.fullName
    clone.querySelector(".counselor-expertise").textContent = `Expertise: ${ counselor.expertise || '—'}`

    clone.querySelector(".book-btn").addEventListener("click", () => {
      selectedCounselorId = docSnap.id
      selectedCounselorName = counselor.fullName
      document.getElementById("modal-counselor-name").textContent = counselor.fullName
      document.getElementById("bookingModal").classList.remove("hidden")
    })

    list.appendChild(clone)
  })
}

async function bookSession() {
  const date = document.getElementById("sessionDate").value
  const time = document.getElementById("sessionTime").value
  const currentUser = auth.currentUser
  if (!currentUser) return

  try {
    await addDoc(collection(db, "sessions"), {
      userId: currentUser.uid,
      counselorId: selectedCounselorId,
      date,
      time,
      status: "pending",
      createdAt: Timestamp.now()
    })
    document.getElementById("bookingModal").classList.add("hidden")
    alert("Session booked successfully!")
  } catch (err) {
    console.error("Error booking session:", err)
    alert("Failed to book session.")
  }
}



// Load booked sessions
async function loadMySessions(userId) {
  const section = document.getElementById("sessions")
  const list = document.createElement("div")
  list.classList.add("session-list")
  section.appendChild(list)

  const q = query(collection(db, "sessions"), where("userId", "==", userId))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    list.innerHTML = "<p>No sessions booked yet.</p>"
    return
  }

  querySnapshot.forEach(async (docSnap) => {
    const session = docSnap.data()
    const counselorRef = doc(db, "users", session.counselorId)
    const counselorDoc = await getDoc(counselorRef)
    const counselor = counselorDoc.exists() ? counselorDoc.data().fullName : "Unknown Counselor"

    const div = document.createElement("div")
    div.classList.add("session-item")
    div.innerHTML = `
      <h4>${counselor}</h4>
      <p>Date: ${session.date}</p>
      <p>Time: ${session.time}</p>
      <p>Status: ${session.status}</p>
    `
    list.appendChild(div)
  })
}
