const title_bar = document.getElementById("title-bar");
const viewport_controller = document.getElementById("Viewport-controller");
const scroll_canvas = document.getElementById("scroll-canvas");
const ctx = scroll_canvas.getContext('2d');

let initialX = 0;
let initialY = 0;
let isMoving = false;

const scrollerWidth = parseInt(scroll_canvas.style.width.replace('px','')) - 110;
const scrollerHeight = parseInt(scroll_canvas.style.height.replace('px','')) - 20;
const scrollerTop = 10;
const scrollerLeft = 15;

let scrollButtonWidth = 40;
let scrollButtonHeight = scrollerHeight - 2;

function draw() {
// 스크롤러 테두리 그리기
    ctx.beginPath();
    ctx.strokeStyle = '#535353';
    ctx.rect(scrollerLeft, scrollerTop, scrollerWidth, scrollerHeight);
    ctx.stroke();

// 스크롤러 버튼 그리기
    ctx.beginPath();
    ctx.fillStyle = '#b8b8b8';
    ctx.rect(scrollerLeft, scrollerTop + 1, scrollButtonWidth, scrollButtonHeight);
    ctx.stroke();
    ctx.fill();

    requestAnimationFrame(draw);
}

draw();

title_bar.addEventListener('mousedown', (e) => {
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    isMoving = true;
});

title_bar.addEventListener('mousemove', (e) => {
    if (isMoving) {
        e.preventDefault();
        let newX = e.clientX;
        let newY = e.clientY;
        viewport_controller.style.left = viewport_controller.offsetLeft - (initialX - newX) + 'px';
        viewport_controller.style.top = viewport_controller.offsetTop - (initialY - newY) + 'px';
        initialY = newY;
        initialX = newX;
    }
});

title_bar.addEventListener('mouseup', (e) => {
    isMoving = false;
});


function IsMouseInShape(x, y, shape) {
    const shape_left = shape.x;
    const shape_right = shape.x + shape.width;
    const shape_top = shape.y;
    const shape_bottom = shape.y + shape.height;

    if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
        return true;
    }

    return false;
}

const CanvasMouseDown = (event) => {
    event.preventDefault();

    let startX = parseInt(event.clientX);
    let startY = parseInt(evnet.clientY);

    let index = 0;

};
