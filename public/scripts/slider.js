var numbers = document.getElementsByClassName("numberWithCommas");
    for(var i=0; i < numbers.length ; i++){
        numbers[i].innerHTML = numbers[i].innerHTML.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

function createSlider3d() {
  let _ = s => document.querySelector(s),
    //put your selectors below
    slider = _(".slider3d"),
    left = _(".slider3d_left"),
    right = _(".slider3d_right"),
    //
    wrap = slider.children[0],
    all = wrap.children.length,
    gCS = window.getComputedStyle(slider),
    width = parseInt(gCS.width),
    myR = width / (2 * Math.tan(Math.PI / all)),
    step = 360 / all,
    angle = 0;

  for (let i = 0; i < all; i++) {
    let rad = i * step * Math.PI / 180;
    wrap.children[i].style.transform = `
      translate3d(${myR * Math.sin(rad)}px,
      0,${myR * Math.cos(rad)}px)
      rotateY(${i * step}deg)`;
  }

  function nav(d) {
    angle += step * d;
    wrap.style.transform = `
      translateZ(${-myR}px)
      rotateY(${angle}deg)`;
  }

  left.onclick = () => nav(1);
  right.onclick = () => nav(-1);
  nav(0);
}

window.addEventListener("resize", createSlider3d);
window.addEventListener("load", createSlider3d);

//
//
//
//
//
// secondary script
(() => {
  var _ = s => document.querySelector(s),
    slider = _(".slider3d"),
    wrap = _(".slider3d_wrap"),
    arr = wrap.children,
    x = 50,
    y = 50,
    slideAmount = 6;

  _(".bfv").onchange = function() {
    let s = this.checked ? `visible` : `hidden`;
    for (var i = 0; i < arr.length; i++) {
      arr[i].style.backfaceVisibility = s;
    }
  };

  _(".oh").onchange = function() {
    let st = this.checked ? `visible` : `hidden`;
    _(".slider3d").style.overflow = st;
  };

  _(".po_x").oninput = function() {
    x = this.value;
    perspOrigin();
  };

  _(".po_y").oninput = function() {
    y = this.value;
    perspOrigin();
  };

  function perspOrigin() {
    slider.style.perspectiveOrigin = `${x}% ${y}%`;
  }

  _("[type='range']").oninput = function() {
    slider.style.perspective = `${this.value}px`;
  };

  _(".slideRem").onclick = function() {
    if (slideAmount < 4) return;
    let el = wrap.children[slideAmount - 1];
    wrap.removeChild(el);
    slideAmount--;
    createSlider3d();
  };

  _(".slideAdd").onclick = function() {
    let el = document.createElement("div");
    el.innerText = slideAmount + 1;
    wrap.appendChild(el);
    slideAmount++;
    createSlider3d();
  };
})();


let wnlc = window.location,
   rexp = new RegExp(`${wnlc.host}\/(.*)`),
   path = rexp.exec(wnlc)[1];



    