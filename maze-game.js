document.addEventListener('DOMContentLoaded', function() {
    const mazeContainer = document.getElementById('maze-game');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const learningRateSlider = document.getElementById('learning-rate');
    const explorationRateSlider = document.getElementById('exploration-rate');
    const speedSlider = document.getElementById('speed');
    const stepCountElement = document.getElementById('step-count');
    const successCountElement = document.getElementById('success-count');
    
    if (!mazeContainer || !startButton || !resetButton) return;
    
    // Maze configuration
    const mazeConfig = {
        rows: 6,
        cols: 6,
        walls: [
            {row: 0, col: 2}, {row: 0, col: 5},
            {row: 1, col: 2}, {row: 1, col: 5},
            {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4},
            {row: 3, col: 0}, {row: 3, col: 4},
            {row: 4, col: 2}, {row: 4, col: 4},
            {row: 5, col: 2}
        ],
        startPos: {row: 0, col: 0},
        goalPos: {row: 5, col: 5}
    };
    
    // Q-learning parameters
    let learningRate = 0.1;
    let discountFactor = 0.9;
    let explorationRate = 0.3;
    let simulationSpeed = 200; // ms between steps
    
    // Game state
    let maze = [];
    let qValues = {};
    let agent = {
        row: mazeConfig.startPos.row,
        col: mazeConfig.startPos.col
    };
    let running = false;
    let stepCount = 0;
    let successCount = 0;
    
    // Initialize maze
    function initializeMaze() {
        mazeContainer.innerHTML = '';
        maze = [];
        qValues = {};
        agent = {
            row: mazeConfig.startPos.row,
            col: mazeConfig.startPos.col
        };
        stepCount = 0;
        successCount = 0;
        
        updateCounters();
        
        // Create grid container
        const grid = document.createElement('div');
        grid.className = 'maze-container';
        grid.style.gridTemplateColumns = `repeat(${mazeConfig.cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${mazeConfig.rows}, 1fr)`;
        
        // Create cells
        for (let row = 0; row < mazeConfig.rows; row++) {
            maze[row] = [];
            for (let col = 0; col < mazeConfig.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                // Check if it's a wall
                const isWall = mazeConfig.walls.some(wall => wall.row === row && wall.col === col);
                if (isWall) {
                    cell.classList.add('maze-wall');
                }
                
                // Check if it's the goal
                if (row === mazeConfig.goalPos.row && col === mazeConfig.goalPos.col) {
                    cell.classList.add('maze-goal');
                }
                
                // Initialize Q-values
                const stateId = `${row},${col}`;
                qValues[stateId] = [0, 0, 0, 0]; // Up, Right, Down, Left
                
                // Add Q-value display
                if (!isWall) {
                    const directions = [
                        {name: 'q-up', text: '0.0'},
                        {name: 'q-right', text: '0.0'},
                        {name: 'q-down', text: '0.0'},
                        {name: 'q-left', text: '0.0'}
                    ];
                    
                    directions.forEach(dir => {
                        const qValue = document.createElement('div');
                        qValue.className = `q-value ${dir.name}`;
                        qValue.textContent = dir.text;
                        cell.appendChild(qValue);
                    });
                }
                
                grid.appendChild(cell);
                maze[row][col] = {
                    element: cell,
                    isWall: isWall,
                    isGoal: row === mazeConfig.goalPos.row && col === mazeConfig.goalPos.col
                };
            }
        }
        
        // Add agent to starting position
        const agentElement = document.createElement('div');
        agentElement.className = 'maze-agent';
        maze[agent.row][agent.col].element.appendChild(agentElement);
        
        mazeContainer.appendChild(grid);
    }
    
    // Update counters
    function updateCounters() {
        if (stepCountElement) stepCountElement.textContent = stepCount;
        if (successCountElement) successCountElement.textContent = successCount;
    }
    
    // Q-learning functions
    function getQValue(row, col, action) {
        return qValues[`${row},${col}`][action];
    }
    
    function setQValue(row, col, action, value) {
        qValues[`${row},${col}`][action] = value;
        
        // Update display
        const cell = maze[row][col].element;
        const qDisplay = cell.querySelectorAll('.q-value');
        
        if (qDisplay.length === 4) {
            qDisplay[action].textContent = value.toFixed(1);
        }
    }
    
    function getMaxQValue(row, col) {
        return Math.max(...qValues[`${row},${col}`]);
    }
    
    function getBestAction(row, col) {
        const values = qValues[`${row},${col}`];
        let maxValue = -Infinity;
        let bestActions = [];
        
        values.forEach((value, index) => {
            if (value > maxValue) {
                maxValue = value;
                bestActions = [index];
            } else if (value === maxValue) {
                bestActions.push(index);
            }
        });
        
        // If there are multiple best actions, choose one randomly
        return bestActions[Math.floor(Math.random() * bestActions.length)];
    }
    
    function chooseAction(row, col) {
        // Exploration vs Exploitation
        if (Math.random() < explorationRate) {
            // Explore: choose random action
            return Math.floor(Math.random() * 4);
        } else {
            // Exploit: choose best action
            return getBestAction(row, col);
        }
    }
    
    function getNextState(row, col, action) {
        let newRow = row;
        let newCol = col;
        
        // Up
        if (action === 0 && row > 0) {
            newRow--;
        }
        // Right
        else if (action === 1 && col < mazeConfig.cols - 1) {
            newCol++;
        }
        // Down
        else if (action === 2 && row < mazeConfig.rows - 1) {
            newRow++;
        }
        // Left
        else if (action === 3 && col > 0) {
            newCol--;
        }
        
        // Check if it's a wall
        if (maze[newRow] && maze[newRow][newCol] && maze[newRow][newCol].isWall) {
            return { row, col }; // Stay in place
        }
        
        return { row: newRow, col: newCol };
    }
    
    function getReward(row, col) {
        if (row === mazeConfig.goalPos.row && col === mazeConfig.goalPos.col) {
            return 10; // Goal state
        }
        return -0.1; // Small penalty for each step
    }
    
    function moveAgent(row, col) {
        // Remove agent from current cell
        const currentCell = maze[agent.row][agent.col].element;
        const agentElement = currentCell.querySelector('.maze-agent');
        
        if (agentElement) {
            currentCell.removeChild(agentElement);
        }
        
        // Mark cell as visited
        maze[agent.row][agent.col].element.classList.add('maze-visited');
        
        // Update agent position
        agent.row = row;
        agent.col = col;
        
        // Add agent to new cell
        const newAgentElement = document.createElement('div');
        newAgentElement.className = 'maze-agent';
        maze[row][col].element.appendChild(newAgentElement);
    }
    
    function simulationStep() {
        if (!running) return;
        
        // Choose action
        const action = chooseAction(agent.row, agent.col);
        
        // Get next state
        const nextState = getNextState(agent.row, agent.col, action);
        
        // Get reward
        const reward = getReward(nextState.row, nextState.col);
        
        // Update Q-value
        const currentQValue = getQValue(agent.row, agent.col, action);
        const maxNextQValue = getMaxQValue(nextState.row, nextState.col);
        const newQValue = currentQValue + learningRate * (reward + discountFactor * maxNextQValue - currentQValue);
        
        setQValue(agent.row, agent.col, action, newQValue);
        
        // Move agent
        moveAgent(nextState.row, nextState.col);
        
        // Increment step count
        stepCount++;
        updateCounters();
        
        // Check if agent reached goal
        if (nextState.row === mazeConfig.goalPos.row && nextState.col === mazeConfig.goalPos.col) {
            successCount++;
            updateCounters();
            
            setTimeout(() => {
                if (running) {
                    // Reset agent position but keep Q-values
                    moveAgent(mazeConfig.startPos.row, mazeConfig.startPos.col);
                    simulationStep();
                }
            }, 1000);
        } else {
            // Continue simulation
            setTimeout(simulationStep, simulationSpeed);
        }
    }
    
    // Event listeners
    startButton.addEventListener('click', function() {
        if (!running) {
            running = true;
            this.textContent = '暂停学习';
            
            // Update parameters
            learningRate = parseFloat(learningRateSlider.value);
            explorationRate = parseFloat(explorationRateSlider.value);
            simulationSpeed = 1000 / (parseInt(speedSlider.value) * 2);
            
            simulationStep();
        } else {
            running = false;
            this.textContent = '开始学习';
        }
    });
    
    resetButton.addEventListener('click', function() {
        running = false;
        startButton.textContent = '开始学习';
        initializeMaze();
    });
    
    learningRateSlider.addEventListener('input', function() {
        learningRate = parseFloat(this.value);
    });
    
    explorationRateSlider.addEventListener('input', function() {
        explorationRate = parseFloat(this.value);
    });
    
    speedSlider.addEventListener('input', function() {
        simulationSpeed = 1000 / (parseInt(this.value) * 2);
    });
    
    // Initialize the maze
    initializeMaze();
});
