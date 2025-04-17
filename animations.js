document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initHeroAnimation();
    initRLLoopAnimation();
    initQLearningAnimation();
});

// Hero Animation - Brain with neurons lighting up
function initHeroAnimation() {
    const container = document.getElementById('hero-animation');
    if (!container) return;
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 200");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    // Create brain outline
    const brain = document.createElementNS("http://www.w3.org/2000/svg", "path");
    brain.setAttribute("d", "M100,30 C130,20 160,35 165,65 C170,90 160,110 140,120 C160,130 170,150 160,175 C150,190 120,195 100,190 C80,195 50,190 40,175 C30,150 40,130 60,120 C40,110 30,90 35,65 C40,35 70,20 100,30");
    brain.setAttribute("fill", "none");
    brain.setAttribute("stroke", "#374151");
    brain.setAttribute("stroke-width", "3");
    
    svg.appendChild(brain);
    
    // Create neurons (circles)
    const neurons = [];
    const neuronPositions = [
        {x: 70, y: 50}, {x: 90, y: 40}, {x: 110, y: 45}, {x: 130, y: 55},
        {x: 60, y: 75}, {x: 80, y: 70}, {x: 100, y: 65}, {x: 120, y: 70}, {x: 140, y: 80},
        {x: 70, y: 100}, {x: 90, y: 95}, {x: 110, y: 95}, {x: 130, y: 100},
        {x: 60, y: 125}, {x: 80, y: 120}, {x: 100, y: 125}, {x: 120, y: 120}, {x: 140, y: 125},
        {x: 70, y: 150}, {x: 90, y: 155}, {x: 110, y: 160}, {x: 130, y: 155}
    ];
    
    neuronPositions.forEach((pos, index) => {
        const neuron = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        neuron.setAttribute("cx", pos.x);
        neuron.setAttribute("cy", pos.y);
        neuron.setAttribute("r", 4);
        neuron.setAttribute("fill", "#cbd5e1");
        
        svg.appendChild(neuron);
        neurons.push(neuron);
    });
    
    // Create connections (lines)
    const connections = [];
    
    // Only create connections between nearby neurons
    for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
            const pos1 = neuronPositions[i];
            const pos2 = neuronPositions[j];
            
            // Calculate distance between neurons
            const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
            
            // Only connect neurons that are close enough
            if (distance < 40) {
                const connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
                connection.setAttribute("x1", pos1.x);
                connection.setAttribute("y1", pos1.y);
                connection.setAttribute("x2", pos2.x);
                connection.setAttribute("y2", pos2.y);
                connection.setAttribute("stroke", "#e2e8f0");
                connection.setAttribute("stroke-width", "1");
                
                svg.appendChild(connection);
                connections.push(connection);
            }
        }
    }
    
    container.appendChild(svg);
    
    // Animation
    function animateNeurons() {
        // Randomly select neurons to activate
        const activatedNeurons = [];
        const numToActivate = 3 + Math.floor(Math.random() * 4); // 3-6 neurons
        
        for (let i = 0; i < numToActivate; i++) {
            const index = Math.floor(Math.random() * neurons.length);
            if (!activatedNeurons.includes(index)) {
                activatedNeurons.push(index);
            }
        }
        
        // Activate neurons and connections
        activatedNeurons.forEach(index => {
            const neuron = neurons[index];
            
            // Animate neuron
            neuron.setAttribute("fill", "#fbbf24");
            neuron.setAttribute("r", "6");
            
            // Find connections to this neuron
            connections.forEach(connection => {
                const x1 = parseFloat(connection.getAttribute("x1"));
                const y1 = parseFloat(connection.getAttribute("y1"));
                const x2 = parseFloat(connection.getAttribute("x2"));
                const y2 = parseFloat(connection.getAttribute("y2"));
                
                const pos = neuronPositions[index];
                
                // If this connection is connected to the activated neuron
                if ((Math.abs(x1 - pos.x) < 1 && Math.abs(y1 - pos.y) < 1) ||
                    (Math.abs(x2 - pos.x) < 1 && Math.abs(y2 - pos.y) < 1)) {
                    connection.setAttribute("stroke", "#fbbf24");
                    connection.setAttribute("stroke-width", "2");
                }
            });
            
            // Reset after a delay
            setTimeout(() => {
                neuron.setAttribute("fill", "#cbd5e1");
                neuron.setAttribute("r", "4");
                
                connections.forEach(connection => {
                    connection.setAttribute("stroke", "#e2e8f0");
                    connection.setAttribute("stroke-width", "1");
                });
            }, 1000);
        });
        
        // Schedule next animation
        setTimeout(animateNeurons, 1500);
    }
    
    // Start animation
    setTimeout(animateNeurons, 1000);
}

