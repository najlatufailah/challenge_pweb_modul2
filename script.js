const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const allBtn = document.getElementById('allBtn');
const completedBtn = document.getElementById('completedBtn');
const activeBtn = document.getElementById('activeBtn');

const STORAGE_KEY = 'todoTasks';

let tasks = ambilDariStorage();
let filterAktif = "all";

// LOCAL STORAGE
function ambilDariStorage() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data === null) {
        return []; // belum ada data tersimpan
    }

    return JSON.parse(data);
}

function simpanKeStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function buatElemenTask(task) {
    const li = document.createElement('li');
    li.className = 'task-item';

    // kalau task sudah selesai (misal hasil load dari storage), langsung dicoret
    if (task.completed) {
        li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = task.text;

    span.addEventListener('click', function () {
        li.classList.toggle('completed');
        task.completed = !task.completed;

        simpanKeStorage();
        tampilkanTask();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', function () {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        li.remove();

        simpanKeStorage();
        tampilkanTask();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// TAMBAH TASK
function addTask() {
    const text = taskInput.value.trim();

    if (text === '') {
        return;
    }

    const task = {
        text: text,
        completed: false
    };

    tasks.push(task);
    simpanKeStorage();

    buatElemenTask(task);

    taskInput.value = '';
    tampilkanTask();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// FILTER
function tampilkanTask() {
    let hasilFilter = tasks;

    if (filterAktif === "completed") {
        hasilFilter = tasks.filter(function (task) {
            return task.completed === true;
        });
    }

    // Filter Active
    if (filterAktif === "active") {
        hasilFilter = tasks.filter(function (task) {
            return task.completed === false;
        });
    }

    tasks.forEach(function (task, index) {
        const li = taskList.children[index];

        if (hasilFilter.includes(task)) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

// Tombol All
allBtn.addEventListener("click", function () {
    filterAktif = "all";
    tampilkanTask();
});

// Tombol Completed
completedBtn.addEventListener("click", function () {
    filterAktif = "completed";
    tampilkanTask();
});

// Tombol Active
activeBtn.addEventListener("click", function () {
    filterAktif = "active";
    tampilkanTask();
});

// SAAT HALAMAN REFRESH
tasks.forEach(function (task) {
    buatElemenTask(task);
});
tampilkanTask();