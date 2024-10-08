import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class counterApp extends DDDSuper(LitElement) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.count = 0;
    this.min = 0;
    this.max = 21;
  }

  static get properties() {
    return {
      title: { type: String },
      number: { type: Number },
      count: { type: Number },
      min: { type: Number },
      max: { type: Number },
      color: { type: String },
    };
  }

  decrement() {
    if(this.count > this.min){
      this.count--;
    }
  }

  increment() {
    if(this.count < this.max){
      this.count++;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('count') && this.count === this.max) {
      // do your testing of the value and make it rain by calling makeItRain
      if (this.count === this.max) {
        this.makeItRain();
      }
    }
  }
  
  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  render() {
    return html`
    <div class="counter">
    <confetti-container id="confetti">
      <h1 class=h1title>Counter App</h1>
      <div class="number">${this.count}</div>
      <div class=button-container>
        <button @click="${this.decrement}" ?disabled="${this.count === this.min}" class="decrement">-</button>
        <button @click="${this.increment}" ?disabled="${this.count === this.max}" class="increment">+</button>
      </div>
      </confetti-container>
    </div>
    <div class="wrapper">
      <div>${this.title}</div>
      <slot></slot>
    </div>`;
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        font-size: var(--counter-app-font-size, var(--ddd-font-size-s));
      }
      :host([count="21"]).counter{
        color: var(--ddd-primary-1);
      }
      :host([count="18"].counter){
        color: var(--ddd-primary-0);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      div {
        padding: 0;
        margin: 0;
      }
      .h1title {
        text-align: center;
      }
      .counter {
        background-color: gray;
        color: black;
        border: 2px solid black;
        border-radius: 12px;
        width: 400px;
      }
      .number {
        text-align: center;
        font-size: 36px;
        font-family: "Impact";
        color: black;
      }
      .button-container{
        margin-left: 100px;
      }
      .decrement{
        text-align: center;
        color: black;
        font-size: 40px;
        margin: 20px;
        border-radius: 4px;
        border: 2px solid black;
        background-color: white;
        height: 50px;
        width: 50px;
      }
      .increment{
        text-align: center;
        color: black;
        font-size: 40px;
        margin: 20px;
        border-radius: 4px;
        border: 2px solid black;
        background-color: white;
        height: 50px;
        width: 50px;
      }
    `];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(counterApp.tag, counterApp);