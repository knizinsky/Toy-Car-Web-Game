const lineColor = 'SlateBlue';
const dotColors = 'red';

export function drawPolygon(ctx, position, collisionVertices){
    // let worldPolygon = getWorldPolygon(position, collisionVertices);
    // let i, j, curr, next;
    // const len = collisionVertices.length;
    // for (i = 0, j = len - 1; i < len; j = i++){
    //     curr = worldPolygon[j];
    //     next = worldPolygon[i]

    //     ctx.beginPath();
    //     ctx.strokeStyle = lineColor;
    //     ctx.moveTo(...curr);
    //     ctx.lineTo(...next);
    //     ctx.stroke();

    //     ctx.beginPath();
    //     ctx.strokeStyle = dotColors;
    //     ctx.fillStyle = dotColors;
    //     ctx.arc(curr[0], curr[1], 3, 0, 2 * Math.PI);
    //     ctx.fill();
    //     ctx.stroke();
    // }
}

function getWorldPolygon(pos, vertices){
    return vertices.map((x) => [x[0] + pos[0], x[1] + pos[1]]);
}