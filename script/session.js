import { auth, db } from './firebaseConfig'
import {
  collection,
  getDocs,
  doc,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js'
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js'

const listEl = document.getElementById('counselor-list')
const template = document.getElementById('counselor-template')

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = '/login.html')

  const querySnapshot = await getDocs(collection(db, 'users'))

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data()
    if (data.role === 'counselor') {
      const clone = template.content.cloneNode(true)
      clone.querySelector('.counselor-name').textContent = data.fullName
      clone.querySelector('.counselor-expertise').textContent = data.expertise || 'General'
      clone.querySelector('.book-btn').addEventListener('click', () => openBookingModal(docSnap.id, data))
      listEl.appendChild(clone)
    }
  })
})

function openBookingModal(counselorId, data) {
  const date = prompt('Enter session date (YYYY-MM-DD):')
  const time = prompt('Enter time (e.g., 15:30):')
  const mode = prompt('Mode: virtual / in-person')

  if (!date || !time || !mode) return alert('All fields required')

  addDoc(collection(db, 'sessions'), {
    userId: auth.currentUser.uid,
    counselorId,
    date,
    time,
    mode,
    status: 'pending',
    createdAt: serverTimestamp()
  }).then(() => {
    alert('Session Requested!')
  })
}
