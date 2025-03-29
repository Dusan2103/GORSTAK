// BEAR PAW ANIMATION SETUP
const $pawPrintsContainer = $(".paw-prints");
const $timeline = $(".timeline");
const totalSteps = 9;
const staggerDelay = 1000; 
const fadeDuration = 500; 
const bearSeparationSteps = 3; 
let timelineHeight = $timeline.height(); 
let stepHeight = timelineHeight / (totalSteps - 1); 
let activePawSets = [];

const getOffsetX = () => {
  return window.innerWidth < 800 ? 20 : 40; 
};

const getStaggerY = () => {
  return window.innerWidth < 800 ? 40 : 60; 
};

const createPawPrint = (x, y, type, bearId) => {
  const $pawPrint = $("<div></div>")
    .addClass(`paw-print ${type} bear-${bearId}`)
    .css({ 
      left: `${x}px`, 
      top: `${y}px`, 
      opacity: 0, 
      position: "absolute"
    });
  $pawPrintsContainer.append($pawPrint);
  return $pawPrint;
};

const animateBearWalk = (stepIndex, bearId) => {
  const offsetX = getOffsetX();
  const staggerY = getStaggerY(); 
  const centerX = $pawPrintsContainer.width() / 2;
  const baseY = stepIndex * stepHeight;

  const clampedY = Math.min(Math.max(baseY, 0), timelineHeight);

  const paws = [
    createPawPrint(centerX - offsetX, clampedY, "front-left", bearId),
    createPawPrint(centerX + offsetX, clampedY + staggerY, "front-right", bearId),
    createPawPrint(centerX - offsetX, clampedY + staggerY * 2, "back-left", bearId),
    createPawPrint(centerX + offsetX, clampedY + staggerY * 3, "back-right", bearId),
  ];

  activePawSets.push({ bearId, stepIndex, paws });

  paws.forEach(($paw, index) => {
    setTimeout(() => {
      $paw.fadeTo(fadeDuration, 1);
    }, index * 100);
  });

  setTimeout(() => {
    paws.forEach(($paw, index) => {
      setTimeout(() => {
        $paw.fadeTo(fadeDuration, 0, () => $paw.remove());
      }, index * 100);
    });
    activePawSets = activePawSets.filter(set => set.paws !== paws);
  }, fadeDuration + 400); 
};

const startPawLoop = () => {
  let bearSteps = [0, 0, 0, 0]; 
  let bear1Started = false;
  let bear2Started = false;
  let bear3Started = false;

  const advanceBear0 = () => {
    animateBearWalk(bearSteps[0], 0); 
    bearSteps[0] = (bearSteps[0] + 1) % totalSteps;
  };

  const advanceBear1 = () => {
    animateBearWalk(bearSteps[1], 1); 
    bearSteps[1] = (bearSteps[1] + 1) % totalSteps;
  };

  const advanceBear2 = () => {
    animateBearWalk(bearSteps[2], 2);
    bearSteps[2] = (bearSteps[2] + 1) % totalSteps;
  };

  const advanceBear3 = () => {
    animateBearWalk(bearSteps[3], 3); 
    bearSteps[3] = (bearSteps[3] + 1) % totalSteps; 
  };

  advanceBear0();
  setInterval(advanceBear0, staggerDelay);

  setTimeout(() => {
    advanceBear1();
    setInterval(advanceBear1, staggerDelay);
    bear1Started = true;
  }, staggerDelay * bearSeparationSteps);

  setTimeout(() => {
    advanceBear2();
    setInterval(advanceBear2, staggerDelay);
    bear2Started = true;
  }, staggerDelay * bearSeparationSteps * 2);

  setTimeout(() => {
    advanceBear3();
    setInterval(advanceBear3, staggerDelay);
    bear3Started = true;
  }, staggerDelay * bearSeparationSteps * 3);
};

let loopStarted = false;
document.addEventListener("scroll", function () {
  const containerTop = $pawPrintsContainer.offset().top;
  const containerBottom = containerTop + $pawPrintsContainer.height();
  const scrollTop = $(window).scrollTop();
  const scrollBottom = scrollTop + $(window).height();

  if (!loopStarted && scrollBottom > containerTop && scrollTop < containerBottom) {
    startPawLoop();
    loopStarted = true;
  }
});

const updateTimelineDimensions = () => {
  timelineHeight = $timeline.height(); 
  stepHeight = timelineHeight / (totalSteps - 1); 
  const offsetX = getOffsetX(); 
  const staggerY = getStaggerY(); 
  const centerX = $pawPrintsContainer.width() / 2;
  activePawSets.forEach(set => {
    const newBaseY = set.stepIndex * stepHeight;
    const clampedY = Math.min(Math.max(newBaseY, 0), timelineHeight);
    set.paws[0].css({ top: `${clampedY}px`, left: `${centerX - offsetX}px` });
    set.paws[1].css({ top: `${clampedY + staggerY}px`, left: `${centerX + offsetX}px` });
    set.paws[2].css({ top: `${clampedY + staggerY * 2}px`, left: `${centerX - offsetX}px` });
    set.paws[3].css({ top: `${clampedY + staggerY * 3}px`, left: `${centerX + offsetX}px` });
  });
};

window.addEventListener("resize", () => {
  updateTimelineDimensions();
  const centerX = $pawPrintsContainer.width() / 2;
  const offsetX = getOffsetX();
  const staggerY = getStaggerY(); 
  $(".paw-print").each(function () {
    const $pawPrint = $(this);
    const type = $pawPrint.hasClass("front-left") || $pawPrint.hasClass("back-left") ? "left" : "right";
    const newLeft = type === "left" ? centerX - offsetX : centerX + offsetX;
    $pawPrint.css({ left: `${newLeft}px` });
  });
});