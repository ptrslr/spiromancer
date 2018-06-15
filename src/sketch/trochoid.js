// @flow
import { lcm } from 'mathjs';
import shortid from 'shortid';

const step = 0.05;

class Trochoid {
  id: number;
  index: number;
  R: number;
  r: number;
  d: number;
  width: number;
  height: number;
  p5: Object;
  removeTrochoid: Function;
  guidesActive: boolean;

  centerX: number;
  centerY: number;
  drawing: Object;
  guides: Object;
  color: string;
  strokeWeight: number;
  angle: number;
  maxAngle: number;

  constructor(
    index: number,
    width: number,
    height: number,
    p5: Object,
    removeTrochoid: Function,
    R: number = 210,
    r: number = 75,
    d: number = 45,
  ) {
    this.id = shortid.generate();
    this.index = index;
    this.width = width;
    this.height = height;
    this.p5 = p5;
    this.removeTrochoid = removeTrochoid;
    this.R = R;
    this.r = r;
    this.d = d;

    this.guidesActive = true;

    this.centerX = width / 2;
    this.centerY = height / 2;

    this.color = '#00FFFF';
    this.strokeWeight = 1;
    this.drawing = p5.createGraphics(
      width * p5.displayDensity(),
      height * p5.displayDensity(),
    );
    this.drawing.stroke(this.color);
    this.drawing.strokeWeight(this.strokeWeight);

    this.guides = p5.createGraphics(
      width * p5.displayDensity(),
      height * p5.displayDensity(),
    );
    this.guides.noFill();
    this.guides.stroke('black');
    this.guides.strokeWeight(1);

    this.init();
  }

  clear = () => {
    this.drawing.clear();
    this.guides.clear();
  };

  init = () => {
    this.angle = 0;
    const rotations = this.getRotations();
    this.maxAngle = Math.PI * 2 * rotations;

    this.drawing.stroke(this.color);
    this.drawing.strokeWeight(this.strokeWeight);
  };

  // eslint-disable-next-line no-unused-vars
  getX = (angle?: number): ?number => {
    throw new Error('You have to implement the method getX!');
  };

  // eslint-disable-next-line no-unused-vars
  getY = (angle?: number): ?number => {
    throw new Error('You have to implement the method getY!');
  };

  getDrawingCircleX = (): ?number => {
    throw new Error('You have to implement the method getX!');
  };

  getDrawingCircleY = (): ?number => {
    throw new Error('You have to implement the method getY!');
  };

  getRotations = () => lcm(this.R, this.r) / this.R;

  draw = () => {
    // let angle = 0;
    let x, y;
    const { width, height, maxAngle } = this;

    this.drawing.clear();
    this.drawing.stroke(this.color);
    this.drawing.strokeWeight(this.strokeWeight);
    this.drawing.beginShape();
    for (let angle = 0; angle < maxAngle; angle += step) {
      // console.log(`${angle} -> ${angleRad}`);
      x = this.getX(angle);
      y = this.getY(angle);

      this.drawing.curveVertex(width / 2 + x, height / 2 + y);

      // angle += theta;
    }
    this.drawing.endShape();
  };

  drawStep = () => {
    const { centerX, centerY, maxAngle, R, r } = this;

    if (this.angle === 0) {
      this.drawing.clear();
    }

    if (this.angle <= maxAngle) {
      const oldX = centerX + this.getX(this.angle);
      const oldY = centerY + this.getY(this.angle);

      this.angle += step;

      const newX = centerX + this.getX(this.angle);
      const newY = centerY + this.getY(this.angle);

      this.drawing.line(oldX, oldY, newX, newY);

      this.guides.clear();

      const fixedCircleWidth = R * 2;
      const drawingCircleWidth = r * 2;

      const drawingCircleX = centerX + this.getDrawingCircleX();
      const drawingCircleY = centerY + this.getDrawingCircleY();

      this.guides.strokeWeight(1);
      this.guides.stroke('black');
      this.guides.ellipse(centerX, centerY, fixedCircleWidth);
      this.guides.ellipse(drawingCircleX, drawingCircleY, drawingCircleWidth);
      this.guides.line(drawingCircleX, drawingCircleY, newX, newY);

      this.guides.strokeWeight(10);
      this.guides.stroke(this.color);
      this.guides.point(newX, newY);
    }
  };

  remove = () => {
    this.removeTrochoid(this.id);
  };
}

export default Trochoid;
