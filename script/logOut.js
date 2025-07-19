import { auth } from './firebaseConfig.js'
import { signOut } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js'

document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await signOut(auth)
    window.location.href = 'index.html'  // Redirect to homepage or login
  } catch (err) {
    alert('Logout failed: ' + err.message)
  }
})
