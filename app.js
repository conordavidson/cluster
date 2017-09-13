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
    nodes.map((node, index) => {
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
    let cluster = document.createElement('section');
    cluster.className = 'cluster';

    let nodeControls = document.createElement('div');
    nodeControls.className = 'node-controls';

    let add = document.createElement('div');
    add.className = 'add-node node-control';
    add.onclick = () => _addNode();

    let subtract = document.createElement('div');
    subtract.className = 'subtract-node node-control';
    subtract.onclick = () => _subtractNode();

    let rotateCC = document.createElement('div');
    rotateCC.className = 'rotate-node-cc node-control';
    $(rotateCC).on('mousedown touchstart',
      () => _startRotation('cc'));
    $(rotateCC).on('mouseup mouseout touchend',
      () => _clearRotation());

    let rotateCW = document.createElement('div');
    rotateCW.className = 'rotate-node-cw node-control';
    $(rotateCW).on('mousedown touchstart',
      () => _startRotation('cw'));
    $(rotateCW).on('mouseup mouseout touchend',
      () => _clearRotation());

    let nodes = document.createElement('div');
    nodes.className = 'nodes';

    let nodeOrigin = document.createElement('div');
    nodeOrigin.className = 'node-origin';

    $(nodeControls).append(add);
    $(nodeControls).append(subtract);
    $(nodeControls).append(rotateCC);
    $(nodeControls).append(rotateCW);
    $(nodes).append(nodeOrigin);
    $(cluster).append(nodeControls);
    $(cluster).append(nodes);
    $(cluster).hide();
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
