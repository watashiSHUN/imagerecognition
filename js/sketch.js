class SketchPad{
    constructor(div, size=400){
        this.canvas = document.createElement('canvas');
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style = `
            background-color: white;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);`;
        div.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.#addEventListeners();
        
        this.pixels = [];
        this.mouseDown = false;
    }
   
    #addEventListeners(){
        // Only intercept mouse movement inside the canvas
        // NOTE: instead of document.onmousemove, we use this.canvas.onmousemove
        // NOTE: `onmousedown` only record once the mouse is pressed, moving while pressed is not recorded
        this.canvas.onmousedown = (e) => {
            // e being the mouse event
            const rect = this.canvas.getBoundingClientRect();
            // Get relative mouse position inside the canvas
            // NOTE: first point of a segment
            const mouse = [
                Math.round(e.clientX - rect.left), 
                Math.round(e.clientY - rect.top)
            ];
            this.mouseDown = true;
            this.pixels.push([mouse]);
        };

        // NOTE: every time we lift the mouse, we insert a break point => 2 segments are disjoint
        this.canvas.onmouseup= (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // NOTE: last segment of a segment
            const mouse = [
                Math.round(e.clientX - rect.left), 
                Math.round(e.clientY - rect.top)
            ];
            this.mouseDown = false;
            this.pixels[this.pixels.length-1].push(mouse);
        }
        // TODO: how often does this event fire?
        this.canvas.onmousemove = (e) => { 
            if(this.mouseDown){
                const rect = this.canvas.getBoundingClientRect();
                const mouse = [
                    Math.round(e.clientX - rect.left), 
                    Math.round(e.clientY - rect.top)
                ];
                this.pixels[this.pixels.length-1].push(mouse);
                // TODO: call draw?
            }
        };
    }

    #getMouse=(e)=>{
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.round(e.clientX - rect.left), 
            Math.round(e.clientY - rect.top)
        ];
    }

    // Driver code can repeatedly call this method
    draw(){
        // connect dots
        this.pixels.forEach(segment => {
            this.ctx.beginPath();
            // draw dot
            if (segment.length == 1){
                this.ctx.arc(segment[0][0], segment[0][1], 1, 0, 2 * Math.PI);
                this.ctx.fill();
                return;
            }

            for (let i = 0; i < segment.length-1; i++){
                this.ctx.moveTo(segment[i][0], segment[i][1]);
                this.ctx.lineTo(segment[i+1][0], segment[i+1][1]);
            }
            this.ctx.stroke();
        });
    }
}