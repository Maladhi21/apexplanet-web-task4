document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Initialize
    renderTodos();

    // Add Task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };
            todos.push(newTodo);
            saveAndRender();
            todoInput.value = '';
        }
    });

    // Delete or Toggle Task
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.closest('.todo-item').dataset.id;
            todos = todos.filter(todo => todo.id !== id);
            saveAndRender();
        } else if (e.target.classList.contains('checkbox')) {
            const id = e.target.closest('.todo-item').dataset.id;
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = e.target.checked;
                saveAndRender();
            }
        }
    });

    // Edit Task (Double Click)
    todoList.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('todo-text')) {
            const li = e.target.closest('.todo-item');
            const id = li.dataset.id;
            const todo = todos.find(t => t.id === id);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.text;
            input.className = 'edit-input';
            
            li.replaceChild(input, e.target);
            input.focus();

            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    todo.text = newText;
                }
                saveAndRender();
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit();
            });
        }
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Clear Completed
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    });

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${escapeHTML(todo.text)}</span>
                <button class="delete-btn">&times;</button>
            `;
            
            todoList.appendChild(li);
        });

        updateStats();
    }

    function updateStats() {
        const activeCount = todos.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
