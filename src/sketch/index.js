// @flow
import * as dat from 'dat.gui';
import { findIndex } from 'lodash';

import Trochoid from './trochoid';
import Hypotrochoid from './hypotrochoid';
import Epitrochoid from './epitrochoid';
import Counter from '../utils/counter';

function sketch(p5: Object) {
  let gui = null;
  let counter;

  const backgroundColor = '#ffffff';
  const strokeColor = '#19191a';
  let width = 320;
  let height = 320;

  const controls = {
    speed: 1,
    trochoids: {},
    folders: {},
    addHypotrochoid() {
      addHypotrochoid();
    },
    addEpitrochoid() {
      addEpitrochoid();
    },
    save() {
      p5.saveCanvas('spirograph', 'png');
    },
  };

  const initControls = () => {
    // console.log(window.localStorage.getItem(`${window.location.href}.gui`));
    const localStorage = JSON.parse(
      window.localStorage.getItem(`${window.location.href}.gui`),
    );

    const folders = localStorage ? localStorage.folders : null;
    // console.log(folders);

    if (gui) {
      gui.destroy();
    }
    gui = new dat.GUI();
    gui.localStorage = true;
    gui.remember(controls);
    // gui.remember(controls.trochoids);
    gui.width = 360;
    gui.add(controls, 'save').name('Export');
    gui.add(controls, 'speed', 1, 200).step(1);
    gui.add(controls, 'addHypotrochoid').name('Add hypotrochoid');
    gui.add(controls, 'addEpitrochoid').name('Add epitrochoid');

    const keys = Object.keys(controls.trochoids);
    if (keys.length) {
      counter = new Counter(Math.max(...keys));
    } else {
      counter = new Counter();
    }

    // console.log(gui);

    if (folders) {
      Object.keys(folders).forEach(name => {
        const type = name.split(' ')[1];

        if (type === 'Epitrochoid') {
          addEpitrochoid();
        } else {
          addHypotrochoid();
        }
      });
    }
    // addHypotrochoid();
    // addEpitrochoid();
  };

  const removeTrochoid = (id: number) => {
    if (gui) {
      gui.removeFolder(controls.folders[id]);
      delete controls.folders[id];
      delete controls.trochoids[id];

      const removedIndex = findIndex(
        gui.__rememberedObjects,
        item => item.id === id,
      );

      // not ideal, but it's something
      if (removedIndex) {
        gui.__rememberedObjects.splice(removedIndex, 1);
        gui.__rememberedObjectIndecesToControllers.splice(removedIndex, 1);
      }
    }
  };

  const addTrochoid = (trochoid: Trochoid) => {
    const { id } = trochoid;
    controls.trochoids[id] = trochoid;

    if (gui) {
      gui.remember(controls.trochoids[id]);

      const folder = gui.addFolder(trochoid);
      controls.folders[id] = folder;

      const controllers = [];

      controllers.push(
        folder
          .add(controls.trochoids[id], 'R', 1, 320)
          .step(1)
          .name('Fixed circle radius'),
      );
      controllers.push(
        folder
          .add(controls.trochoids[id], 'r', 1, 320)
          .step(1)
          .name('Drawing circle radius'),
      );
      controllers.push(
        folder
          .add(controls.trochoids[id], 'd', 1, 320)
          .step(1)
          .name('Drawing point distance'),
      );
      controllers.push(
        folder.addColor(controls.trochoids[id], 'color').name('Color'),
      );
      controllers.push(
        folder
          .add(controls.trochoids[id], 'strokeWeight', 1, 5)
          .step(1)
          .name('Stroke weight'),
      );

      controllers.forEach(controller => {
        controller.onFinishChange(() => {
          trochoid.clear();
          trochoid.init();
        });
      });

      folder
        .add(trochoid, 'guidesActive')
        .name('Guides')
        .onFinishChange(() => {
          p5.background('white');
        });
      folder.add(trochoid, 'remove').name('Remove');

      controls.trochoids[id].init();
    }

    console.log(gui);
  };

  const addHypotrochoid = () => {
    addTrochoid(
      new Hypotrochoid(counter.generate(), width, height, p5, removeTrochoid),
    );
  };

  const addEpitrochoid = () => {
    addTrochoid(
      new Epitrochoid(counter.generate(), width, height, p5, removeTrochoid),
    );
  };

  p5.setup = () => {
    p5.frameRate(320);
    width = p5.windowWidth;
    height = p5.windowHeight;

    p5.createCanvas(width, height);

    p5.background(backgroundColor);
    p5.noFill(0);
    p5.stroke(strokeColor);

    initControls();
  };

  p5.draw = () => {
    p5.background('white');

    Object.keys(controls.trochoids).forEach(key => {
      const trochoid = controls.trochoids[key];

      if (trochoid.angle <= trochoid.maxAngle) {
        for (let i = 0; i < controls.speed; i++) {
          trochoid.drawStep();
        }
      }

      if (trochoid.guidesActive) {
        p5.image(trochoid.guides, 0, 0, width, height);
      }
      p5.image(trochoid.drawing, 0, 0, width, height);
    });
  };
}

export default sketch;
