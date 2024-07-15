import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, Power1, Power4 } from 'gsap'; // Import necessary GSAP components
import { BlockStack, Text, Image, Page } from '@shopify/polaris';
import { Helmet } from 'react-helmet-async';
import './lucky_wheel/lucky_wheel.scss';

export default function LuckyWheel() {
  const wheelRef = useRef(null);
  const activeRef = useRef(null);
  const [lastRotation, setLastRotation] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [indicatorTimeline, setIndicatorTimeline] = useState(null);
  const [spinWheelTimeline, setSpinWheelTimeline] = useState(null);

  // Random degree
  const getRandomInt = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  // Calculate the closest sector
  const calculateIntersectingSector = () => {
    const active = document.getElementById('caculator_result');
    const sectors = document.querySelectorAll('.sectors path');

    let intersectingSector = null;

    const activeBBox = active.getBoundingClientRect();

    sectors.forEach((sector) => {
      const sectorBBox = sector.getBoundingClientRect();

      if (
        activeBBox.left < sectorBBox.right &&
        activeBBox.right > sectorBBox.left &&
        activeBBox.top < sectorBBox.bottom &&
        activeBBox.bottom > sectorBBox.top
      ) {
        intersectingSector = sector;
      }
    });

    if (intersectingSector) {
      console.log('Intersecting sector ID:', intersectingSector.id);
    }
  };

  // Create the timelines
  let startAnimation = useCallback(() => {
    const wheel = wheelRef.current;
    const active = activeRef.current;
    const indicator = gsap.timeline();
    const spinWheel = gsap.timeline();

    const deg = getRandomInt(360, 2080);
    // Setup animations
    indicator
      .to(active, { duration: 0.13, rotation: -10, transformOrigin: '65% 36%', ease: Power1.easeOut })
      .to(active, { duration: 0.13, rotation: 3, ease: Power4.easeOut })
      .add('end');

    // Initialize wheel rotation using gsap.set
    gsap.set(wheel, { rotation: 0 });

    spinWheel
      .to(wheel, {
        duration: 8,
        rotation: deg,
        transformOrigin: '50% 50%',
        ease: Power4.easeOut,
        onUpdate: () => {
          const rotation = gsap.getProperty(wheel, 'rotation') || 0; // Access rotation using gsap.getProperty with fallback to 0
          setCurrentRotation(Number(rotation));

          const tolerance = currentRotation - lastRotation;

          // console.log('lastRot: ' + lastRotation);
          // console.log('currentRot: ' + rotation);
          // console.log('tol: ' + tolerance);
          // console.log(indicator.progress());
          // console.log('spinwheelprogress: ' + spinWheel.progress());

          if (Math.round(Number(rotation)) % (360 / 12) <= tolerance) {
            if (indicator.progress() > 0.2 || indicator.progress() === 0) {
              indicator.play(0);
            }
          }
          setLastRotation(Number(rotation));
        },
        onComplete: () => {
          console.log('ENDDDDDD ======>');
          // Calculate closest sector
          calculateIntersectingSector();
        },
      })
      .add('end');
    setIndicatorTimeline(indicator);
    setSpinWheelTimeline(spinWheel);
  }, [currentRotation, getRandomInt, lastRotation]);

  const killAll = useCallback(() => {
    indicatorTimeline?.kill();
    spinWheelTimeline?.kill();
  }, [indicatorTimeline, spinWheelTimeline]);

  useEffect(() => {
    startAnimation();
    // Cleanup function
    return () => {
      killAll();
    };
  }, []);

  // Button handlers
  const handlePlay = () => {
    if (indicatorTimeline && spinWheelTimeline) {
      startAnimation();
    }
  };

  return (
    <Page>
      <Helmet>
        <title>Chiếc nón kỳ diệu</title>
      </Helmet>
      <BlockStack>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 730 730">
          <g className="wheel" ref={wheelRef}>
            <circle className="frame" cx="365" cy="365" r="347.6" />
            <g className="sticks">
              <rect x="360.4" width="9.3" height="24.33" rx="4" ry="4" />
              <rect x="352.8" y="713.2" width="24.3" height="9.27" rx="4" ry="4" transform="translate(1082.8 352.8) rotate(90)" />
              <rect x="176.4" y="54.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(145.8 -133.6) rotate(60)" />
              <rect x="529.2" y="665.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(851.4 -133.6) rotate(60)" />
              <rect x="47.3" y="183.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(102.3 -4.5) rotate(30)" />
              <rect x="658.4" y="536.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(360.5 -262.7) rotate(30)" />
              <rect y="360.4" width="24.3" height="9.27" rx="4" ry="4" />
              <rect x="705.7" y="360.4" width="24.3" height="9.27" rx="4" ry="4" />
              <rect x="47.3" y="536.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-262.7 102.3) rotate(-30)" />
              <rect x="658.4" y="183.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-4.5 360.5) rotate(-30)" />
              <rect x="176.4" y="665.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-486.4 498.6) rotate(-60)" />
              <rect x="529.2" y="54.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(219.2 498.6) rotate(-60)" />
            </g>
            <g className="sectors">
              <path id="_1" d="M365,365V35.9A328.1,328.1,0,0,0,200.5,80Z" transform="translate(0)" />
              <path id="_2" d="M365,365,529.5,80A328.1,328.1,0,0,0,365,35.9Z" transform="translate(0)" />
              <path id="_3" d="M365,365,650,200.5A328.5,328.5,0,0,0,529.5,80Z" transform="translate(0)" />
              <path id="_4" d="M365,365H694.1A328.1,328.1,0,0,0,650,200.5Z" transform="translate(0)" />
              <path id="_5" d="M365,365,650,529.5A328.1,328.1,0,0,0,694.1,365Z" transform="translate(0)" />
              <path id="_6" d="M365,365,529.5,650A328.5,328.5,0,0,0,650,529.5Z" transform="translate(0)" />
              <path id="_7" d="M365,365V694.1A328.1,328.1,0,0,0,529.5,650Z" transform="translate(0)" />
              <path id="_8" d="M365,365,200.5,650A328.1,328.1,0,0,0,365,694.1Z" transform="translate(0)" />
              <path id="_9" d="M365,365,80,529.5A328.5,328.5,0,0,0,200.5,650Z" transform="translate(0)" />
              <path id="_10" d="M365,365H35.9A328.1,328.1,0,0,0,80,529.5Z" transform="translate(0)" />
              <path id="_11" d="M365,365,80,200.5A328.1,328.1,0,0,0,35.9,365Z" transform="translate(0)" />
              <path id="_12" d="M365,365,200.5,80A328.5,328.5,0,0,0,80,200.5Z" transform="translate(0)" />

              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_28"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) matrix(0.227884, -0.973688, 0.973688, 0.227884, 81.8096, 563.167)"
                x="362.96"
                y="241.63"
              >
                Sector _2
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_29"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) matrix(0.694696, -0.719303, 0.719303, 0.694696, -64.5704, 409.459)"
                x="440.16"
                y="288.62"
              >
                Sector _3
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_30"
                textAnchor="start"
                transform="matrix(0.960275, -0.279056, 0.279056, 0.960275, -74.2254, 145.093)"
                x="469.06"
                y="342.33"
              >
                Sector _4
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_31"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) matrix(0.972388, 0.233372, -0.233372, 0.972388, 105.566, -105.711)"
                x="470.41"
                y="400.01"
              >
                Sector _5
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_32"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) matrix(0.685049, 0.728498, -0.728498, 0.685049, 476.789, -210.459)"
                x="447.72"
                y="478.83"
              >
                Sector _6
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_33"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) rotate(31.6262, 413.643, 550.994) matrix(0.685049, 0.728498, -0.728498, 0.685049, 476.789, -210.459)"
                x="420.26"
                y="575.18"
              >
                Sector _7
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_34"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) matrix(-0.28314, 0.959079, -0.959079, -0.28314, 1113.92, 359.05)"
                x="321.41"
                y="715.47"
              >
                Sector _8
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_35"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) rotate(27.4076, 231.5, 505.25) matrix(-0.28314, 0.959079, -0.959079, -0.28314, 1113.92, 359.05)"
                x="300.07"
                y="812.91"
              >
                Sector _9
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_36"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) matrix(-0.960812, 0.277202, -0.277202, -0.960812, 728.174, 1185.17)"
                x="224.18"
                y="894.76"
              >
                Sector _10
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_37"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) rotate(29.8116, 179.5, 322.25) matrix(-0.960812, 0.277202, -0.277202, -0.960812, 728.174, 1185.17)"
                x="197.98"
                y="989.2"
              >
                Sector _11
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_38"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) rotate(59.5709, 222.5, 225.25) matrix(-0.960812, 0.277202, -0.277202, -0.960812, 728.174, 1185.17)"
                x="129.77"
                y="1070.48"
              >
                Sector _12 tuyệt vời
              </text>
              <text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                id="svg_39"
                textAnchor="start"
                transform="matrix(1, 0, 0, 1, 0, 0) rotate(-104.744, 336, 263)"
                x="336"
                y="271"
              >
                Sector _1
              </text>
            </g>
            <g className="middle">
              <g id="shadow-1" opacity="0.2">
                <circle cx="368.5" cy="368.5" r="54.5" />
              </g>
              <g className="wheelMiddle">
                <circle cx="365" cy="365" r="54.5" fill="#fff" />
              </g>
              <circle id="middle-3" cx="365" cy="365" r="11.6" fill="#ccc" />
            </g>
          </g>
          <g id="shadow-2" opacity="0.15">
            <path
              d="M46.9,372.5c0-181.7,147.4-329,329.1-329A327.3,327.3,0,0,1,556.3,97.2,327.3,327.3,0,0,0,365,35.9C183.3,35.9,35.9,183.3,35.9,365c0,115.2,59.2,216.5,148.8,275.3C101.3,580.6,46.9,482.9,46.9,372.5Z"
              transform="translate(0)"
            />
          </g>
          <g className="active" ref={activeRef}>
            <g>
              <path
                d="M707,160.5c-11.4-17.9-35.8-22.8-54.5-11a41.7,41.7,0,0,0-13.6,14.1l-33.6,58.9a2.3,2.3,0,0,0,0,2.4,2.4,2.4,0,0,0,2.3,1.1l67.5-5.1a43.8,43.8,0,0,0,18.6-6.3C712.4,202.7,718.3,178.5,707,160.5Z"
                transform="translate(0)"
                fillOpacity="0.22"
              />
              <path
                className="winIndicator"
                d="M711.9,157.4a38.4,38.4,0,0,0-66,1.8l-31.5,57.5a2.1,2.1,0,0,0,0,2.4,2.6,2.6,0,0,0,2.2,1.2l65.6-3.9a39.6,39.6,0,0,0,17.9-5.9A38.5,38.5,0,0,0,711.9,157.4Z"
                transform="translate(0)"
              />
              <path
                d="M681.7,166.9a9.3,9.3,0,0,0-6.6,4.8l-.8,2.1a14.9,14.9,0,0,0-.2,2.1,8.8,8.8,0,0,0,1.1,4.2,9.2,9.2,0,0,0,2.9,3,7.6,7.6,0,0,0,2.9,1.3l1.1.2a8.6,8.6,0,0,0,4.2-.6,8.4,8.4,0,0,0,3.4-2.5,7.4,7.4,0,0,0,2-3.8,8.5,8.5,0,0,0-.1-4.2,8.4,8.4,0,0,0-2.1-3.8,7.4,7.4,0,0,0-3.5-2.3l-1-.3A12.2,12.2,0,0,0,681.7,166.9Z"
                transform="translate(0)"
                fill="#ccc"
              />
              <path d="m666,190l-7,4l7,-4z" fill="null" id="caculator_result" stroke="null" />
            </g>
          </g>
        </svg>

        <button id="btnPlay" onClick={handlePlay}>
          Play
        </button>
      </BlockStack>
    </Page>
  );
}
