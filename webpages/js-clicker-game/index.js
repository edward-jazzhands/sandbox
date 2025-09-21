let gems_html = document.querySelector('.gems-count');
let cost_html = document.querySelector('.cost')
let current_level_html = document.querySelector('.current-level')
let next_level_html = document.querySelector('.next-level')
let gems_sec_html = document.querySelector('.gems-per-sec')

let current_gems = 0;
let current_cost = 10;
let current_level = 0;
let intervalID = null;

gems_html.textContent = current_gems;
cost_html.textContent = current_cost;
current_level_html.textContent = current_level;
next_level_html.textContent = current_level + 1;
gems_sec_html.textContent = current_level;

function incrementGem(event) {
    current_gems += 1
    gems_html.textContent = current_gems;
    firework(event)
}

function buyUpgrade() {
    if (current_gems >= current_cost) {
        current_gems -= current_cost;
        gems_html.textContent = current_gems;
        current_cost += 10 * (current_level + 1);
        cost_html.textContent = current_cost;
        current_level += 1;
        current_level_html.textContent = current_level;
        next_level_html.textContent = current_level + 1;
        gems_sec_html.textContent = current_level;

        if (intervalID !== null) {
            clearInterval(intervalID);
        }

        intervalID = setInterval(() => {
            current_gems += current_level;
            gems_html.textContent = current_gems;
        }, 1000);  // 1000 for tick every second


    }
}

function firework(e) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const x = e?.clientX || Math.random() * canvas.width;
    const y = e?.clientY || Math.random() * canvas.height;
    const particles = [];
    
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life--;
        
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        
        if (p.life <= 0) particles.splice(i, 1);
      });
      
      if (particles.length > 0) requestAnimationFrame(animate);
      else document.body.removeChild(canvas);
    }
    
    animate();
}
