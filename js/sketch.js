class SketchPad{
    constructor(div, size=400){
        //---Sketch Pad Outline---
        this.canvas = this.#createCanvas(size);
        div.appendChild(this.canvas);
        const lineBreak = document.createElement('br');
        div.appendChild(lineBreak);
        this.undoButton = this.#createUndoButton();
        div.appendChild(this.undoButton);
        // initially disabled
        this.undoButton.disabled = true;
        //---Sketch Pad Outline---

        this.ctx = this.canvas.getContext('2d');
        this.#addEventListeners();
        
        // Array of segments, each segment is an array of points
        // [
        //  [[x1,y1], [x2,y2], [x3,y3], ...
        //  [[x1,y1], [x2,y2], [x3,y3], ...
        // ...
        // ]
        this.pixels = [];
        this.mouseDown = false;
    }

    #createCanvas(size){
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.style = `
            background-color: white;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);`;
        return canvas;
    }

    // when its clicked, remove the last segment
    #createUndoButton(){
        const undo = document.createElement('button');
        undo.innerHTML = "UNDO";
        undo.onclick = () => {
            // NOTE: when there's no pixels, the "undo" button should be grayed out
            this.pixels.pop();
            this.#reDraw();
        };
        return undo;
    }
   
    #addEventListeners(){
        // Only intercept mouse movement inside the canvas
        // NOTE: instead of document.onmousemove, we use this.canvas.onmousemove
        // NOTE: `onmousedown` only record once the mouse is pressed, moving while pressed is not recorded
        this.canvas.onmousedown = (e) => {
            const mouse = this.#getMouse(e);
            this.mouseDown = true;
            // NOTE: first point of a segment
            this.pixels.push([mouse]);
        };

        // TODO: how often does this event fire?
        this.canvas.onmousemove = (e) => { 
            if(this.mouseDown){
                const mouse = this.#getMouse(e);
                this.pixels[this.pixels.length-1].push(mouse);
                //this.#drawLine();
                this.#reDraw();
            }
        };

        // NOTE: every time we lift the mouse, we insert a break point => 2 segments are disjoint
        this.canvas.onmouseup= () => {
            this.mouseDown = false;
        }

        // Touch events for mobile devices
        this.canvas.ontouchstart = (e) => {
            // get the fist event in case of multi-touch
            const touch_event = e.touches[0];
            // touch_event and mouse_event share the some fields
            // NOTE: manually trigger mousedown event
            this.canvas.onmousedown(touch_event);
        };

        this.canvas.ontouchmove = (e) => { 
            const touch_event = e.touches[0];
            this.canvas.onmousemove(touch_event);
        };

        this.canvas.ontouchend = () => {
            this.canvas.onmouseup();
        };
    }

    // e being the mouse event
    // Get relative mouse position inside the canvas
    #getMouse=(e)=>{
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.round(e.clientX - rect.left), 
            Math.round(e.clientY - rect.top)
        ];
    }

    // Connect last 2 dots in the pixels
    #drawLine(){
        if (this.pixels.length < 1){
            // nothing to draw
            return;
        }
        const last_segment = this.pixels[this.pixels.length-1];
        if (last_segment.length < 2){
            // draw a dot
            this.ctx.arc(segment[0][0], segment[0][1], 1, 0, 2 * Math.PI);
            this.ctx.fill();
            return;
        }
        const start = last_segment[last_segment.length-2];
        const end = last_segment[last_segment.length-1];

        this.ctx.beginPath();
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(end[0], end[1]);
        this.ctx.stroke();
    }

    #reDraw(){
        // Clear the canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // utility object
        draw.path(this.ctx, this.pixels);
        if (this.pixels.length === 0){
            this.undoButton.disabled = true;
        } else {
            this.undoButton.disabled = false;
        }
    }
}