class Player {
  constructor(width, height, brain) {
    this.position = createVector(400, 775);
    this.width = width;
    this.height = height;
    this.score = 0;
    this.fitness = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(5, 5, 3);
    }
  }

  crashed(array) {
    for (let element of array) {
      if (abs(this.position.x - element.position.x) <= this.width / 2 + element.width / 2 && abs(this.position.y - element.position.y) <= this.height / 2 + element.height / 2) {
        return true;
      }
    }
    return false;
  }

  copy() {
    return new Player(this.width, this.height, this.brain);
  }

  right() {
    this.position.x = constrain(this.position.x + targetSpeed, this.width / 2, width - this.width / 2);
  }

  left() {
    this.position.x = constrain(this.position.x - targetSpeed, this.width / 2, width - this.width / 2);
  }

  act(block) {
    this.score++;
    let inputs = new Array();
    inputs[0] = block.position.x;
    inputs[1] = block.position.y;
    inputs[2] = block.width;
    inputs[3] = block.height;
    inputs[4] = this.position.x;
    let outputs = this.brain.predict(inputs);
    outputs = sortOutputs(outputs);
    
    switch(outputs[0]) {
      case 0:
        this.left();
        break;
      case 1:
        this.right();
        break;
      default:
        break;
    }
  }

  show() {
    fill(255);
    rect(this.position.x, this.position.y, this.width, this.height);
  }
}

function sortOutputs(outputs){
  let result = new Array();
  for(let i = 0; i < outputs.length; i++){
    result.push({
      index: i,
      value: outputs[i]
    });
  }
  result.sort(function(a, b) {
    return ((a.value < b.value) ? 1 : ((a.value == b.value) ? 0 : -1));
  });
  return result.map(a => a.index);
}

function mutate(x) {
  if (random(1) < mutationRate) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
