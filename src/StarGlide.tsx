import { useEffect, useMemo, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import type { StarGlideProps, FillColorSpec } from "./StarGlide.types";
// eslint-disable-next-line import/no-unresolved
const DEF_HEIGHT_STARS = 14;
const DEF_ICONS_COUNT = 5;
const INITIAL_RATING = 0;
const INITIAL_SIZE_RATING = 0;

const StarGlide: React.FC<StarGlideProps> = ({
  containerKey,
  fillColor: currentFillColor = "",
  rating: currentRating = 0,
  iconsCount: currentIconsCount = 5,
  size: currentIconsSize = 14,
  onPointerLeave = null,
  onPointerClick = null,
  onPointerMove = null,
  className = "",
  showTooltip = true,
  transition = false,
  staleOnClick = false,
  readOnly = false,
  ratingTitle = "",
}) => {
  // default svg data for star (string template)
  const DEF_SVG_DATA = useMemo(
    () =>
      `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' width='${DEF_HEIGHT_STARS}' height='${DEF_HEIGHT_STARS}' viewBox='0 0 58 58'%3E%3Cpath d='M58,22.111L40.041,35.8l6.92,22.154L29.024,44.236,11.115,58l6.872-22.171L0,22.18,22.185,22.2,28.976,0l6.839,22.182Z' /%3E%3C/svg%3E"`,
    []
  );

  const DEF_FILL_COLORS: Record<string, FillColorSpec> = useMemo(
    () => ({
      black: {
        rgb: "rgb(0, 0, 0)",
        hex: "#000000",
        filter: "brightness(0) saturate(100%)",
      },
      green: {
        rgb: "rgb(2, 171, 110)",
        hex: "#02ab6e",
        filter:
          "brightness(0) saturate(100%) invert(46%) sepia(26%) saturate(6040%) hue-rotate(132deg) brightness(94%) contrast(98%)",
      },
      red: {
        rgb: "rgb(255, 0, 0)",
        hex: "#ff0000",
        filter:
          "brightness(0) saturate(100%) invert(62%) sepia(99%) saturate(7485%) hue-rotate(350deg) brightness(92%) contrast(133%)",
      },
      blue: {
        rgb: "rgb(0, 0, 255)",
        hex: "#0000ff",
        filter:
          "brightness(0) saturate(100%) invert(8%) sepia(100%) saturate(7474%) hue-rotate(249deg) brightness(101%) contrast(142%)",
      },
      yellow: {
        rgb: "rgb(255, 255, 0)",
        hex: "#ffff00",
        filter:
          "brightness(0) saturate(100%) invert(91%) sepia(89%) saturate(1260%) hue-rotate(355deg) brightness(105%) contrast(105%)",
      },
      orange: {
        rgb: "rgb(237, 127, 16)",
        hex: "#ed7f10",
        filter:
          "brightness(0) saturate(100%) invert(59%) sepia(67%) saturate(3279%) hue-rotate(359deg) brightness(99%) contrast(89%)",
      },
      purple: {
        rgb: "rgb(160, 32, 240)",
        hex: "#a020f0",
        filter:
          "brightness(0) saturate(100%) invert(13%) sepia(89%) saturate(5580%) hue-rotate(277deg) brightness(105%) contrast(89%)",
      },
    }),
    []
  );

  // state
  currentRating =
    typeof currentRating === "number" && currentRating > 0
      ? currentRating
      : INITIAL_RATING;
  const [rating, setRating] = useState<number>(currentRating);
  const [sizeRating, setSizeRating] = useState<number>(INITIAL_SIZE_RATING);
  const [triggerRating, setTriggerRating] = useState<number>(currentRating);
  const [filterToApply, setFilterToApply] = useState<string>("");
  const [maxIcons, setMaxIcons] = useState<number>(currentIconsCount);
  const [containerStars, setContainer] = useState<HTMLElement | null>(null);
  const [currFillColor, setCurrentFillColor] = useState<string>(
    currentFillColor.toString().trim()
  );

  // safe tooltip text (guard against non-finite rating)
  const tooltipText = `${
    Number.isFinite(rating) ? Math.abs(rating).toFixed(1) : "0"
  } / ${maxIcons}`;

  const tooltip = (
    <Tooltip
      id={`${containerKey ?? "default"}-tooltip`}
      style={{ zIndex: 500 }}
    >
      {tooltipText}
    </Tooltip>
  );
  // set up fill color filter and find container element
  useEffect(() => {
    try {
      let filter = "";
      const allowColors: Array<string> = [];
      const defColorKeys = Object.keys(DEF_FILL_COLORS);

      // normalize incoming prop to trimmed string
      setCurrentFillColor(String(currentFillColor || "").trim());

      // extract accepted colors (name + rgb + hex)
      defColorKeys.forEach((primaryColor) => {
        allowColors.push(primaryColor);
        const spec = DEF_FILL_COLORS[primaryColor];
        allowColors.push(spec.rgb);
        allowColors.push(spec.hex);
      });

      // determine matching filter
      if (currFillColor && allowColors.includes(currFillColor)) {
        for (const primaryColor of defColorKeys) {
          if (primaryColor === currFillColor) {
            filter = primaryColor;
            break;
          }
          const spec = DEF_FILL_COLORS[primaryColor];
          if (
            (spec.rgb === currFillColor || spec.hex === currFillColor) &&
            !filter
          ) {
            filter = primaryColor;
            break;
          }
        }
        if (filter) {
          setFilterToApply(DEF_FILL_COLORS[filter].filter);
        }
      }

      if (!filter) setFilterToApply(""); // filtre par default si aucune couleur predefini reconnue

      // find container element by ID
      if (typeof document !== "undefined") {
        const container = document.getElementById(containerKey);
        if (!container) {
          throw new Error(
            "You need to provide a valid CSS identifier as [containerKey] for the container of your stars"
          );
        }
        setContainer(container);
      }
    } catch (error) {
      // keep console.log to mirror original behavior
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [DEF_FILL_COLORS, containerKey, currFillColor, currentFillColor]); // kept similar deps
  
  // make sure that tracking hover bloc stars don't lose his dimension when [showTooltip] changes
  useEffect(() => {
    if (!containerStars) return;
    const hoverLayer = containerStars.querySelector<HTMLElement>(
      "span.sb-hover-layer"
    );
    const starsBloc = containerStars.querySelector<HTMLElement>(".stars-bloc");
    if (!hoverLayer || !starsBloc) return;
    if (!hoverLayer.getAttribute('style')) {
      hoverLayer.style.width=starsBloc.style.width;
      hoverLayer.style.height=starsBloc.style.height;
    }
  }, [showTooltip, containerStars]);

  // layout / sizing adjustments, DOM manipulations
  useEffect(() => {
    try {
      if (!containerStars) return;
      /*define all the 3 stars blocs *
       * goldLayer : use to set the width of the colored bloc after stars hovering
       * grayLayer : use to set the width of the gray bloc
       * hoverLayer : use to track the width of the rating in relation to mouse position
       */
      const goldLayer =
        containerStars.querySelector<HTMLElement>("span.sb-gold-layer");
      const grayLayer =
        containerStars.querySelector<HTMLElement>("span.sb-gray-layer");
      const hoverLayer = containerStars.querySelector<HTMLElement>(
        "span.sb-hover-layer"
      );

      if (hoverLayer && goldLayer && grayLayer) {
        // verify wether to change numbers of icons or size of stars
        const isWidthChanged = currentIconsSize >= DEF_HEIGHT_STARS;
        const isIconsCountChanged = currentIconsCount >= DEF_ICONS_COUNT;
        const isBothLowerZero = !isIconsCountChanged && !isWidthChanged;
        let newWidthStars = 0;
        let nbrIcons = currentIconsCount;

        if (isIconsCountChanged || isWidthChanged || isBothLowerZero) {
          // // round values
          // setCurrentIconsSize(Math.round(currentIconsSize));
          // setCurrentIconsCount(Math.round(currentIconsCount));

          // calculate new width
          if (isIconsCountChanged) {
            newWidthStars = isWidthChanged
              ? currentIconsSize * currentIconsCount
              : currentIconsCount * DEF_HEIGHT_STARS;
          } else if (isWidthChanged) {
            newWidthStars = currentIconsSize * DEF_ICONS_COUNT;
          }

          // Modify max width of stars if width or height less than the default value
          if (!isIconsCountChanged || !isWidthChanged) {
            newWidthStars = currentIconsSize * Math.max(currentIconsCount, 1);
          }
          // verify the width and the height of the stars
          const { innerWidth, innerHeight } = window;
          const exceedVPWidth = newWidthStars >= innerWidth;
          const exceedVPHeight = currentIconsSize >= innerHeight;

          // check if the size of the stars doesnt exceed viewport size
          if (exceedVPWidth || exceedVPHeight) {
            const actualRating =
              (currentRating * DEF_HEIGHT_STARS) / DEF_ICONS_COUNT;
            goldLayer.classList.remove("sb-layer-none");
            goldLayer.style.width = actualRating + "px";

            // set the new number of icons
            setMaxIcons(DEF_ICONS_COUNT);

            // prompt error if the width or the height of the stars exceed the viewport
            if (exceedVPWidth)
              throw new Error(
                "The width of your stars container must not exceed the width of your screen\nReduce the [size] or the [iconsCount] to fit the screen"
              );
            if (exceedVPHeight)
              throw new Error(
                "The height of your stars container must not exceed the height of your screen\nReduce the [size] or the [iconsCount] to fit the screen"
              );
          }

          // update svg background images
          const newSVGData = DEF_SVG_DATA.replace(
            `width='${DEF_HEIGHT_STARS}' height='${DEF_HEIGHT_STARS}'`,
            `width='${currentIconsSize}' height='${currentIconsSize}'`
          );

          [grayLayer, goldLayer].forEach((layer, key) => {
            const svgData = newSVGData.replace(
              "fill='currentColor'",
              `fill='${key === 0 ? "%23dadbdb" : "%23ffd700"}'`
            );
            layer.style.backgroundImage = `url(${svgData})`;
          });

          // define height and width of stars blocs
          [hoverLayer, goldLayer, grayLayer].forEach((layer) => {
            layer.style.width = newWidthStars + "px";
            layer.style.height = currentIconsSize + "px";
          });

          // set the new width of the first stars container
          const starsBloc =
            containerStars.querySelector<HTMLElement>("div.stars-bloc");
          if (starsBloc) {
            starsBloc.style.width = newWidthStars + "px";
            starsBloc.style.height = currentIconsSize + "px";
          }

          // set the new number of icons
          nbrIcons = Math.round(newWidthStars / currentIconsSize);
          setMaxIcons(nbrIcons);
        }

        // define the new number of icons to show
        if (typeof nbrIcons === "number") {
          const actualRating =
            (Math.min(currentRating, nbrIcons) * newWidthStars) / nbrIcons || 0;
          setSizeRating(actualRating);
          goldLayer.classList.remove("sb-layer-none");
          goldLayer.style.width = actualRating ? `${actualRating}px` : "0";
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    // keep dependency list similar to original
  }, [
    containerStars,
    currentIconsSize,
    currentIconsCount,
    DEF_SVG_DATA,
    currentRating,
  ]);

  // update star widths on sizeRating or rating changes
  useEffect(() => {
    try {
      if (!containerStars) return;
      const goldLayer =
        containerStars.querySelector<HTMLElement>("span.sb-gold-layer");
      const starsBloc =
        containerStars.querySelector<HTMLElement>("div.stars-bloc");
      // update the size of rating
      if (goldLayer && starsBloc) {
        goldLayer.classList.remove("sb-layer-none");
        goldLayer.style.width = `${sizeRating}px`;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [containerStars, rating, sizeRating]);

  // user pointer left the hover area
  function cancelRating(): void {
    try {
      if (!containerStars) return;
      const hoverLayer = containerStars.querySelector<HTMLElement>(
        "span.sb-hover-layer"
      );
      if (typeof currentRating !== "number" || currentRating < 0)
        throw new Error("The [rating] value must be a positive float");

      // reset the size and the value of rating
      if (hoverLayer && currentRating.toFixed(2) === triggerRating.toFixed(2)) {
        const actualRating =
          (Math.min(triggerRating, maxIcons) * hoverLayer.clientWidth) /
          maxIcons;
        setSizeRating(actualRating);
        setRating(triggerRating);
      }

      // call onPointerLeave function when pointer leave star bloc if define
      if (onPointerLeave && typeof onPointerLeave === "function") {
        onPointerLeave(rating, sizeRating, maxIcons);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  // calculate hover size and the live rating according to mouse position
  function calculateRating(
    e: React.MouseEvent<HTMLElement>,
    containerStarsParam: HTMLElement | null
  ) {
    if (!containerStarsParam || !e.currentTarget) return;
    const hoverLayer = e.currentTarget as HTMLElement;
    const grayLayer =
      containerStarsParam.querySelector<HTMLElement>("span.sb-gray-layer");
    if (!grayLayer) return;
    const rect = hoverLayer.getBoundingClientRect();
    const left = rect.left;
    const clientX = e.clientX;
    const x = clientX - left;
    const percentHover = (100 * x) / grayLayer.clientWidth;
    const actualRating = (maxIcons * percentHover) / 100;
    return { size: x, liveRating: actualRating };
  }

  // pointer click
  function saveRating(e: React.MouseEvent<HTMLElement>) {
    try {
      if (!containerStars) return;
      let finalRating = rating;
      let finalSizeRating = sizeRating;

      // retourne les information de note actuelles
      if (Math.floor(rating) === 0) {
        const actualRating = calculateRating(e, containerStars);
        if (actualRating) {
          const { size, liveRating } = actualRating;
          finalRating = liveRating;
          finalSizeRating = size;
        }
      }

      if (!readOnly || staleOnClick) {
        setTriggerRating(finalRating);
        // call onPointerClick function when pointer click star bloc if define
        if (typeof onPointerClick === "function") {
          onPointerClick(finalRating, finalSizeRating, maxIcons);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  // pointer move (hover)
  function hoverRating(e: React.MouseEvent<HTMLElement>) {
    try {
      if (!containerStars) return;

      if (!readOnly || (readOnly && currentRating === 0)) {
        const actualRating = calculateRating(e, containerStars);
        if (!actualRating) return;
        const { size, liveRating } = actualRating;

        // verify if we need to bloc rating change or not [staleOnClick]
        if (
          !staleOnClick ||
          (staleOnClick &&
            triggerRating.toFixed(2) === currentRating.toFixed(2))
        ) {
          setRating(liveRating);
          setSizeRating(size);

          // call onPointerMove function when pointer hover star bloc if define
          if (typeof onPointerMove === "function") {
            onPointerMove(liveRating, size, maxIcons);
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  // render only when container is found (preserves original behavior)
  if (!containerStars) return null;

  return (
    <div
      className={
        "container-star" +
        (transition ? " apply-stars-transition" : "") +
        (typeof className === "string" && className.length > 0
          ? " " + className
          : "")
      }
    >
      <div
        className="cs-child stars-bloc"
        role="button"
        title={
          typeof ratingTitle === "string" && ratingTitle.length > 0
            ? ratingTitle
            : `Cliquez pour attribuer une note sur ${maxIcons}`
        }
        aria-label={`Attribuer une note sur ${maxIcons}`}
      >
        {showTooltip ? (
          <OverlayTrigger placement="top" overlay={tooltip}>
            <span
              className="sb-layer sb-hover-layer"
              onMouseMove={hoverRating}
              onClick={saveRating}
              onMouseLeave={cancelRating}
            />
          </OverlayTrigger>
        ) : (
          <span
            className="sb-layer sb-hover-layer"
            onMouseMove={hoverRating}
            onClick={saveRating}
            onMouseLeave={cancelRating}
          />
        )}

        <span className="sb-layer sb-gray-layer" />
        <span
          className="sb-layer sb-gold-layer sb-layer-none"
          style={{ filter: filterToApply }}
        />
      </div>
    </div>
  );
};

export default StarGlide;
