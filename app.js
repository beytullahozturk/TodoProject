// Select DOM Elements
const todoInput = document.getElementById('todoInput');
const todoDate = document.getElementById('todoDate'); // New Date Input
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const priorityInputs = document.querySelectorAll('input[name="priority"]');

// New UI Elements
const mainProgressBar = document.getElementById('mainProgressBar');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterBtns = document.querySelectorAll('.filter-btn');

// Modal Elements
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const todoModal = document.getElementById('todoModal');

// View Toggle Element
const viewCompletedBtn = document.getElementById('viewCompletedBtn');
const themeToggleBtn = document.getElementById('themeToggle');

// State
let todos = [
    { text: "Proje sunumunu tamamla ve ekibe gönder", priority: "high", completed: false, dueDate: "2025-12-28", createdAt: new Date() },
    { text: "Algoritma mantığını keşfet", priority: "high", completed: false, dueDate: "2025-12-28", createdAt: new Date() },
    { text: "Hangi yazılım teknolojilerini kullanacağını tespit et", priority: "high", completed: false, dueDate: "2025-12-28", createdAt: new Date() },
    { text: "Veri tabanı teknolojilerini kıyasla", priority: "high", completed: false, dueDate: "2025-12-28", createdAt: new Date() },
    { text: "Haftalık takım toplantısı notlarını düzenle", priority: "medium", completed: false, dueDate: "", createdAt: new Date() },
    { text: "Ofis bitkilerini sula", priority: "low", completed: true, dueDate: "2025-12-25", createdAt: new Date() }
];

let showingCompletedOnly = false;

// State extensions
let currentFilter = 'all';
let searchQuery = '';
let currentSort = 'newest';

