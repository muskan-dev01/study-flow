// ===============================
// STUDYFLOW JAVASCRIPT
// ===============================


// ===============================
// ELEMENTS
// ===============================

const currentDate = document.getElementById("currentDate");

const subjectCount = document.getElementById("subjectCount");
const completedCount = document.getElementById("completedCount");
const sessionCount = document.getElementById("sessionCount");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");

const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");

const themeBtn = document.getElementById("themeBtn");

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const timerStatus = document.getElementById("timerStatus");

const addSubjectBtn = document.getElementById("addSubjectBtn");
const subjectContainer = document.getElementById("subjectContainer");


// ===============================
// DATE
// ===============================

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
});


// ===============================
// TASKS
// ===============================

let tasks =
    JSON.parse(localStorage.getItem("studyFlowTasks")) || [];


// DISPLAY TASKS

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

        taskItem.className = "study-task";


        if (task.completed) {
            taskItem.classList.add("completed");
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


        // COMPLETE TASK

        const checkBtn =
            taskItem.querySelector(".check-btn");

        checkBtn.addEventListener("click", () => {

            tasks[index].completed =
                !tasks[index].completed;

            saveTasks();

            displayTasks();

        });


        // DELETE TASK

        const deleteBtn =
            taskItem.querySelector(".delete-task");

        deleteBtn.addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            displayTasks();

        });


        taskContainer.appendChild(taskItem);

    });


    updateProgress();
}


// SAVE TASKS

function saveTasks() {

    localStorage.setItem(
        "studyFlowTasks",
        JSON.stringify(tasks)
    );

}


// ADD TASK

addTaskBtn.addEventListener("click", () => {

    const taskText =
        prompt("Enter your study task:");

    if (
        taskText === null ||
        taskText.trim() === ""
    ) {
        return;
    }


    tasks.push({
        text: taskText.trim(),
        completed: false
    });


    saveTasks();

    displayTasks();

});


// ===============================
// PROGRESS
// ===============================

function updateProgress() {

    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(task => task.completed).length;


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
            (completedTasks / totalTasks) * 100
        );


    progressPercent.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;

    progressText.textContent =
        `${completedTasks} of ${totalTasks} tasks completed`;

}


// ===============================
// SUBJECTS
// ===============================

let subjects =
    JSON.parse(
        localStorage.getItem("studyFlowSubjects")
    ) || [];


// DISPLAY SUBJECTS

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


    subjects.forEach((subject, index) => {

        const subjectItem =
            document.createElement("div");

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


        // DELETE SUBJECT

        const deleteBtn =
            subjectItem.querySelector(
                ".delete-subject"
            );


        deleteBtn.addEventListener("click", () => {

            subjects.splice(index, 1);

            saveSubjects();

            displaySubjects();

        });


        subjectContainer.appendChild(
            subjectItem
        );

    });

}


// SAVE SUBJECTS

function saveSubjects() {

    localStorage.setItem(
        "studyFlowSubjects",
        JSON.stringify(subjects)
    );

}


// ADD SUBJECT

addSubjectBtn.addEventListener("click", () => {

    const subjectName =
        prompt("Enter your subject name:");


    if (
        subjectName === null ||
        subjectName.trim() === ""
    ) {
        return;
    }


    const progressInput =
        prompt("Enter your progress (0 - 100):");


    if (progressInput === null) {
        return;
    }


    let progress =
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

        name: subjectName.trim(),

        progress: progress

    });


    saveSubjects();

    displaySubjects();

});


// ===============================
// FOCUS SESSIONS
// ===============================

let sessions =
    Number(
        localStorage.getItem("studyFlowSessions")
    ) || 0;


sessionCount.textContent =
    sessions;


// ===============================
// FOCUS TIMER
// ===============================

let timeLeft =
    25 * 60;

let timerInterval =
    null;

let timerRunning =
    false;


// UPDATE TIMER

function updateTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


// START TIMER

function startTimer() {

    if (timerRunning) {
        return;
    }


    timerRunning = true;

    startBtn.textContent =
        "Pause";

    timerStatus.textContent =
        "Focus mode is running ✨";


    timerInterval =
        setInterval(() => {


            if (timeLeft > 0) {

                timeLeft--;

                updateTimer();

            }

            else {

                clearInterval(
                    timerInterval
                );

                timerRunning = false;


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

        }, 1000);

}


// PAUSE TIMER

function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    startBtn.textContent =
        "Start";

    timerStatus.textContent =
        "Timer paused.";

}


// START / PAUSE BUTTON

startBtn.addEventListener(
    "click",
    () => {

        if (timerRunning) {

            pauseTimer();

        }

        else {

            startTimer();

        }

    }
);


// RESET TIMER

resetBtn.addEventListener(
    "click",
    () => {

        clearInterval(
            timerInterval
        );

        timerRunning = false;

        timeLeft =
            25 * 60;

        updateTimer();

        startBtn.textContent =
            "Start";

        timerStatus.textContent =
            "Ready to focus ✨";

    }
);


// ===============================
// QUICK NOTE
// ===============================

const savedNote =
    localStorage.getItem(
        "studyFlowNote"
    );


if (savedNote) {

    noteInput.value =
        savedNote;

}


// SAVE NOTE

saveNoteBtn.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "studyFlowNote",
            noteInput.value
        );


        saveNoteBtn.textContent =
            "Saved ✓";


        setTimeout(() => {

            saveNoteBtn.textContent =
                "Save Note";

        }, 1500);

    }
);


// ===============================
// DARK / LIGHT THEME
// ===============================

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