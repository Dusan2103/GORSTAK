  // BEAR PAW ANIMATION SETUP
  const $pawPrintsContainer = $(".paw-prints");
  const $timeline = $(".timeline");
  const totalSteps = 9; // Number of steps down the timeline
  const staggerDelay = 1000; // Delay between steps (1 second)
  const fadeDuration = 500; // Time for fade-in/fade-out (0.5 seconds)
  const bearSeparationSteps = 3; // Separation between bears in steps
  let timelineHeight = $timeline.height(); // Initial height
  let stepHeight = timelineHeight / (totalSteps - 1); // Initial step height
  let activePawSets = [];

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
    const offsetX = 40;
    const staggerY = 60;
    const centerX = $pawPrintsContainer.width() / 2;
    const baseY = stepIndex * stepHeight; // Position for this step

    // Ensure baseY stays within bounds
    const clampedY = Math.min(Math.max(baseY, 0), timelineHeight);

    // Create a set of 4 paws for this bear
    const paws = [
      createPawPrint(centerX - offsetX, clampedY, "front-left", bearId),
      createPawPrint(centerX + offsetX, clampedY + staggerY, "front-right", bearId),
      createPawPrint(centerX - offsetX, clampedY + staggerY * 2, "back-left", bearId),
      createPawPrint(centerX + offsetX, clampedY + staggerY * 3, "back-right", bearId),
    ];

    activePawSets.push({ bearId, stepIndex, paws });

    // Fade in each paw with a slight stagger
    paws.forEach(($paw, index) => {
      setTimeout(() => {
        $paw.fadeTo(fadeDuration, 1);
      }, index * 100); // 100ms delay between paws in a set
    });

    // Fade out the set after a short delay
    setTimeout(() => {
      paws.forEach(($paw, index) => {
        setTimeout(() => {
          $paw.fadeTo(fadeDuration, 0, () => $paw.remove());
        }, index * 100);
      });
      activePawSets = activePawSets.filter(set => set.paws !== paws);
    }, fadeDuration + 400); // Fade out after 1 second total visibility
  };

  const startPawLoop = () => {
    let bearSteps = [0, 0, 0, 0]; // All four bears start at step 0
    let bear1Started = false;
    let bear2Started = false;
    let bear3Started = false;

    const advanceBear0 = () => {
      animateBearWalk(bearSteps[0], 0); // Animate bear 0
      bearSteps[0] = (bearSteps[0] + 1) % totalSteps; // Advance bear 0
    };

    const advanceBear1 = () => {
      animateBearWalk(bearSteps[1], 1); // Animate bear 1
      bearSteps[1] = (bearSteps[1] + 1) % totalSteps; // Advance bear 1
    };

    const advanceBear2 = () => {
      animateBearWalk(bearSteps[2], 2); // Animate bear 2
      bearSteps[2] = (bearSteps[2] + 1) % totalSteps; // Advance bear 2
    };

    const advanceBear3 = () => {
      animateBearWalk(bearSteps[3], 3); // Animate bear 3
      bearSteps[3] = (bearSteps[3] + 1) % totalSteps; // Advance bear 3
    };

    // Start bear 0 immediately
    advanceBear0();
    setInterval(advanceBear0, staggerDelay);

    // Start bear 1 after a delay
    setTimeout(() => {
      advanceBear1();
      setInterval(advanceBear1, staggerDelay);
      bear1Started = true;
    }, staggerDelay * bearSeparationSteps);

    // Start bear 2 after an additional delay
    setTimeout(() => {
      advanceBear2();
      setInterval(advanceBear2, staggerDelay);
      bear2Started = true;
    }, staggerDelay * bearSeparationSteps * 2);

    // Start bear 3 after an additional delay
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

  // Handle resizing to ensure responsive steps
  const updateTimelineDimensions = () => {
    timelineHeight = $timeline.height(); // Update height on resize
    stepHeight = timelineHeight / (totalSteps - 1); // Recalculate step height
    // Optionally reposition active paws (if needed)
    activePawSets.forEach(set => {
      const newBaseY = set.stepIndex * stepHeight;
      const clampedY = Math.min(Math.max(newBaseY, 0), timelineHeight);
      const staggerY = 45;
      set.paws[0].css({ top: `${clampedY}px` });
      set.paws[1].css({ top: `${clampedY + staggerY}px` });
      set.paws[2].css({ top: `${clampedY + staggerY * 2}px` });
      set.paws[3].css({ top: `${clampedY + staggerY * 3}px` });
    });
  };

  window.addEventListener("resize", () => {
    updateTimelineDimensions();
    const centerX = $pawPrintsContainer.width() / 2;
    $(".paw-print").each(function () {
      const $pawPrint = $(this);
      const type = $pawPrint.hasClass("front-left") || $pawPrint.hasClass("back-left") ? "left" : "right";
      const newLeft = type === "left" ? centerX - 25 : centerX + 25;
      $pawPrint.css({ left: `${newLeft}px` });
    });
  });
