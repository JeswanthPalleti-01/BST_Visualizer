class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        if (!this.root) {
            this.root = new TreeNode(value);
        } else {
            this.insertNode(this.root, value);
        }
    }

    insertNode(node, value) {
        if (value < node.value) {
            if (!node.left) {
                node.left = new TreeNode(value);
            } else {
                this.insertNode(node.left, value);
            }
        } else if (value > node.value) {
            if (!node.right) {
                node.right = new TreeNode(value);
            } else {
                this.insertNode(node.right, value);
            }
        }
    }

    search(value) {
        return this.searchNode(this.root, value);
    }

    searchNode(node, value) {
        if (!node) return null;
        if (value === node.value) return node;
        if (value < node.value) return this.searchNode(node.left, value);
        return this.searchNode(node.right, value);
    }
}

const tree = new BinarySearchTree();
const treeContainer = document.getElementById('treeContainer');
const insertButton = document.getElementById('insertButton');
const resetButton = document.getElementById('resetButton');
const searchButton = document.getElementById('searchButton');
const toggleDarkModeButton = document.getElementById('toggleDarkMode');
let darkModeEnabled = false;

// Insert, Reset, and Search Event Listeners
insertButton.addEventListener('click', insertNode);
resetButton.addEventListener('click', resetTree);
searchButton.addEventListener('click', searchNode);

document.getElementById('valueInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') insertNode();
});

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchNode();
});

// Traversal Button Event Listeners
document.getElementById('inorderButton').addEventListener('click', () => startTraversal('inorder'));
document.getElementById('preorderButton').addEventListener('click', () => startTraversal('preorder'));
document.getElementById('postorderButton').addEventListener('click', () => startTraversal('postorder'));

// Dark Mode Toggle
toggleDarkModeButton.addEventListener('click', () => {
    darkModeEnabled = !darkModeEnabled;
    document.body.classList.toggle('dark-mode', darkModeEnabled);
    renderTree();
});

// Insert Node
function insertNode() {
    const valueInput = document.getElementById('valueInput');
    const value = parseInt(valueInput.value);
    if (!isNaN(value)) {
        tree.insert(value);
        renderTree();
        valueInput.value = '';
    }
}

// Reset Tree
function resetTree() {
    tree.root = null;
    treeContainer.innerHTML = '';
    document.getElementById('traversalOutput').innerHTML = '';
}

// Search Node
function searchNode() {
    const searchInput = document.getElementById('searchInput');
    const value = parseInt(searchInput.value);
    if (!isNaN(value)) {
        renderTree();
        const node = tree.search(value);
        if (node) highlightNode(node);
        else alert('Value not found in the tree.');
        searchInput.value = '';
    }
}

// Highlight Node
function highlightNode(node) {
    const nodes = document.getElementsByClassName('node');
    for (let i = 0; i < nodes.length; i++) {
        if (parseInt(nodes[i].textContent) === node.value) {
            nodes[i].classList.add('highlight');
        }
    }
}

// Render Tree
function renderTree() {
    treeContainer.innerHTML = '';
    if (tree.root) {
        setNodePositions(tree.root, treeContainer.offsetWidth / 2, 40, treeContainer.offsetWidth / 4);
        drawTree(tree.root);
    }
}

// Set Node Positions
function setNodePositions(node, x, y, offset) {
    node.x = x;
    node.y = y;
    if (node.left) setNodePositions(node.left, x - offset, y + 80, offset / 2);
    if (node.right) setNodePositions(node.right, x + offset, y + 80, offset / 2);
}

// Draw Tree
function drawTree(node) {
    drawNode(node);
    if (node.left) {
        drawLine(node, node.left);
        drawTree(node.left);
    }
    if (node.right) {
        drawLine(node, node.right);
        drawTree(node.right);
    }
}

// Draw Node
function drawNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.style.left = `${node.x}px`;
    nodeElement.style.top = `${node.y}px`;
    nodeElement.textContent = node.value;
    treeContainer.appendChild(nodeElement);
}

// Draw Line
function drawLine(parent, child) {
    const line = document.createElement('div');
    line.className = 'line';

    const deltaX = child.x - parent.x;
    const deltaY = child.y - parent.y;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const startOffsetX = (deltaX / Math.sqrt(deltaX * deltaX + deltaY * deltaY)) * 25;
    const startOffsetY = (deltaY / Math.sqrt(deltaX * deltaX + deltaY * deltaY)) * 25;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) - 50;

    line.style.width = `${length}px`;
    line.style.transform = `translate(${parent.x + startOffsetX}px, ${parent.y + startOffsetY}px) rotate(${angle}deg)`;
    treeContainer.appendChild(line);
}

// Traversal Functions
function inorderTraversal(node, result = []) {
    if (node) {
        inorderTraversal(node.left, result);
        result.push(node);
        inorderTraversal(node.right, result);
    }
    return result;
}

function preorderTraversal(node, result = []) {
    if (node) {
        result.push(node);
        preorderTraversal(node.left, result);
        preorderTraversal(node.right, result);
    }
    return result;
}

function postorderTraversal(node, result = []) {
    if (node) {
        postorderTraversal(node.left, result);
        postorderTraversal(node.right, result);
        result.push(node);
    }
    return result;
}

// Start Traversal with Animation
function startTraversal(type) {
    const nodes = type === 'inorder' ? inorderTraversal(tree.root) :
                  type === 'preorder' ? preorderTraversal(tree.root) :
                  postorderTraversal(tree.root);
    
    animateTraversal(nodes);
    displayTraversalOrder(nodes, type);
}

// Animate Traversal
function animateTraversal(nodes) {
    let index = 0;
    function highlightNext() {
        if (index > 0) {
            document.querySelectorAll('.node')[index - 1].classList.remove('highlight');
        }
        if (index < nodes.length) {
            const nodeElement = Array.from(document.getElementsByClassName('node'))
                .find(el => parseInt(el.textContent) === nodes[index].value);
            if (nodeElement) nodeElement.classList.add('highlight');
            index++;
            setTimeout(highlightNext, 1000);  // Delay between highlights
        }
    }
    highlightNext();
}

// Display Traversal Order
function displayTraversalOrder(nodes, type) {
    const output = document.getElementById('traversalOutput');
    const sequence = nodes.map(node => node.value).join(' → ');
    output.innerHTML = `<strong>${type.charAt(0).toUpperCase() + type.slice(1)} Order:</strong> ${sequence}`;
}
