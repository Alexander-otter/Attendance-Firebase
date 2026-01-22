import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyA5dM50EW-GTMtuM-tcwnl6F9IsRDoLMEA",
  authDomain: "espinosa-firebase-3f64f.firebaseapp.com",
  projectId: "espinosa-firebase-3f64f",
  storageBucket: "espinosa-firebase-3f64f.firebasestorage.app",
  messagingSenderId: "731086273102",
  appId: "1:731086273102:web:3a6b0c3373b597e56b611f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Dom elems */
const addStudentBtn = document.getElementById("addStudentBtn");
const markAttendanceBtn = document.getElementById("markAttendanceBtn");
const addActivityBtn = document.getElementById("addActivityBtn");

/* Add students */
addStudentBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const course = document.getElementById("course").value;
  const year = document.getElementById("year").value;

  if (!name || !course || !year) return alert("Fill all fields");

  await addDoc(collection(db, "students"), {
    name, course, year, createdAt: serverTimestamp()
  });

  loadStudents();
});

/* Load students */
async function loadStudents() {
  const studentSelect = document.getElementById("studentSelect");
  const activitySelect = document.getElementById("activityStudent");

  studentSelect.innerHTML = "";
  activitySelect.innerHTML = "";

  const snapshot = await getDocs(collection(db, "students"));
  snapshot.forEach(doc => {
    const opt1 = document.createElement("option");
    opt1.value = doc.id;
    opt1.textContent = doc.data().name;
    studentSelect.appendChild(opt1);

    const opt2 = opt1.cloneNode(true);
    activitySelect.appendChild(opt2);
  });
}

/* Attendance */
markAttendanceBtn.addEventListener("click", async () => {
  await addDoc(collection(db, "attendance"), {
    studentId: studentSelect.value,
    status: status.value,
    date: new Date().toLocaleDateString(),
    createdAt: serverTimestamp()
  });
  loadAttendance();
});

/* Load attencdance */
async function loadAttendance() {
  const list = document.getElementById("attendanceList");
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "attendance"));
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().date} - ${doc.data().status}`;
    list.appendChild(li);
  });
}

/* Add activity */
addActivityBtn.addEventListener("click", async () => {
  await addDoc(collection(db, "activities"), {
    studentId: activityStudent.value,
    type: activityType.value,
    score: score.value,
    maxScore: maxScore.value,
    date: new Date().toLocaleDateString(),
    createdAt: serverTimestamp()
  });
  loadActivities();
});

/* Load activity */
async function loadActivities() {
  const list = document.getElementById("activityList");
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "activities"));
  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${d.date} - ${d.type} (${d.score}/${d.maxScore})`;
    list.appendChild(li);
  });
}

/* Initial loads */
loadStudents();
loadAttendance();
loadActivities();
