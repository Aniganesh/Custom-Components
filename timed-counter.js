"use strict";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class timedCounter extends HTMLElement {

    static get boundAttributes() {
        return ['min', 'max', 'interval', 'onend', 'loop'];
    }

    static get observedAttributes() {
        return ['min', 'max', 'interval', 'onend', 'loop'];
    }


    get loop() {
        if (this.hasAttribute('loop'))
            return true;
        else
            return false;
    }
    get onend() {
        if (this.hasAttribute('onend')) {
            return this.getAttribute('onend');
        }
    }

    get min() {
        if (this.hasAttribute('min')) {
            if (isNaN(parseFloat(this.getAttribute('min')))) {
                return 0;
            }
            return parseFloat(this.getAttribute('min'));
        }
        return 0;
    }

    get max() {
        if (this.hasAttribute('max')) {
            if (isNaN(parseFloat(this.getAttribute('max')))) {
                return 100;
            }
            return parseFloat(this.getAttribute('max'));
        }
        return 100;
    }

    get step() {
        if (this.hasAttribute('step')) {
            if (isNaN(parseFloat(this.getAttribute('step')))) {
                return 1;
            }
            return parseFloat(this.getAttribute('max'));
        }
        return 1;
    }

    get interval() {
        if (this.hasAttribute('interval')) {
            if (isNaN(parseFloat(this.getAttribute('interval'))) || parseFloat(this.getAttribute('interval')) == 0) {
                return 1000;
            }
            return (parseFloat(this.getAttribute('interval')) * 1000);
        }
        return 1000;
    }

    connectedCallback() {
        const THISELEMENT = this;
        const MIN = THISELEMENT.min;
        var i = MIN;
        const INTERVAL = (THISELEMENT.interval);
        const STEP = parseFloat(THISELEMENT.step);
        const MAX = THISELEMENT.max;
        THISELEMENT.innerHTML = THISELEMENT.min;
        var COUNTER = setInterval(
            () => {

                if (i < MAX) {
                    i = i + STEP;
                    THISELEMENT.innerHTML = i;
                } else {
                    if (!this.loop)
                        clearInterval(COUNTER);
                    else {
                        THISELEMENT.innerHTML = MIN;
                        i = MIN;
                    }
                }
            }, INTERVAL
        );
        const ONEND = THISELEMENT.getAttribute('onend');
        if (ONEND) {
            if (ONEND.length - ONEND.indexOf('()') == 2) {
                // /^\ Checking if the given string is supposed to be the name of a function.

                const ENDTIME = ((MAX - MIN) * INTERVAL) / STEP;

                if (MIN != 0) {
                    const ONENDTIMEOUT = setTimeout(ONEND, ENDTIME);
                    const removeTimeout = setTimeout(
                        () => {
                            clearTimeout(ONENDTIMEOUT);
                            clearTimeout(removeTimeout);
                        }, ENDTIME + 1000
                    );
                } else {
                    const ONENDTIMEOUT = setTimeout(ONEND, ENDTIME + INTERVAL);
                    const removeTimeout = setTimeout(
                        () => {
                            clearTimeout(ONENDTIMEOUT);
                            clearTimeout(removeTimeout);
                        }, ENDTIME + INTERVAL + 1000
                    );
                }
                // If yes, call the function at the end of the timer.
                //Remove timeout after it has expired and 1 second has passed
            } else {

            }
        }
    }

    constructor() {
        super();

    }
}

customElements.define("timed-counter", timedCounter);
