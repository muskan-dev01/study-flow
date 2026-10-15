
// FIREBASE


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD-oaFQMzD0NqNZ5kXK9WOANm2Ay805694",
    authDomain: "studyflow-f73f6.firebaseapp.com",
    projectId: "studyflow-f73f6",
    storageBucket: "studyflow-f73f6.firebasestorage.app",
    messagingSenderId: "400688693426",
    appId: "1:400688693426:web:2e1d7ca8a18bc7efce49ab"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// AUTH ELEMENTS


const authScreen =
    document.getElementById("authScreen");

const appContainer =
    document.getElementById("app");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const loginBtn =
    document.getElementById("loginBtn");

const signupBtn =
    document.getElementById("signupBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const loginPasswordToggle =
    document.getElementById("loginPasswordToggle");

const signupPasswordToggle =
    document.getElementById("signupPasswordToggle");

const confirmPasswordToggle =
    document.getElementById("confirmPasswordToggle");



// IMPORTANT AUTH CONTROL


// Dashboard sirf Login button press
// karne ke baad show hoga.
let allowDashboard = false;


// App start hote hi Login screen show
// aur Dashboard hide rahega.
authScreen.style.display = "flex";
appContainer.style.display = "none";



// STUDYFLOW ELEMENTS


const currentDate =
    document.getElementById("currentDate");

const subjectCount =
    document.getElementById("subjectCount");

const completedCount =
    document.getElementById("completedCount");

const sessionCount =
    document.getElementById("sessionCount");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskContainer =
    document.getElementById("taskContainer");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const noteInput =
    document.getElementById("noteInput");

const saveNoteBtn =
    document.getElementById("saveNoteBtn");

const themeBtn =
    document.getElementById("themeBtn");

const timerDisplay =
    document.getElementById("timerDisplay");

const startBtn =
    document.getElementById("startBtn");

const resetBtn =
    document.getElementById("resetBtn");

const timerStatus =
    document.getElementById("timerStatus");

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const subjectContainer =
    document.getElementById("subjectContainer");


// LOGIN / SIGNUP SWITCH

showSignupBtn.addEventListener("click", () => {

    loginForm.classList.add("hidden");

    signupForm.classList.remove("hidden");

    loginMessage.textContent = "";

});


showLoginBtn.addEventListener("click", () => {

    signupForm.classList.add("hidden");

    loginForm.classList.remove("hidden");

    signupMessage.textContent = "";

});


// PASSWORD SHOW / HIDE

function setupPasswordToggle(input, button) {

    button.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";

        } else {

            input.type = "password";

            button.textContent = "👁️";

        }

    });

}


setupPasswordToggle(
    loginPassword,
    loginPasswordToggle
);

setupPasswordToggle(
    signupPassword,
    signupPasswordToggle
);

setupPasswordToggle(
    confirmPassword,
    confirmPasswordToggle
);


// ===============================
// SIGN UP
// ===============================

signupBtn.addEventListener("click", async () => {

    const email =
        signupEmail.value.trim();

    const password =
        signupPassword.value;

    const confirm =
        confirmPassword.value;

    signupMessage.textContent = "";


    if (!email || !password || !confirm) {

        signupMessage.textContent =
            "Please fill in all fields.";

        return;

    }


    if (password !== confirm) {

        signupMessage.textContent =
            "Passwords do not match.";

        return;

    }


    if (password.length < 6) {

        signupMessage.textContent =
            "Password must be at least 6 characters.";

        return;

    }


    if (!auth) {
        signupMessage.textContent =
            "Authentication is not configured yet.";
        return;
    }

    signupBtn.textContent =
        "Creating account...";

    signupBtn.disabled = true;


    try {

        // Create Firebase account
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        // Firebase automatically logs the new
        // account in, so immediately sign out.
        await signOut(auth);


        // Make sure dashboard stays hidden.
        allowDashboard = false;

        appContainer.style.display =
            "none";

        authScreen.style.display =
            "flex";


        // Return to Login form.
        signupForm.classList.add("hidden");

        loginForm.classList.remove("hidden");


        // Put the new email into login field.
        loginEmail.value =
            email;


        signupEmail.value = "";
        signupPassword.value = "";
        confirmPassword.value = "";


        loginMessage.textContent =
            "Account created! Please login to continue.";


    } catch (error) {

        console.error(error);

        signupMessage.textContent =
            getFirebaseErrorMessage(error);

    } finally {

        signupBtn.textContent =
            "Create Account";

        signupBtn.disabled =
            false;

    }

});



// LOGIN



loginBtn.addEventListener("click", async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    loginMessage.textContent = "";

    if (!email || !password) {
        loginMessage.textContent =
            "Please enter your email and password.";
        return;
    }

    if (!auth) {
        loginMessage.textContent =
            "Authentication is not configured yet.";
        return;
    }

    loginBtn.textContent = "Logging in...";
    loginBtn.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        allowDashboard = true;
        authScreen.style.display = "none";
        appContainer.style.display = "flex";

    } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent =
            getFirebaseErrorMessage(error);
    } finally {
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
    }
});
// =============================== 
// LOGOUT
// ===============================

