// OBJECTS
function Cluster(id){
  let dom;
  let domNodes;
  let nodes = [];
  let rotation = 0;

  this.addNode = function(){
    let index = nodes.length;
    let newNode = new Node(domNodes, index);
    nodes.push(newNode);
    this.balanceNodes();
  }

  this.balanceNodes = function(){
    nodes.map((node, index) => {
      node.rotate((360 / nodes.length) * (index));
    })
  }

  this.rotate = function(degrees){
    rotation = degrees;
    dom.style.transform = 'rotate(' + rotation + 'deg)';
  }

  this.scale = function(){
    let height = dom.offsetHeight;
    dom.style.width = height + 'px';
    domNodes.style.transformOrigin = '25px ' + ((height / 2) + 25).toString() + 'px';
  }

  let initialize = (() => {
    let cluster = document.createElement('div');
    cluster.id = id;

    let centralNode = document.createElement('div');
    centralNode.className = 'central-node';

    let nodes = document.createElement('div');
    nodes.className = 'nodes';

    $(cluster).append(centralNode);
    $(cluster).append(nodes);
    $('main').append(cluster);

    dom = cluster;
    domNodes = nodes;

    this.scale();
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
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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



// CONSTRUCTORS

let cluster = new Cluster('cluster');



// EVENT HANDLERS
$("._generateNode").on("click", () => {
  cluster.addNode();
})

$("._rotateCluster").on("input", () => {
  cluster.rotate(event.currentTarget.value)
})

$(window).on("resize", () => {
  cluster.scale();
})
