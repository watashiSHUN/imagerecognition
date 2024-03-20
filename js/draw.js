const draw = {}

// TODO, not defingin a class, but append member functions to draw object
// segment: [[x1,y1], [x2,y2], [x3,y3], ...]
// path: [ segment1, segment2, ...]
draw.path = ( ctx, path, color = "black", width = 1 ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width
    path.forEach(segment => {
        if (segment.length < 2){
            // draw a dot
            ctx.arc(segment[0][0], segment[0][1], 1, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }
        for (let i = 0; i < segment.length-1; i++){
            const current = segment[i];
            const next = segment[i+1];
            ctx.moveTo(...current);
            ctx.lineTo(...next);
        }
        // NOTE: stroke at the end, the segment is connected
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    });
}