// RL Loop Animation
function initRLLoopAnimation() {
    const container = document.getElementById('rl-loop-animation');
    if (!container) return;
    
    // Create div for the animation
    const animContainer = document.createElement('div');
    animContainer.className = 'rl-loop-container';
    container.appendChild(animContainer);
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 800 240");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    animContainer.appendChild(svg);
    
    // Define marker for arrows
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Action arrow marker
    const actionMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    actionMarker.setAttribute("id", "action-arrow");
    actionMarker.setAttribute("markerWidth", "10");
    actionMarker.setAttribute("markerHeight", "7");
    actionMarker.setAttribute("refX", "9");
    actionMarker.setAttribute("refY", "3.5");
    actionMarker.setAttribute("orient", "auto");
    
    const actionPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    actionPolygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    actionPolygon.setAttribute("fill", "#ec4899");
    
    actionMarker.appendChild(actionPolygon);
    
    // Reward arrow marker
    const rewardMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    rewardMarker.setAttribute("id", "reward-arrow");
    rewardMarker.setAttribute("markerWidth", "10");
    rewardMarker.setAttribute("markerHeight", "7");
    rewardMarker.setAttribute("refX", "9");
    rewardMarker.setAttribute("refY", "3.5");
    rewardMarker.setAttribute("orient", "auto");
    
    const rewardPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    rewardPolygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    rewardPolygon.setAttribute("fill", "#10b981");
    
    rewardMarker.appendChild(rewardPolygon);
    
    defs.appendChild(actionMarker);
    defs.appendChild(rewardMarker);
    svg.appendChild(defs);
    
    // Create agent
    const agent = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    agent.setAttribute("cx", "150");
    agent.setAttribute("cy", "120");
    agent.setAttribute("r", "40");
    agent.setAttribute("fill", "#fbbf24");
    
    // Agent face
    const agentEye1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    agentEye1.setAttribute("cx", "135");
    agentEye1.setAttribute("cy", "110");
    agentEye1.setAttribute("r", "5");
    agentEye1.setAttribute("fill", "white");
    
    const agentEye2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    agentEye2.setAttribute("cx", "165");
    agentEye2.setAttribute("cy", "110");
    agentEye2.setAttribute("r", "5");
    agentEye2.setAttribute("fill", "white");
    
    const agentSmile = document.createElementNS("http://www.w3.org/2000/svg", "path");
    agentSmile.setAttribute("d", "M 130,130 Q 150,145 170,130");
    agentSmile.setAttribute("stroke", "white");
    agentSmile.setAttribute("stroke-width", "3");
    agentSmile.setAttribute("fill", "none");
    
    // Create environment
    const environment = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    environment.setAttribute("x", "550");
    environment.setAttribute("y", "80");
    environment.setAttribute("width", "80");
    environment.setAttribute("height", "80");
    environment.setAttribute("rx", "10");
    environment.setAttribute("fill", "#60a5fa");
    
    // Create state
    const state = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    state.setAttribute("cx", "350");
    state.setAttribute("cy", "60");
    state.setAttribute("r", "20");
    state.setAttribute("fill", "#f97316");
    
    // Create reward
    const reward = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    reward.setAttribute("points", "350,180 360,200 380,200 365,215 370,235 350,225 330,235 335,215 320,200 340,200");
    reward.setAttribute("fill", "#10b981");
    
    // Create arrows
    const actionArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    actionArrow.setAttribute("d", "M 190,120 C 250,120 250,120 310,120 L 310,60 C 310,60 330,60 350,60");
    actionArrow.setAttribute("stroke", "#ec4899");
    actionArrow.setAttribute("stroke-width", "3");
    actionArrow.setAttribute("fill", "none");
    actionArrow.setAttribute("marker-end", "url(#action-arrow)");
    
    const stateEnvArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    stateEnvArrow.setAttribute("d", "M 370,60 C 450,60 450,60 500,60 L 500,120 C 500,120 520,120 550,120");
    stateEnvArrow.setAttribute("stroke", "#f97316");
    stateEnvArrow.setAttribute("stroke-width", "3");
    stateEnvArrow.setAttribute("fill", "none");
    stateEnvArrow.setAttribute("marker-end", "url(#action-arrow)");
    
    const envRewardArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    envRewardArrow.setAttribute("d", "M 550,140 C 520,140 500,140 500,140 L 500,200 C 500,200 450,200 400,200 L 380,200");
    envRewardArrow.setAttribute("stroke", "#10b981");
    envRewardArrow.setAttribute("stroke-width", "3");
    envRewardArrow.setAttribute("fill", "none");
    envRewardArrow.setAttribute("marker-end", "url(#reward-arrow)");
    
    const rewardAgentArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rewardAgentArrow.setAttribute("d", "M 330,200 C 300,200 250,200 250,200 L 250,140 C 250,140 230,140 190,140");
    rewardAgentArrow.setAttribute("stroke", "#10b981");
    rewardAgentArrow.setAttribute("stroke-width", "3");
    rewardAgentArrow.setAttribute("fill", "none");
    rewardAgentArrow.setAttribute("marker-end", "url(#reward-arrow)");
    
    // Text labels
    const agentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    agentText.setAttribute("x", "150");
    agentText.setAttribute("y", "200");
    agentText.setAttribute("text-anchor", "middle");
    agentText.setAttribute("fill", "#1f2937");
    agentText.textContent = "智能体";
    
    const environmentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    environmentText.setAttribute("x", "590");
    environmentText.setAttribute("y", "200");
    environmentText.setAttribute("text-anchor", "middle");
    environmentText.setAttribute("fill", "#1f2937");
    environmentText.textContent = "环境";
    
    const actionText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    actionText.setAttribute("x", "250");
    actionText.setAttribute("y", "100");
    actionText.setAttribute("text-anchor", "middle");
    actionText.setAttribute("fill", "#ec4899");
    actionText.textContent = "行动";
    
    const stateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    stateText.setAttribute("x", "430");
    stateText.setAttribute("y", "40");
    stateText.setAttribute("text-anchor", "middle");
    stateText.setAttribute("fill", "#f97316");
    stateText.textContent = "状态";
    
    const rewardText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rewardText.setAttribute("x", "430");
    rewardText.setAttribute("y", "220");
    rewardText.setAttribute("text-anchor", "middle");
    rewardText.setAttribute("fill", "#10b981");
    rewardText.textContent = "奖励";
    
    // Add elements to SVG
    svg.appendChild(actionArrow);
    svg.appendChild(stateEnvArrow);
    svg.appendChild(envRewardArrow);
    svg.appendChild(rewardAgentArrow);
    
    svg.appendChild(environment);
    svg.appendChild(agent);
    svg.appendChild(agentEye1);
    svg.appendChild(agentEye2);
    svg.appendChild(agentSmile);
    svg.appendChild(state);
    svg.appendChild(reward);
    
    svg.appendChild(agentText);
    svg.appendChild(environmentText);
    svg.appendChild(actionText);
    svg.appendChild(stateText);
    svg.appendChild(rewardText);
    
    // Animation variables
    let phase = 0;
    
    function animate() {
        phase = (phase + 0.01) % (2 * Math.PI);
        
        // Animate agent "thinking"
        agent.setAttribute("r", 40 + Math.sin(phase) * 2);
        
        // Animate action flowing from agent to environment
        const actionOpacity = (Math.sin(phase) + 1) / 2;
        actionArrow.setAttribute("stroke-opacity", actionOpacity);
        stateEnvArrow.setAttribute("stroke-opacity", actionOpacity);
        
        // Animate environment processing
        environment.setAttribute("width", 80 + Math.sin(phase + Math.PI/2) * 5);
        environment.setAttribute("height", 80 + Math.sin(phase + Math.PI/2) * 5);
        
        // Animate reward flowing back to agent
        const rewardOpacity = (Math.sin(phase + Math.PI) + 1) / 2;
        envRewardArrow.setAttribute("stroke-opacity", rewardOpacity);
        rewardAgentArrow.setAttribute("stroke-opacity", rewardOpacity);
        
        // Pulse state and reward
        state.setAttribute("r", 20 + Math.sin(phase + Math.PI/3) * 2);
        const rewardScale = 1 + Math.sin(phase + Math.PI/2) * 0.1;
        reward.setAttribute("transform", `scale(${rewardScale}) translate(${(1-rewardScale)*350}, ${(1-rewardScale)*205})`);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Q-Learning Animation
function initQLearningAnimation() {
    const container = document.getElementById('q-learning-animation');
    if (!container) return;
    
    // Grid settings
    const gridSize = 4;
    const cellSize = 60;
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-world';
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;
    gridContainer.style.width = `${gridSize * cellSize + (gridSize-1) * 4}px`;
    gridContainer.style.margin = '0 auto';
    
    // Define goal state
    const goalState = {row: 3, col: 3};
    
    // Create grid cells
    const cells = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            
            // Mark goal state
            if (row === goalState.row && col === goalState.col) {
                cell.classList.add('grid-goal');
            }
            
            // Add q-values for each direction
            const directions = [
                {class: 'q-up', text: '0.0'},
                {class: 'q-right', text: '0.0'},
                {class: 'q-down', text: '0.0'},
                {class: 'q-left', text: '0.0'}
            ];
            
            directions.forEach(dir => {
                const qValue = document.createElement('div');
                qValue.className = `q-value ${dir.class}`;
                qValue.textContent = dir.text;
                cell.appendChild(qValue);
            });
            
            gridContainer.appendChild(cell);
            cells.push({
                element: cell,
                row: row,
                col: col,
                isGoal: row === goalState.row && col === goalState.col
            });
        }
    }
    
    // Add agent to initial position
    const agent = document.createElement('div');
    agent.className = 'grid-agent';
    let agentPos = {row: 0, col: 0};
    cells[0].element.appendChild(agent);
    
    container.appendChild(gridContainer);
    
    // Initialize Q-table
    const qTable = {};
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            qTable[`${row},${col}`] = [0, 0, 0, 0]; // Up, Right, Down, Left
        }
    }
    
    // Q-learning parameters
    const learningRate = 0.1;
    const discountFactor = 0.9;
    const explorationRate = 0.2;
    
    // Utility functions
    function getQValue(row, col, action) {
        return qTable[`${row},${col}`][action];
    }
    
    function setQValue(row, col, action, value) {
        qTable[`${row},${col}`][action] = value;
        
        // Update display
        const cellIndex = row * gridSize + col;
        const cell = cells[cellIndex].element;
        const qValueElements = cell.querySelectorAll('.q-value');
        qValueElements[action].textContent = value.toFixed(1);
    }
    
    function getMaxQValue(row, col) {
        return Math.max(...qTable[`${row},${col}`]);
    }
    
    function chooseAction(row, col) {
        // Explore or exploit
        if (Math.random() < explorationRate) {
            return Math.floor(Math.random() * 4);
        } else {
            // Find action with maximum Q-value
            const qValues = qTable[`${row},${col}`];
            let maxValue = -Infinity;
            let bestActions = [];
            
            qValues.forEach((value, index) => {
                if (value > maxValue) {
                    maxValue = value;
                    bestActions = [index];
                } else if (value === maxValue) {
                    bestActions.push(index);
                }
            });
            
            // If multiple best actions, choose randomly among them
            return bestActions[Math.floor(Math.random() * bestActions.length)];
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
        else if (action === 1 && col < gridSize - 1) {
            newCol++;
        } 
        // Down
        else if (action === 2 && row < gridSize - 1) {
            newRow++;
        } 
        // Left
        else if (action === 3 && col > 0) {
            newCol--;
        }
        
        return {row: newRow, col: newCol};
    }
    
    function getReward(row, col) {
        return (row === goalState.row && col === goalState.col) ? 10 : -0.1;
    }
    
    function moveAgent(row, col) {
        // Remove agent from current cell
        const currentIndex = agentPos.row * gridSize + agentPos.col;
        const currentCell = cells[currentIndex].element;
        if (currentCell.contains(agent)) {
            currentCell.removeChild(agent);
        }
        
        // Update agent position
        agentPos = {row, col};
        
        // Add agent to new cell
        const newIndex = row * gridSize + col;
        const newCell = cells[newIndex].element;
        newCell.appendChild(agent);
    }
    
    // Perform one step of Q-learning
    function qLearningStep() {
        // Choose action
        const action = chooseAction(agentPos.row, agentPos.col);
        
        // Get next state
        const nextState = getNextState(agentPos.row, agentPos.col, action);
        
        // Get reward
        const reward = getReward(nextState.row, nextState.col);
        
        // Update Q-value
        const currentQValue = getQValue(agentPos.row, agentPos.col, action);
        const maxNextQValue = getMaxQValue(nextState.row, nextState.col);
        const newQValue = currentQValue + learningRate * (reward + discountFactor * maxNextQValue - currentQValue);
        
        setQValue(agentPos.row, agentPos.col, action, newQValue);
        
        // Move agent
        moveAgent(nextState.row, nextState.col);
        
        // Reset if reached goal
        if (nextState.row === goalState.row && nextState.col === goalState.col) {
            setTimeout(() => {
                moveAgent(0, 0);
                qLearningStep();
            }, 1000);
        } else {
            // Continue simulation
            setTimeout(qLearningStep, 500);
        }
    }
    
    // Start Q-learning
    setTimeout(qLearningStep, 1000);
}
