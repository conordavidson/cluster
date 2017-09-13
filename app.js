// OBJECTS
function Cluster(){
  let dom;
  let domNodes;
  let domNodeOrigin;
  let nodes = [];
  let rotation = 0;
  let rotationTimer;

  this.addNode = function(){
    let index = nodes.length;
    let newNode = new Node(domNodeOrigin, index);
    nodes.push(newNode);
    this.balanceNodes();
  }

  this.subtractNode = function(){
    if (nodes[nodes.length - 1]){
      $(nodes[nodes.length - 1].getDom()).remove();
    }
    nodes.pop();
    this.balanceNodes();
  }

  this.balanceNodes = function(){
    nodes.map((node, index) => {
      node.rotate((360 / nodes.length) * (index));
    })
  }

  this.startClusterRotation = function(direction){
    rotationTimer = direction === 'cc' ?
      setInterval(() => this.rotateCluster('cc'), 7):
      setInterval(() => this.rotateCluster('cw'), 7);
  }

  this.rotateCluster = function(direction){
    direction === 'cc' ? rotation -= 1 : rotation += 1;
    domNodes.style.transform = 'rotate(' + rotation + 'deg)';
  }

  this.clearClusterRotation = function(){
    clearInterval(rotationTimer);
  }

  this.scale = function(){
    let width = dom.offsetWidth;
    dom.style.height = width + 'px';
    domNodeOrigin.style.transformOrigin = '25px ' + ((width / 2) + 25).toString() + 'px';
  }

  let initialize = (() => {

    let cluster = document.createElement('section');
    cluster.className = 'cluster';

    let nodeControls = document.createElement('div');
    nodeControls.className = 'node-controls';

    let add = document.createElement('div');
    add.className = 'add-node node-control';
    add.onclick = () => this.addNode();

    let subtract = document.createElement('div');
    subtract.className = 'subtract-node node-control';
    subtract.onclick = () => this.subtractNode();

    let rotateCC = document.createElement('div');
    rotateCC.className = 'rotate-node-cc node-control';
    $(rotateCC).on('mousedown touchstart',
      () => this.startClusterRotation('cc'));
    $(rotateCC).on('mouseup mouseout touchend',
      () => this.clearClusterRotation());

    let rotateCW = document.createElement('div');
    rotateCW.className = 'rotate-node-cw node-control';
    $(rotateCW).on('mousedown touchstart',
      () => this.startClusterRotation('cw'));
    $(rotateCW).on('mouseup mouseout touchend',
      () => this.clearClusterRotation());

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

    this.scale();
    window.addEventListener("resize", this.scale);

  })();
}


function Node(parent, index){
  let dom;
  let rotation = 0;

  this.rotate = function(degrees){
    rotation = degrees;
    dom.style.transform = 'rotate(' + rotation + 'deg)';
  }

  this.setColor = () => {
    let chars = '0123456789ABCDEF';
    let hex = '#';
    for (let i = 0; i < 6; i++) {
      hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
  }

  this.getDom = () => {
    return dom;
  }

  let initialize = (() => {
    let node = document.createElement('div');
    node.id = index;
    node.className = 'node';
    node.style.backgroundColor = this.setColor();

    let label = document.createElement('div');
    label.className = 'label';
    label.innerHTML = index + 1;

    $(node).append(label);
    $(parent).append(node);

    dom = node;
  })();
}

// EVENT HANDLERS
document.querySelector("._generateNewCluster").onclick = () => {
  new Cluster();
};
