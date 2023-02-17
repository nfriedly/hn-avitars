    // ==UserScript==
    // @name        HN Avatars in 396 bytes
    // @description Annotated avatars on all HN comments.
    // @author      tomxor (https://news.ycombinator.com/user?id=tomxor)
    // @icon        https://news.ycombinator.com/favicon.ico
    // @namespace   https://news.ycombinator.com/item?id=30668137
    // @include     https://news.ycombinator.com/newcomments*
    // @include     https://news.ycombinator.com/item*
    // @include     https://news.ycombinator.com/user*
    // @grant       none
    // @version     1.0.6
    // @compatible  firefox
    // @compatible  chrome
    // @compatible  edge
    // @compatible  opera
    // ==/UserScript==
     
   let observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        const p = 2;
        const c = document.createElement("canvas");
        const x = c.getContext("2d");
        c.width = 18;
        c.height = 14;
        const s = entry.target.innerText;
        const r = 1;

        if (s) {
          for (
            let s = entry.target.innerText, r = 1, i = 28 + s.length;
            i--;

          ) {
            // xorshift32
            (r ^= r << 13), (r ^= r >>> 17), (r ^= r << 5);
            const X = i & 3,
              Y = i >> 2;
            if (i >= 28) {
              // seed state
              r += s.charCodeAt(i - 28);
              x.fillStyle =
                "#" + ((r >> 8) & 0xffffff).toString(16).padStart(6, "0");
            } else {
              // draw pixel
              if (r >>> 29 > (X * X) / 3 + Y / 2)
                x.fillRect(p * 3 + p * X, p * Y, p, p),
                  x.fillRect(p * 3 - p * X, p * Y, p, p);
            }
          }
        }

        entry.target.prepend(c);
      }
    });
  },
  { rootMargin: "0px 0px 0px 0px" }
);

document.querySelectorAll(".hnuser, #me").forEach((user) => {
  observer.observe(user);
});
