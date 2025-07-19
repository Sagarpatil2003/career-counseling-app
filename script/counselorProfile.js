import { auth, db } from './firebaseConfig.js'
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js'

const form = document.getElementById('counselorProfileForm')
const loader = document.getElementById('loader')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  loader.style.display = 'flex'

  try {
    const fullName = document.getElementById('fullName').value
    const qualification = document.getElementById('qualification').value
    const specialization = document.getElementById('specialization').value
    const experience = document.getElementById('experience').value
    const certifications = document.getElementById('certifications').value
    const availableSlotsRaw = document.getElementById('availableSlots').value
    const availableSlots = availableSlotsRaw.split(',').map(slot => slot.trim())

    const validSlots = availableSlots.every(slot =>
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(slot)
    )

    if (!validSlots) {
      alert("⚠️ Invalid slot format. Use YYYY-MM-DD HH:MM")
      loader.style.display = 'none'
      return
    }

    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    const docRef = doc(db, 'users', user.uid)
    await setDoc(docRef, {
      fullName,
      qualification,
      experience,
      certifications,
      expertise: specialization,
      availableSlots,
      role: 'counselor'
    })

    alert('✅ Profile saved successfully!')
    form.reset()
    if (role === "user") {
          window.location.href = "/user-dashboard.html"
        } else {
          window.location.href = "/counselor-dashboard.html"
    }
  } catch (error) {
    console.error(error)
    alert('❌ Error saving profile. Please try again.')
  } finally {
    loader.style.display = 'none'
  }
})
