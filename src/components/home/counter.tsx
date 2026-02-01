'use client';

import { useEffect, useState, useRef } from 'react';

interface CounterProps {
  target: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function Counter({ target, duration = 2000, className, suffix, prefix }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    if (start === end) return;

    const totalFrames = Math.round(duration / (1000 / 60));
    const increment = (end - start) / totalFrames;

    let currentFrame = 0;
    const timer = setInterval(() => {
      currentFrame++;
      const newCount = Math.round(start + increment * currentFrame);
      setCount(newCount);

      if (currentFrame === totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
