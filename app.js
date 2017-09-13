// CLASSES
function Cluster(){
  let dom;
  let domNodes;
  let domNodeOrigin;
  let nodes = [];
  let rotation = 0;
  let rotationTimer;

  let _addNode = () => {
    let index = nodes.length;
    let newNode = new Node(domNodeOrigin, index + 1);
    nodes.push(newNode);
    _balanceNodes();
  }

  let _subtractNode = () => {
    if (nodes.length){
      nodes[nodes.length - 1].delete();
      nodes.pop();
      _balanceNodes();
    }
  }

  let _balanceNodes = () => {
    nodes.forEach((node, index) => {
      node.revolve((360 / nodes.length) * (index));
    })
  }

  let _startRotation = direction => {
    rotationTimer = direction === 'cc' ?
      setInterval(() => _rotate('cc'), 7):
      setInterval(() => _rotate('cw'), 7);
  }

  let _rotate = direction => {
    direction === 'cc' ? rotation -= 1 : rotation += 1;
    domNodes.style.transform = 'rotate(' + rotation + 'deg)';
  }

  let _clearRotation = () => {
    clearInterval(rotationTimer);
  }

  let _scale = () => {
    let width = dom.offsetWidth;
    dom.style.height = width + 'px';
    domNodeOrigin.style.transformOrigin = '25px ' + ((width / 2) + 25).toString() + 'px';
  }

  let _INITIALIZE = (() => {

    let cluster = $('<section />', { "class": 'cluster' })[0];
    let nodeControls = $('<div />', { "class": 'node-controls' })[0];
    let add = $('<div />', { "class": 'add-node node-control', click: () => _addNode() })[0];
    let subtract = $('<div />', { "class": 'subtract-node node-control', click: () => _subtractNode() })[0];

    let rotateCC = $('<div />', { "class": 'rotate-node-cc node-control' })[0];
    $(rotateCC).on('mousedown touchstart', () => _startRotation('cc'));
    $(rotateCC).on('mouseup mouseout touchend', () => _clearRotation());

    let rotateCW = $('<div />', { "class": 'rotate-node-cw node-control' })[0];
    $(rotateCW).on('mousedown touchstart', () => _startRotation('cw'));
    $(rotateCW).on('mouseup mouseout touchend', () => _clearRotation());

    let nodes = $('<div />', { "class": 'nodes' })[0];
    let nodeOrigin = $('<div />', { "class": 'node-origin' })[0];

    $(nodeControls).append(add, subtract, rotateCC, rotateCW);
    $(nodes).append(nodeOrigin);
    $(cluster).append(nodeControls, nodes).hide();
    $('#new-cluster').before(cluster);
    $(cluster).fadeIn(250)

    dom = cluster;
    domNodeOrigin = nodeOrigin;
    domNodes = nodes;

    _scale();
    window.addEventListener("resize", _scale);
  })();
}


function Node(parent, label){
  let dom;
  let rotation = 0;

  this.revolve = degrees => {
    rotation = degrees;
    dom.style.transform = 'rotate(' + rotation + 'deg)';
  }

  this.delete = () => {
    dom.remove();
  }

  let _setColor = () => {
    let chars = '0123456789ABCDEF';
    let hex = '#';
    for (let i = 0; i < 6; i++) {
      hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
  }

  let _INITIALIZE = (() => {
    let node = document.createElement('div');
    node.className = 'node';
    node.style.backgroundColor = _setColor();

    let nodeLabel = document.createElement('div');
    nodeLabel.className = 'label';
    nodeLabel.innerHTML = label;

    $(node).append(nodeLabel);
    $(parent).append(node);

    dom = node;
  })();
}


// EVENT LISTENERS
document.querySelector("._generateNewCluster").onclick = () => {
  new Cluster();
};
