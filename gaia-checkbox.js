(function(define){define(function(require,exports,module){
/*jshint esnext:true*/
'use strict';

// Load 'gaia-icons' font-family
require('gaia-icons');

/**
 * Prototype extends from
 * the HTMLElement.
 *
 * @type {Object}
 */
var proto = Object.create(HTMLElement.prototype);

/**
 * Attributes supported
 * by this component.
 *
 * @type {Object}
 */
proto.attrs = {
  checked: true,
  danger: true,
  name: true
};

proto.createdCallback = function() {
  this.createShadowRoot().appendChild(template.content.cloneNode(true));

  this.els = { inner: this.shadowRoot.querySelector('.inner') };
  this.els.inner.addEventListener('click', this.onClick.bind(this));

  // Setup initial attributes
  this.checked = this.getAttribute('checked');
  this.danger = this.getAttribute('danger');
  this.name = this.getAttribute('name');

  // Make tabable
  this.tabIndex = 0;
};

proto.attributeChangedCallback = function(name, from, to) {
  if (this.attrs[name]) { this[name] = to; }
};

proto.onClick = function(e) {
  e.stopPropagation();
  this.checked = !this.checked;
};

proto.toggle = function(value) {
  value = arguments.length ? value : !this.checked;
  if (value || value === '') { this.check(); }
  else { this.uncheck(); }
};

proto.check = function() {
  if (this.checked) { return; }
  this.els.inner.setAttribute('checked', '');
  this.setAttribute('checked', '');
  this._checked = true;
};

proto.uncheck = function() {
  if (!this.checked) { return; }
  this.els.inner.removeAttribute('checked');
  this.removeAttribute('checked');
  this._checked = false;
};

Object.defineProperties(proto, {
  checked: {
    get: function() { return !!this._checked; },
    set: proto.toggle
  },
  danger: {
    get: function() { return this._danger; },
    set: function(value) {
      if (value || value === '') { this.els.inner.setAttribute('danger', value); }
      else { this.els.inner.removeAttribute('danger'); }
      this._danger = value;
    }
  },
  name: {
    get: function() { return this._name; },
    set: function(value) {
      if (value === null) { this.els.inner.removeAttribute('name'); }
      else { this.els.inner.setAttribute('name', value); }
      this._name = value;
    }
  }
});

var template = document.createElement('template');
template.innerHTML = `
<style>

/** Host
 ---------------------------------------------------------*/

gaia-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: 0;
}

/** Inner
 ---------------------------------------------------------*/

.inner {
  display: block;
  box-sizing: border-box;
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #a6a6a6;
  z-index: 0;

  --gaia-checkbox-background:
    var(--checkbox-background,
    var(--input-background,
    var(--button-background,
    var(--background-plus))));

  background:
    var(--gaia-checkbox-background);

  border-color:
    var(--checkbox-border-color,
    var(--border-color,
    var(--background-minus)));
}

/**
 * Increase hit area
 */

.inner:before {
  content: '';
  position: absolute;
  top: -10px; right: -10px;
  bottom: -10px; left: -10px;
}

/** Background
 ---------------------------------------------------------*/

.background {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  top: 0px;
  left: 0px;
  position: absolute;
  z-index: -1;
  opacity: 1;
  transform: scale(0);
  background: var(--highlight-color, #000);
}

/**
 * .active
 */

.inner[checked] .background {
  transform: scale(1.6);
  transition-property: transform, opacity;
  transition-duration: 300ms;
  transition-timing-function: linear;
  opacity: 0;
}

/** Tick
 ---------------------------------------------------------*/

.tick {
  text-align: center;
  line-height: 26px;
  opacity: 0;

  transition-property: opacity;
  transition-duration: 100ms;

  color: var(--highlight-color, #000);
}

/**
 * [checked]
 */

[checked] .tick {
  opacity: 1;
  transition-delay: 180ms;
}

/** Icon
 ---------------------------------------------------------*/

.tick:before {
  font-family: 'gaia-icons';
  content: 'tick';
  font-style: normal;
  font-weight: 500;
  text-rendering: optimizeLegibility;
  font-size: 16px;
  line-height: 1;
}

</style>

<div class="inner">
  <div class="background"></div>
  <div class="tick"></div>
</div>`;

// Bind a 'click' delegate to the
// window to listen for all clicks
// and toggle checkboxes when required.
addEventListener('click', function(e) {
  var label = getLabel(e.target);
  var checkbox = getLinkedCheckbox(label);
  if (checkbox) { checkbox.toggle(); }
}, true);

/**
 * Find a checkbox when given a <label>.
 *
 * @param  {Element} label
 * @return {GaiaCheckbox|null}
 */
function getLinkedCheckbox(label) {
  if (!label) { return; }
  var id = label.getAttribute('for');
  var checkbox = id && document.getElementById(id);
  return checkbox;// || label.querySelector('gaia-checkbox');
}

/**
 * Walk up the DOM tree from a given
 * element until a <label> is found.
 *
 * @param  {Element} el
 * @return {HTMLLabelElement|undefined}
 */
function getLabel(el) {
  return el && (el.tagName == 'LABEL' ? el : getLabel(el.parentNode));
}

// Makes checkboxs togglable via keboard
addEventListener('keypress', function(e) {
  if (e.which !== 32) { return; }
  var el = document.activeElement;
  var isCheckbox = el.tagName === 'GAIA-CHECKBOX';
  if (isCheckbox) { el.toggle(); }
});

// Register and return the constructor
module.exports = document.registerElement('gaia-checkbox', { prototype: proto });

});})(typeof define=='function'&&define.amd?define
:(function(n,w){return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('gaia-checkbox',this));