import React, { useEffect, useRef, useState } from "react";

const GRAVITY = 0.2;
const FRICTION = 0.98;
const BALL_RADIUS = 10;
const HEXAGON_RADIUS = 100;
const ROTATION_SPEED = 0.02;

const BouncingBall = () => {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;

    let ball = { x: 200, y: 200, vx: 2, vy: 2 };
    let rotation = 0;

    const getHexagonPoints = (cx, cy, radius, angle) => {
      return Array.from({ length: 6 }, (_, i) => {
        const a = angle + (i * Math.PI) / 3;
        return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
      });
    };

    const isInsideHexagon = (x, y, hexagon) => {
      let inside = false;
      for (let i = 0, j = hexagon.length - 1; i < hexagon.length; j = i++) {
        const xi = hexagon[i].x,
          yi = hexagon[i].y;
        const xj = hexagon[j].x,
          yj = hexagon[j].y;
        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += ROTATION_SPEED;
      setAngle(rotation);

      ball.vy += GRAVITY;
      ball.vx *= FRICTION;
      ball.vy *= FRICTION;
      ball.x += ball.vx;
      ball.y += ball.vy;

      const hexagon = getHexagonPoints(200, 200, HEXAGON_RADIUS, rotation);
      if (!isInsideHexagon(ball.x, ball.y, hexagon)) {
        ball.vx = -ball.vx;
        ball.vy = -ball.vy;
      }

      ctx.beginPath();
      hexagon.forEach(({ x, y }, i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.stroke();

      requestAnimationFrame(update);
    };

    update();
  }, []);

  return <canvas ref={canvasRef} style={{ background: "#eee" }} />;
};

export default BouncingBall;
