import React, { useEffect, useState, useRef } from 'react';
import CouponComponent from './Coupon';
import Confetti from "react-confetti";

const Wheel = () => {
  // Define the default values inside the component
  const segments = ['Coupon 10%', 'Coupon 20%', 'Coupon 30%', 'Coupon 40%', 'Coupon 50%'];
  const segColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700'];
  const primaryColor = 'black';
  const contrastColor = '#34D399';
  const buttonText = 'Spin';
  const isOnlyOnce = false; // Allow multiple spins
  const size = window.innerWidth / 5;  // Adjusted to make the wheel smaller
  const upDuration = 100; // Reduced for shorter spin
  const downDuration = 800; // Reduced for shorter spin
  const fontFamily = 'proxima-nova';
  const fontSize = '1em';
  const outlineWidth = 10;

  const randomString = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    const length = 8;
    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  };

  const canvasId = useRef(`canvas-${randomString()}`);
  const wheelId = useRef(`wheel-${randomString()}`);
  const dimension = (size + 20) * 2;
  let currentSegment = '';
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  const [result, setResult] = useState('');
  const [isSpinning, setIsSpinning] = useState(false); // Track if the wheel is spinning
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext = null;
  let maxSpeed = Math.PI / segments.length;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = size + 20;
  const centerY = size + 20;

  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById(canvasId.current);
    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', `${dimension}`);
      canvas.setAttribute('height', `${dimension}`);
      canvas.setAttribute('id', canvasId.current);
      document.getElementById(wheelId.current).appendChild(canvas);
    }
    canvas.addEventListener('click', spin, false);
    canvasContext = canvas.getContext('2d');
  };

  const spin = () => {
    if (isSpinning) return; // Prevent spinning while already spinning
    setIsSpinning(true); // Set the spinning state
    setFinished(false);  // Reset finished state when spinning again
    setResult('');  // Clear the previous result
    // Reset spin variables before starting
    angleCurrent = 0;
    angleDelta = 0;
    frames = 0;

    if (timerHandle !== 0) {
      clearInterval(timerHandle); // Clear the previous interval
    }

    // Randomize the winning segment each time the wheel spins
    const randomIndex = Math.floor(Math.random() * segments.length);
    currentSegment = segments[randomIndex];
    
    // Start the new spin
    spinStart = new Date().getTime();
    maxSpeed = Math.PI / segments.length;
    timerHandle = window.setInterval(onTimerTick, timerDelay);
  };

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      setResult(currentSegment);  // Set the winning segment
      clearInterval(timerHandle); // Stop the timer when the spin finishes
      timerHandle = 0;
      angleDelta = 0;
      setIsSpinning(false); // Reset spinning state
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key, lastAngle, angle) => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = 'black';
    ctx.font = `bold ${fontSize} ${fontFamily}`;
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1em ' + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor;
    ctx.fill();
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.fillStyle = contrastColor;
    ctx.textAlign = 'center';
    ctx.fillText(buttonText, centerX, centerY + 3);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };

  const drawNeedle = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fillStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 1.5em ' + fontFamily;
    currentSegment = segments[i];
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  const clear = () => {
    if (!canvasContext) {
      return false;
    }
    const ctx = canvasContext;
    ctx.clearRect(0, 0, dimension, dimension);
  };
    // Use regex to extract the discount number
  const match = result.match(/\d+/); // This matches one or more digits
  const discountNumber = match ? parseInt(match[0], 10) : null;
  const now = new Date();
  const expirationDate = new Date(now.setDate(now.getDate() - 60)).toISOString().split('T')[0]; // Get date 60 days ago in 'YYYY-MM-DD' format
  return (
    <>
    {isFinished && (<Confetti
    width={window.innerWidth}
    height={window.innerHeight}
    gravity={0.1}
    style={{ zIndex: 99 }}
    numberOfPieces={700}
    recycle={false}
    />)}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        {/* Wheel on the left */}
        <div id={wheelId.current}>
            <canvas
            id={canvasId.current}
            width={dimension}
            height={dimension}
            style={{
                pointerEvents: isSpinning && !isOnlyOnce ? 'none' : 'auto', // Prevent clicks while spinning
            }}
            />
        </div>

        {/* Coupon component on the right */}
        <div>
            <CouponComponent isDataChanged={isFinished} couponData={{ discount: discountNumber, expiration_date: expirationDate }} />
        </div>
    </div>
    </>

  );
};

export default Wheel;