logoutBtn.addEventListener("click", async () => {

    // Immediately stop dashboard access.
    allowDashboard = false;

    // Immediately hide dashboard.
    appContainer.style.display =
        "none";

    // Immediately show login screen.
    authScreen.style.display =
        "flex";

    try {
        if (auth) {
            await signOut(auth);
        }
    } catch (error) {
        console.error(
            "Logout error:",
            error
        );
    }

    authScreen.style.display = "flex";
    appContainer.style.display = "none";

    // Reset login form.
    loginForm.classList.remove("hidden");

    signupForm.classList.add("hidden");

    loginEmail.value = "";
    loginPassword.value = "";

    loginMessage.textContent = "";

});




// ===============================
// FIREBASE ERROR MESSAGES
// ===============================

function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/email-already-in-use":

            return "This email is already registered.";

        case "auth/invalid-email":

            return "Please enter a valid email.";

        case "auth/weak-password":

            return "Password must be at least 6 characters.";

        case "auth/invalid-credential":

            return "Incorrect email or password.";

        case "auth/user-not-found":

            return "No account found with this email.";

        case "auth/wrong-password":

            return "Incorrect email or password.";

        case "auth/too-many-requests":

            return "Too many attempts. Please try again later.";

        default:

            return "Something went wrong. Please try again.";

    }

}



// DATE


const today =
    new Date();

currentDate.textContent =
    today.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );



// TASKS


let tasks =
    JSON.parse(
        localStorage.getItem(
            "studyFlowTasks"
        )
    ) || [];


function displayTasks() {

    taskContainer.innerHTML = "";


    if (tasks.length === 0) {

        taskContainer.innerHTML = `
            <div class="empty-state">
                <div>📝</div>
                <p>No tasks yet</p>
                <span>Add your first study task.</span>
            </div>
        `;

        updateProgress();

        return;
    }


    tasks.forEach((task, index) => {

        const taskItem =
            document.createElement("div");


        taskItem.className =
            "study-task";


        if (task.completed) {

            taskItem.classList.add(
                "completed"
            );

        }


        taskItem.innerHTML = `
            <div class="task-info">

                <button class="check-btn">
                    ${task.completed ? "✓" : ""}
                </button>

                <span>${task.text}</span>

            </div>

            <button class="delete-task">
                ✕
            </button>
        `;


        const checkBtn =
            taskItem.querySelector(
                ".check-btn"
            );


        checkBtn.addEventListener(
            "click",
            () => {

                tasks[index].completed =
                    !tasks[index].completed;

                saveTasks();

                displayTasks();

            }
        );


        const deleteBtn =
            taskItem.querySelector(
                ".delete-task"
            );


        deleteBtn.addEventListener(
            "click",
            () => {

                tasks.splice(index, 1);

                saveTasks();

                displayTasks();

            }
        );


        taskContainer.appendChild(
            taskItem
        );

    });


    updateProgress();

}


function saveTasks() {

    localStorage.setItem(
        "studyFlowTasks",
        JSON.stringify(tasks)
    );

}


addTaskBtn.addEventListener(
    "click",
    () => {

        const taskText =
            prompt(
                "Enter your study task:"
            );


        if (
            taskText === null ||
            taskText.trim() === ""
        ) {

            return;

        }


        tasks.push({

            text:
                taskText.trim(),

            completed:
                false

        });


        saveTasks();

        displayTasks();

    }
);



// PROGRESS


function updateProgress() {

    const totalTasks =
        tasks.length;


    const completedTasks =
        tasks.filter(
            task => task.completed
        ).length;


    completedCount.textContent =
        completedTasks;


    if (totalTasks === 0) {

        progressPercent.textContent =
            "0%";

        progressFill.style.width =
            "0%";

        progressText.textContent =
            "Complete your first task to start your progress.";

        return;

    }


    const percentage =
        Math.round(
            (completedTasks /
                totalTasks) *
            100
        );


    progressPercent.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    progressText.textContent =
        `${completedTasks} of ${totalTasks} tasks completed`;

}



// SUBJECTS


let subjects =
    JSON.parse(
        localStorage.getItem(
            "studyFlowSubjects"
        )
    ) || [];


