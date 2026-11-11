const burger = document.querySelector(".burger"),
  nav = document.querySelector("nav");
function close() {
  nav.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
burger.onclick = () => {
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
nav.querySelectorAll("a").forEach((a) => (a.onclick = close));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    close();
    burger.focus();
  }
});
const choices = ["discipline", "goal", "place"];
function update() {
  const v = choices.map(
    (x) => document.querySelector('input[name="' + x + '"]:checked').value,
  );
  document.querySelector("#ticket-title").textContent = v[0] + " / " + v[1];
  document.querySelector("#request").textContent =
    "Здравствуйте! Интересует " +
    v[0].toLowerCase() +
    ". Формат: " +
    v[1] +
    ". Площадка: " +
    v[2] +
    ". Подскажите стоимость, длительность и условия участия.";
}
choices.forEach((id) => (document.getElementById(id).onchange = update));
update();
document.querySelector("#copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText(
      document.querySelector("#request").textContent,
    );
    document.querySelector("#copy-status").textContent =
      "Скопировано. Вставь текст в Direct.";
  } catch {
    const r = document.createRange();
    r.selectNodeContents(document.querySelector("#request"));
    getSelection().removeAllRanges();
    getSelection().addRange(r);
    document.querySelector("#copy-status").textContent =
      "Выделили сообщение: скопируй его вручную.";
  }
};
document.querySelectorAll(".player").forEach((p) => {
  const v = p.querySelector("video"),
    play = p.querySelector(".play"),
    seek = p.querySelector(".seek");
  async function start() {
    try {
      document.querySelectorAll("video").forEach((x) => {
        if (x !== v) x.pause();
      });
      await v.play();
      p.querySelector(".video-error").textContent = "";
    } catch {
      p.querySelector(".video-error").textContent =
        "Не удалось запустить видео. Попробуйте ещё раз.";
    }
  }
  play.onclick = start;
  p.querySelector(".pause").onclick = () => (v.paused ? start() : v.pause());
  v.onplay = () => {
    p.classList.add("started", "playing");
    p.classList.remove("paused");
    p.querySelector(".pause").textContent = "Ⅱ";
    p.querySelector(".pause").setAttribute("aria-label", "Пауза");
  };
  v.onpause = () => {
    p.classList.remove("playing");
    p.classList.add("paused");
    p.querySelector(".pause").textContent = "▶";
    p.querySelector(".pause").setAttribute("aria-label", "Продолжить");
  };
  v.onended = () => {
    v.currentTime = 0;
    p.classList.remove("playing");
  };
  v.ontimeupdate = () => {
    seek.value = v.duration ? (100 * v.currentTime) / v.duration : 0;
  };
  seek.oninput = () => {
    if (Number.isFinite(v.duration))
      v.currentTime = (Number(seek.value) * v.duration) / 100;
  };
  p.querySelector(".sound").onclick = (e) => {
    v.muted = !v.muted;
    e.target.textContent = v.muted ? "Без звука" : "Звук";
    e.target.setAttribute(
      "aria-label",
      v.muted ? "Включить звук" : "Выключить звук",
    );
  };
  p.querySelector(".full").onclick = async () => {
    try {
      if (p.requestFullscreen) await p.requestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    } catch {}
  };
});
const stories = [
  "Дрифт-свидание: подарок молодому человеку и впечатление на двоих.",
  "Подарок парню, который любит машины. Вместо вещи — первый опыт за рулём.",
  "Приехать попробовать или пройти обучение базе: выбор за тобой.",
];
let n = 0;
function story(d) {
  n = (n + d + 3) % 3;
  document.querySelector("#story").textContent = stories[n];
  document.querySelector("#story-count").textContent = n + 1 + " / 3";
}
document.querySelector("#prev").onclick = () => story(-1);
document.querySelector("#next").onclick = () => story(1);
document.querySelectorAll("[data-query]").forEach(
  (b) =>
    (b.onclick = () => {
      document.querySelector("#map-panel").hidden = false;
      document.querySelector("#map-name").textContent = b.dataset.query;
      document.querySelector("#map-link").href =
        "https://yandex.ru/maps/?text=" + encodeURIComponent(b.dataset.query);
    }),
);
const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
if (window.gsap && !reduced) {
  gsap.from("h1", { y: 35, opacity: 0, duration: 1, ease: "power3.out" });
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray("section:not(.hero) h2").forEach((h) =>
      gsap.from(h, {
        y: 25,
        opacity: 0.3,
        duration: 0.7,
        scrollTrigger: { trigger: h, start: "top 95%", once: true },
      }),
    );
    gsap.to(".hero-photo img", {
      y: 80,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}
if (matchMedia("(pointer:fine)").matches && !reduced) {
  const c = document.querySelector(".cursor");
  document.addEventListener("pointermove", (e) => {
    c.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
    c.classList.toggle("over", !!e.target.closest("a,button"));
  });
  document.querySelectorAll(".magnetic").forEach((b) => {
    b.onpointermove = (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform =
        "translate(" +
        (e.clientX - r.left - r.width / 2) * 0.08 +
        "px," +
        (e.clientY - r.top - r.height / 2) * 0.12 +
        "px)";
    };
    b.onpointerleave = () => (b.style.transform = "");
  });
}
