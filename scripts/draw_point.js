function draw_point(ctx, x, y, radius = 5, style = "red")
{
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}