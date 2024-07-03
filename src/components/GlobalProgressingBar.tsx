import { useCallback, useEffect, useRef, useState } from 'react';
import 'media/css/globalProgressBar.scss';
/**
 * Jamviet.com
 * Global Progressbar Component
 * All work like Middleware so do not worry about anything
 */

export default function GlobalProgressingBar({ show }: { show: boolean }) {
  const [internalShow, setInternalShow] = useState(false);
  const tikTime = useRef<any>(null);
  const total_call_show = useRef<any[]>([]);

  const showInSpecialTime = useCallback(() => {
    if (total_call_show.current.length < 1) {
      setTimeout(() => {
        setInternalShow(false);
      }, 1000);
    } else {
      setInternalShow(true);
      if (tikTime.current) clearTimeout(tikTime.current);
      tikTime.current = setTimeout(() => {
        setInternalShow(false);
        total_call_show.current.shift();
      }, 10000);
    }
  }, [tikTime, total_call_show]);

  useEffect(() => {
    if (show === true) {
      total_call_show.current.push(Math.random());
    } else {
      total_call_show.current.shift();
    }
    showInSpecialTime();
  }, [show, total_call_show]);

  return (
    internalShow && (
      <div className="linear-progress">
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
      </div>
    )
  );
}