// Functions
function renderTodos() {
    todoList.innerHTML = '';

    // 1. Filter by Priority & Completed
    let filtered = todos.filter(todo => {
        // Priority Filter
        if (currentFilter !== 'all' && todo.priority !== currentFilter) return false;

        // Completed View Mode (Existing logic)
        if (showingCompletedOnly) {
            return todo.completed;
        }
        // If searching, show all matching regardless of completed? 
        // Or strictly strictly stick to view mode. Let's stick to view mode.
        return true;
    });

    // 2. Search Filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(todo => todo.text.toLowerCase().includes(query));
    }

    // 3. Sort
    filtered.sort((a, b) => {
        if (currentSort === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (currentSort === 'priority') {
            const map = { high: 3, medium: 2, low: 1 };
            return map[b.priority] - map[a.priority];
        } else if (currentSort === 'date') {
            // Sort by due date (ascending, soonest first)
            // Handle empty dates (put them last)
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });

    // Update Main Progress Bar
    updateMainProgress();

    if (filtered.length === 0) {
        emptyState.querySelector('p').innerHTML = searchQuery
            ? "Aramanızla eşleşen görev bulunamadı."
            : (showingCompletedOnly ? "Tamamlanmış görev bulunamadı." : `Harika gidiyorsun! <br> Bugün yapılacak işin kalmadı.`);

        // Hide rocket if search result empty to avoid confusion? 
        // No, keep consistent styling.
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');

        filtered.forEach((todo) => {
            const originalIndex = todos.indexOf(todo);

            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('data-priority', todo.priority);

            // Priority Color Mapping
            let priorityColor = '';
            let priorityLabel = '';
            if (todo.priority === 'high') {
                priorityColor = 'var(--high-color)';
            } else if (todo.priority === 'medium') {
                priorityColor = 'var(--medium-color)';
                priorityLabel = 'Orta';
            } else {
                priorityColor = 'var(--low-color)';
                priorityLabel = 'Düşük';
            }

            const checkIcon = todo.completed ? 'check-circle-2' : 'circle';
            const checkClass = todo.completed ? 'active' : '';

            // Handle Date Display
            let dateHtml = '';
            if (todo.dueDate) {
                const dateObj = new Date(todo.dueDate);
                const formattedDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todoDateStr = todo.dueDate;
                const todayStr = today.toISOString().split('T')[0];

                let warningIcon = '';
                if (todoDateStr < todayStr && !todo.completed) {
                    warningIcon = `<i data-lucide="alert-circle" style="width:14px;height:14px;color:var(--high-color);margin-right:4px;"></i>`;
                }

                dateHtml = `<span class="date-tag" ${warningIcon ? 'style="color:var(--high-color);border-color:var(--high-bg);"' : ''}>${warningIcon}${!warningIcon ? '<i data-lucide="calendar" style="width:12px;height:12px;"></i> ' : ''}${formattedDate}</span>`;
            }

            li.innerHTML = `
                <div class="todo-content">
                    <span class="todo-text">${escapeHtml(todo.text).replace(/\n/g, '<br>')}</span>
                    <div class="meta-info">
                        <span class="todo-priority-dot" style="background-color: ${priorityColor}; box-shadow: 0 0 8px ${priorityColor};"></span>
                        ${priorityLabel}
                        ${dateHtml}
                    </div>
                </div>
                
                <div class="todo-actions">
                    <button class="complete-btn ${checkClass}" data-action="complete" data-index="${originalIndex}" aria-label="Tamamla">
                        <i data-lucide="${checkIcon}"></i>
                    </button>
                    <button class="edit-btn" data-action="edit" data-index="${originalIndex}" aria-label="Düzenle">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="delete-btn" data-action="delete" data-index="${originalIndex}" aria-label="Görevi Sil">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;

            todoList.appendChild(li);
        });

        lucide.createIcons();
    }
}

function updateMainProgress() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const rate = total === 0 ? 0 : (completed / total) * 100;

    if (mainProgressBar) {
        mainProgressBar.style.width = `${rate}%`;
    }

    // Confetti Trigger
    if (total > 0 && rate === 100 && !showingCompletedOnly) {
        // Check if we haven't celebrated yet (optional, but let's just trigger)
        // Limit celebration frequency?
        // For now, trigger only on explicit action (in toggleComplete), avoiding loop here.
    }
}

function handleAddOrUpdate() {
    const text = todoInput.value.trim();
    if (!text) {
        todoInput.style.borderColor = 'var(--high-color)';
        setTimeout(() => todoInput.style.borderColor = 'var(--glass-border)', 2000);
        return;
    }

    let selectedPriority = 'low';
    priorityInputs.forEach(input => {
        if (input.checked) {
            selectedPriority = input.value;
        }
    });

    const dateValue = todoDate.value;

    if (isEditing && currentEditIndex !== null) {
        // Update Existing
        todos[currentEditIndex].text = text;
        todos[currentEditIndex].priority = selectedPriority;
        todos[currentEditIndex].dueDate = dateValue;
    } else {
        // Create New
        const newTodo = {
            text: text,
            priority: selectedPriority,
            completed: false,
            dueDate: dateValue,
            createdAt: new Date()
        };
        todos.unshift(newTodo);
    }

    resetModal();
    closeModal();

    if (showingCompletedOnly && !isEditing) {
        renderTodos();
    } else {
        renderTodos();
    }
}

function openEditModal(index) {
    isEditing = true;
    currentEditIndex = index;
    const todo = todos[index];

    // Pre-fill fields
    todoInput.value = todo.text;
    todoDate.value = todo.dueDate || '';

    // Set Priority
    priorityInputs.forEach(input => {
        if (input.value === todo.priority) {
            input.checked = true;
        }
    });

    // Change UI Text
    document.querySelector('.modal-header h2').textContent = "Görevi Düzenle";
    addBtn.textContent = "Kaydet ve Güncelle";

    openModal();
}

function resetModal() {
    todoInput.value = '';
    todoDate.value = '';
    document.querySelector('input[value="low"]').checked = true;

    isEditing = false;
    currentEditIndex = null;

    document.querySelector('.modal-header h2').textContent = "Yeni Görev";
    addBtn.textContent = "Onayla ve Ekle";
}

function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function toggleViewMode() {
    showingCompletedOnly = !showingCompletedOnly;

    if (showingCompletedOnly) {
        viewCompletedBtn.classList.add('active');
        viewCompletedBtn.innerHTML = `<i data-lucide="list"></i> Tümünü Göster`;
        document.querySelector('header h1').textContent = "Tamamlananlar";
    } else {
        viewCompletedBtn.classList.remove('active');
        viewCompletedBtn.innerHTML = `<i data-lucide="check-circle"></i> Tamamlananlar`;
        document.querySelector('header h1').textContent = "Görevlerim";
    }

    lucide.createIcons();
    renderTodos();
}

function openModal() {
    todoModal.classList.add('active');
    todoInput.focus();
}

function closeModal() {
    todoModal.classList.remove('active');
    setTimeout(() => {
        if (!todoModal.classList.contains('active')) {
            resetModal();
        }
    }, 300);
}

// Helpers
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// Event Listeners
addBtn.addEventListener('click', handleAddOrUpdate);

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddOrUpdate();
    }
});

openModalBtn.addEventListener('click', () => {
    resetModal();
    openModal();
});
closeModalBtn.addEventListener('click', closeModal);
viewCompletedBtn.addEventListener('click', toggleViewMode);

// Close modal when clicking outside
todoModal.addEventListener('click', (e) => {
    if (e.target === todoModal) {
        closeModal();
    }
});

// Theme Logic
function toggleTheme() {
    document.body.classList.toggle('light-mode');

    const isLight = document.body.classList.contains('light-mode');
    themeToggleBtn.innerHTML = isLight
        ? `<i data-lucide="moon"></i>`
        : `<i data-lucide="sun"></i>`;

    lucide.createIcons();
}

themeToggleBtn.addEventListener('click', toggleTheme);

// Stats Elements
const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const closeStatsModalBtn = document.getElementById('closeStatsModalBtn');

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Dynamic Color for Rate
    const rateEl = document.getElementById('completionRate');
    if (rateEl) {
        if (rate < 30) rateEl.style.color = "var(--high-color)"; // Red
        else if (rate < 70) rateEl.style.color = "var(--medium-color)"; // Orange
        else rateEl.style.color = "var(--low-color)"; // Green
    }

    // Animate Numbers
    const animateValue = (id, start, end, duration) => {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + (id === 'completionRate' ? '%' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    animateValue("totalTasks", 0, total, 1000);
    animateValue("completedTasks", 0, completed, 1000);
    animateValue("pendingTasks", 0, pending, 1000);
    animateValue("completionRate", 0, rate, 1000);

    setTimeout(() => {
        const bar = document.getElementById('statsProgressBar');
        if (bar) bar.style.width = `${rate}%`;
    }, 100);
}

function openStatsModal() {
    updateStats();
    statsModal.classList.add('active');
}

function closeStatsModal() {
    statsModal.classList.remove('active');
    const bar = document.getElementById('statsProgressBar');
    if (bar) bar.style.width = '0%';
}

if (statsBtn) statsBtn.addEventListener('click', openStatsModal);
if (closeStatsModalBtn) closeStatsModalBtn.addEventListener('click', closeStatsModal);

if (statsModal) {
    statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) {
            closeStatsModal();
        }
    });
}

// Event Delegation for List Actions
todoList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    // Safety check for NaN
    if (isNaN(index)) return;

    if (btn.dataset.action === 'delete') {
        deleteTodoWithAnim(btn, index);
    } else if (btn.dataset.action === 'complete') {
        toggleComplete(index);
    } else if (btn.dataset.action === 'edit') {
        openEditModal(index);
    }
});

// Delete Modal Elements
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteModalText = document.getElementById('deleteModalText');

let todoToDeleteIndex = null;
let deleteBtnReference = null;

function openDeleteModal(btnElement, index) {
    if (!todos[index]) return;

    todoToDeleteIndex = index;
    deleteBtnReference = btnElement;

    deleteModalText.textContent = `"${todos[index].text}" adlı görevi silmek istediğinize emin misiniz?`;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    todoToDeleteIndex = null;
    deleteBtnReference = null;
}

function confirmDelete() {
    if (todoToDeleteIndex !== null) {
        // Trigger animation on the referenced list item
        const li = deleteBtnReference.closest('.todo-item');
        if (li) {
            li.classList.add('slide-out');
            const idx = todoToDeleteIndex; // Capture index

            li.addEventListener('animationend', () => {
                deleteTodo(idx);
            }, { once: true });

            // Fallback
            setTimeout(() => {
                // Check if still exists (might be deleted by anim end)
                if (todos[idx] && todos[idx] === todos[todoToDeleteIndex]) {
                    // Wait, deleteTodo modifies array. 
                    // Safe to call deleteTodo(idx) if we haven't yet.
                    // But simpler: just run delete logic here if not run yet.
                }
            }, 500);
        } else {
            deleteTodo(todoToDeleteIndex);
        }
    }
    closeDeleteModal();
}

// Listeners for Delete Modal
if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmDelete);

if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Updated Helper used by Event Delegation
function deleteTodoWithAnim(btnElement, index) {
    openDeleteModal(btnElement, index);
}

// Listeners for New Features
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTodos();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTodos();
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

function triggerConfetti() {
    if (typeof confetti === 'function') {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }
}

// Update toggleComplete to trigger confetti
// We need to override the function defined previously or ensure this block runs after.
// Since we are appending, we can redefine or just modify original if feasible.
// But earlier toggleComplete was defined as function statement. 
// Redefining it:
window.originalToggleComplete = toggleComplete; // Wait, toggleComplete is function statement, hoisted.
// We can just overwrite it on window or simply define a new wrapper in onclick html?
// HTML calls toggleComplete(index).
// Let's redefine it.
toggleComplete = function (index) {
    const wasCompleted = todos[index].completed;
    todos[index].completed = !wasCompleted;

    // Check for celebration
    if (!wasCompleted) { // If just completed
        const total = todos.length;
        const completedCount = todos.filter(t => t.completed).length;
        if (total > 0 && completedCount === total) {
            triggerConfetti();
        }
    }
    renderTodos();
};

/* End of New Features Logic */

// Initial Render
renderTodos();
