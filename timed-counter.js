"use strict";

class timedCounter extends HTMLElement {

    static get boundAttributes() {
        return ['min', 'max', 'interval', 'onend', 'loop', 'sync', 'hassync'];
    }

    static get observedAttributes() {
        return ['min', 'max', 'interval', 'onend', 'loop', 'sync', 'hassync'];
    }

    get sync() {
        return this.getAttribute('sync');
    }

    get hassync() {
        if (this.hasAttribute('hassync')) {
            return true;
        } else
            return false;
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
        if (!this.hassync) {
            const COUNTER = setInterval(
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
        } else {
            const SELMT = document.querySelector("#" + this.sync);
            const ENDTIME = ((MAX - MIN) * INTERVAL) / STEP;
            if (SELMT) {
                setInterval(function () {
                    SELMT.innerHTML = parseFloat(SELMT.innerHTML) + parseFloat(SELMT.step);
                }, ENDTIME - 100);
                //100 milliseconds to compensate for latency. 100 is arbitrarily chosen.
            } else {
                throw new Error("Invalid id provided in sync attribute")
            }
        }
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
