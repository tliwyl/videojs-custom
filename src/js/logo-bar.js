/**
 * @file logo-bar.js
 */
import Component from './component.js';
import { assign } from './utils/obj';

/**
 * The initial play button that shows before the video has played. The hiding of the
 * `BigPlayButton` get done via CSS and `Player` states.
 *
 * @extends Component
 */
class LogoBar extends Component {

  constructor(player, options) {
    super(player, options);
    player.setLogo = (logoOptions) => {
      this.setLogo.call(this, logoOptions);
    };
  }
  /**
   * Create the `LogoBar`s DOM element.
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
      className: this.buildCSSClass()
    }, props);
    const el = Component.prototype.createEl.call(this, tag, props, attributes);

    this.setLogo(playerOptions.logo, el);
    return el;
  }

  /**
   * Builds the default DOM `className`.
   *
   * @return {string}
   *         The DOM `className` for this object. Always returns 'vjs-big-play-button'.
   */
  buildCSSClass(location) {
    return 'vjs-logo-wrapper ';
  }

  setLogo(options = {}, dom) {
    const el = dom || this.contentEl();
    const path = options.path;
    const cssText = options.cssText;
    const location = options.location;

    if (path) {
      el.style.backgroundImage = `url(${path})`;
    }
    if (cssText) {
      el.style.cssText += cssText;
    }
    const s = location === 0 ? 'left-top' :
      location === 2 ? 'left-bottom' :
        location === 3 ? 'right-bottom' : 'right-top';

    el.className = 'vjs-logo-wrapper ' + s;
  }

}
Component.registerComponent('LogoBar', LogoBar);
export default LogoBar;
