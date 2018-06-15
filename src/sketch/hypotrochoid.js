// @flow
import Trochoid from './trochoid';

class Hypotrochoid extends Trochoid {
  getX = (angle?: number = this.angle): number => {
    const { R, r, d } = this;

    const result =
      (R - r) * Math.cos(angle) + d * Math.cos((R - r) / r * angle);

    return result;
  };

  getY = (angle?: number = this.angle): number => {
    const { R, r, d } = this;

    const result =
      (R - r) * Math.sin(angle) - d * Math.sin((R - r) / r * angle);

    return result;
  };

  getDrawingCircleX = (): number => {
    const { R, r } = this;
    const result = (R - r) * Math.cos(this.angle);

    return result;
  };

  getDrawingCircleY = (): number => {
    const { R, r } = this;
    const result = (R - r) * Math.sin(this.angle);

    return result;
  };

  toString = () => `${this.index + 1}: Hypotrochoid`;
}

export default Hypotrochoid;