function displaySubjects() {

    subjectContainer.innerHTML = "";

    subjectCount.textContent =
        subjects.length;


    if (subjects.length === 0) {

        subjectContainer.innerHTML = `
            <div class="empty-state">
                <div>📚</div>
                <p>No subjects yet</p>
                <span>Add your first subject.</span>
            </div>
        `;

        return;

    }


    subjects.forEach(
        (subject, index) => {

            const subjectItem =
                document.createElement(
                    "div"
                );


            subjectItem.className =
                "subject-item";


            subjectItem.innerHTML = `
                <div class="subject-info">

                    <div class="subject-icon">
                        📚
                    </div>

                    <div class="subject-content">

                        <div class="subject-name">
                            ${subject.name}
                        </div>

                        <div class="subject-label">
                            Study Progress: ${subject.progress}%
                        </div>

                        <div class="subject-progress-bar">

                            <div
                                class="subject-progress-fill"
                                style="width: ${subject.progress}%">
                            </div>

                        </div>

                    </div>

                </div>

                <button class="delete-subject">
                    ✕
                </button>
            `;


            const deleteBtn =
                subjectItem.querySelector(
                    ".delete-subject"
                );


            deleteBtn.addEventListener(
                "click",
                () => {

                    subjects.splice(
                        index,
                        1
                    );

                    saveSubjects();

                    displaySubjects();

                }
            );


            subjectContainer.appendChild(
                subjectItem
            );

        }
    );

}


function saveSubjects() {

    localStorage.setItem(
        "studyFlowSubjects",
        JSON.stringify(subjects)
    );

}


addSubjectBtn.addEventListener(
    "click",
    () => {

        const subjectName =
            prompt(
                "Enter your subject name:"
            );


        if (
            subjectName === null ||
            subjectName.trim() === ""
        ) {

            return;

        }


        const progressInput =
            prompt(
                "Enter your progress (0 - 100):"
            );


        if (progressInput === null) {

            return;

        }


        const progress =
            Number(progressInput);


        if (
            isNaN(progress) ||
            progress < 0 ||
            progress > 100
        ) {

            alert(
                "Please enter a number between 0 and 100."
            );

            return;

        }


        subjects.push({

            name:
                subjectName.trim(),

            progress:
                progress

        });


        saveSubjects();

        displaySubjects();

    }
);


// ===============================
// FOCUS SESSIONS
// ===============================

let sessions =
    Number(
        localStorage.getItem(
            "studyFlowSessions"
        )
    ) || 0;


sessionCount.textContent =
    sessions;



// FOCUS TIMER


let timeLeft =
    25 * 60;

let timerInterval =
    null;

let timerRunning =
    false;


function updateTimer() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        timeLeft % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

    if (timerRunning) {

        return;

    }


    timerRunning =
        true;


    startBtn.textContent =
        "Pause";


    timerStatus.textContent =
        "Focus mode is running ✨";


    timerInterval =
        setInterval(
            () => {

                if (timeLeft > 0) {

                    timeLeft--;

                    updateTimer();

                } else {

                    clearInterval(
                        timerInterval
                    );

                    timerRunning =
                        false;


                    sessions++;


                    localStorage.setItem(
                        "studyFlowSessions",
                        sessions
                    );


                    sessionCount.textContent =
                        sessions;


                    startBtn.textContent =
                        "Start";


                    timerStatus.textContent =
                        "Focus session completed! 🎉";

                }

            },
            1000
        );

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning =
        false;


    startBtn.textContent =
        "Start";


    timerStatus.textContent =
        "Timer paused.";

}


startBtn.addEventListener(
    "click",
    () => {

        if (timerRunning) {

            pauseTimer();

        } else {

            startTimer();

        }

    }
);


resetBtn.addEventListener(
    "click",
    () => {

        clearInterval(
            timerInterval
        );


        timerRunning =
            false;


        timeLeft =
            25 * 60;


        updateTimer();


        startBtn.textContent =
            "Start";


        timerStatus.textContent =
            "Ready to focus ✨";

    }
);


// QUICK NOTE


const savedNote =
    localStorage.getItem(
        "studyFlowNote"
    );


if (savedNote) {

    noteInput.value =
        savedNote;

}


saveNoteBtn.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "studyFlowNote",
            noteInput.value
        );


        saveNoteBtn.textContent =
            "Saved ✓";


        setTimeout(
            () => {

                saveNoteBtn.textContent =
                    "Save Note";

            },
            1500
        );

    }
);


// DARK / LIGHT THEME


let lightMode =
    localStorage.getItem(
        "studyFlowTheme"
    ) === "light";


if (lightMode) {

    document.body.classList.add(
        "light-mode"
    );

}


themeBtn.addEventListener(
    "click",
    () => {

        lightMode =
            !lightMode;


        document.body.classList.toggle(
            "light-mode",
            lightMode
        );


        localStorage.setItem(
            "studyFlowTheme",
            lightMode
                ? "light"
                : "dark"
        );

    }
);


// ===============================
// INITIAL LOAD
// ===============================

displayTasks();

displaySubjects();

updateProgress();

updateTimer();



// SERVICE WORKER


if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(() => {
                    console.log(
                        "StudyFlow app is ready!"
                    );
                })
                .catch(
                    error => {
                        console.error(
                            "Service Worker registration failed:",
                            error
                        );
                    }
                );
        }
    );
}