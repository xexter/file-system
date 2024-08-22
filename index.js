import fs from 'fs';
import path from 'path';
import readline from 'readline';

const tasksFilePath = path.join('./', 'tasks.txt');

// Create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility functions
const loadTasks = () => {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        return data.split('\n').filter(line => line).map(line => {
            const [id, completed, description] = line.split('|');
            return {
                id: parseInt(id),
                completed: completed === 'true',
                description
            };
        });
    }
    return [];
};

const saveTasks = (tasks) => {
    const data = tasks.map(task => `${task.id}  |${task.completed}| ${task.description}`).join('\n');
    fs.writeFileSync(tasksFilePath, data);
};

const addTask = (description) => {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        completed: false
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log('Task added:', newTask);
};

const viewTasks = () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
        return;
    }
    tasks.forEach(task => {
        console.log(`${task.id}. [${task.completed ? 'X' : ' '}] ${task.description}`);
    });
};

const markTaskComplete = (id) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === parseInt(id));
    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log(`Task ${id} marked as complete.`);
    } else {
        console.log(`Task ${id} not found.`);
    }
};

const removeTask = (id) => {
    let tasks = loadTasks();
    tasks = tasks.filter(task => task.id !== parseInt(id));
    saveTasks(tasks);
    console.log(`Task ${id} removed.`);
};

// Command-line interface
const userInput = () => {
    console.log('\nTask Manager');
    console.log('1. Add a new task');
    console.log('2. View tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');

    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                rl.question('Enter task description: ', (description) => {
                    addTask(description);
                    userInput();
                });
                break;
            case '2':
                viewTasks();
                userInput();
                break;
            case '3':
                rl.question('Enter task ID to mark as complete: ', (id) => {
                    markTaskComplete(id);
                    userInput();
                });
                break;
            case '4':
                rl.question('Enter task ID to remove: ', (id) => {
                    removeTask(id);
                    userInput();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option.');
                userInput();
                break;
        }
    });
};

userInput();
