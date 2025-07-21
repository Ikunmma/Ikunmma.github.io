var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();

/*
//鼠标拖动星星特效
(function fairyDustCursor() {

    var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cursor = {x: width/2, y: width/2};
    var particles = [];
  
    function init() {
      bindEvents();
      loop();
    }
  
    // Bind events that are needed
    function bindEvents() {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchstart', onTouchMove);
  
      window.addEventListener('resize', onWindowResize);
    }
  
    function onWindowResize(e) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
  
    function onTouchMove(e) {
      if( e.touches.length > 0 ) {
        for( var i = 0; i < e.touches.length; i++ ) {
          addParticle( e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
        }
      }
    }
  
    function onMouseMove(e) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
  
      addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
    }
  
    function addParticle(x, y, color) {
      var particle = new Particle();
      particle.init(x, y, color);
      particles.push(particle);
    }
  
    function updateParticles() {
  
      for( var i = 0; i < particles.length; i++ ) {
        particles[i].update();
      }
  
      for( var i = particles.length -1; i >= 0; i-- ) {
        if( particles[i].lifeSpan < 0 ) {
          particles[i].die();
          particles.splice(i, 1);
        }
      }
  
    }
  
    function loop() {
      requestAnimationFrame(loop);
      updateParticles();
    }
  
    function Particle() {
  
      this.character = "*";
      this.lifeSpan = 120; //ms
      this.initialStyles ={
        "position": "fixed",
        "top": "0", //必须加
        "display": "block",
        "pointerEvents": "none",
        "z-index": "10000000",
        "fontSize": "20px",
        "will-change": "transform"
      };
  
      this.init = function(x, y, color) {
  
        this.velocity = {
          x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
          y: 1
        };
  
        this.position = {x: x - 10, y: y - 20};
        this.initialStyles.color = color;
        console.log(color);
  
        this.element = document.createElement('span');
        this.element.innerHTML = this.character;
        applyProperties(this.element, this.initialStyles);
        this.update();
  
        document.body.appendChild(this.element);
      };
  
      this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.lifeSpan--;
  
        this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + (this.lifeSpan / 120) + ")";
      }
  
      this.die = function() {
        this.element.parentNode.removeChild(this.element);
      }
  
    }
  
    function applyProperties( target, properties ) {
      for( var key in properties ) {
        target.style[ key ] = properties[ key ];
      }
    }
  
    init();
})();
*/


