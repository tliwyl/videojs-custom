/**
 * @file horse-race-lamp.js
 */
import * as Dom from './utils/dom.js';
import Component from './component.js';
import { assign } from './utils/obj';
const RACE_TEXT_CLASS = 'vjs-race-lamp-text';

/**
 * The initial play button that shows before the video has played. The hiding of the
 * `BigPlayButton` get done via CSS and `Player` states.
 *
 * @extends Component
 */
class HorseRaceLamp extends Component {
  constructor(player, options) {
    super(player, options);
    player.on('play', () => {
      this.runLampRace(player);
    });
    player.on('pause', () => {
      this.stopLampRace(player);
    });
    player.on('end', () => {
      this.stopLampRace(player);
    });
    player.setRaceLamp = (raceOptions) => {
      this.setRaceLamp.call(this, raceOptions);
    };
  }

  /**
   * Create the `horseRaceLamp`s DOM element.
   *
   * @param {string} [tag="div"]
   *        The element's node type. This argument is IGNORED: no matter what
   *        is passed, it will always create a `button` element.
   *
   * @param {Object} [props={}]
   *        An object of properties that should be set on the element.
   *
   * @param {Object} [attributes={}]
   *        An object of attributes that should be set on the element.
   *
   * @return {Element}
   *         The element that gets created.
   */
  createEl(tag, props = {}, attributes = {}) {
    tag = 'div';
    const playerOptions = this.options_.playerOptions;

    props = assign({
      innerHTML: '<span class="' + RACE_TEXT_CLASS + '"></span>',
      className: this.buildCSSClass()
    }, props);

    const el = Component.prototype.createEl.call(this, tag, props, attributes);

    if (playerOptions.raceLamp) {
      this.setRaceLamp(playerOptions.raceLamp, el);
    }
    return el;
  }

  buildStyle(size, color) {
    const oStyle = {};

    if (color) {
      color = color.replace(/^0x/i, '#');
    }

    if (size) {
      oStyle.fontSize = size + 'px';
    }
    if (color) {
      oStyle.color = color;
    }
    return this.convertStyleToString(oStyle);
  }

  convertStyleToString(style) {
    const keys = Object.keys(style);
    const styleArray = keys.map((v, i, input) => {
      return this.camelCaseConvert(v) + ':' + style[v];
    });

    return styleArray.join(';');
  }

  camelCaseConvert(v) {
    return v.replace(/([A-Z])/g, ($, $1, index) => {
      return index === 0 ? $1.toLowerCase() : '-' + $1.toLowerCase();
    });
  }
  setRaceLamp(options, dom) {
    const fontSize = options.fontSize;
    const color = options.color;
    const text = options.text;
    const el = this.getTextNode(dom);

    el.style.cssText = this.buildStyle(fontSize, color);
    el.style.display = 'none';
    el.innerHTML = text;
  }
  getTextNode(el) {
    return this.$('.' + RACE_TEXT_CLASS, (el || this.contentEl()));
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object. Always returns 'vjs-big-play-button'.
   */
  buildCSSClass() {
    return 'vjs-horse-race-lamp';
  }
  runLampRace(player, step = 2.5) {
    const raceTextNode = this.getTextNode();

    raceTextNode.style.display = 'block';
    const rect = Dom.getBoundingClientRect(raceTextNode);
    const h = this.currentHeight();

    if (parseFloat(raceTextNode.style.left) < 0) {
      raceTextNode.style.top = this.randomTop(h - rect.height) + 'px';
    }

    const fn = () => {
      const left = parseFloat(raceTextNode.style.left);
      const width = this.currentWidth();
      const height = this.currentHeight();

      if (left + step < width + rect.width) {
        raceTextNode.style.left = left + step + 'px';
      } else {
        raceTextNode.style.top = this.randomTop(height - rect.height) + 'px';
        raceTextNode.style.left = -rect.width + 'px';
      }
    };

    fn();
    this.stopLampRace();
    this.raceTimer = setInterval(fn, 50);

  }
  stopLampRace() {
    return this.raceTimer && clearInterval(this.raceTimer);
  }
  randomTop(height) {
    return Math.floor((height) * Math.random());
  }
}
Component.registerComponent('HorseRaceLamp', HorseRaceLamp);
export default HorseRaceLamp;
