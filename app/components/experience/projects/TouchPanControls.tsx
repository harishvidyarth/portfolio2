import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

export const TouchPanControls = () => {
  const { camera } = useThree();
  const touchStartRef = useRef({ x: 0, y: 0 });
  const cameraRotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    cameraRotationRef.current = {
      x: camera.rotation.y,
      y: camera.rotation.x,
    };
    targetRotationRef.current = {
      x: camera.rotation.y,
      y: camera.rotation.x,
    };
  }, [camera]);

  useFrame(() => {
    if (!camera) return;
    const dampingFactor = 0.05;
    camera.rotation.y += (targetRotationRef.current.x - camera.rotation.y) * dampingFactor;
    camera.rotation.x += (targetRotationRef.current.y - camera.rotation.x) * dampingFactor;
    camera.updateProjectionMatrix();
  });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        cameraRotationRef.current = {
          x: targetRotationRef.current.x,
          y: targetRotationRef.current.y,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - touchStartRef.current.x;
      const deltaY = touchY - touchStartRef.current.y;

      const sensitivity = 0.005;

      const newRotationY = cameraRotationRef.current.x + deltaX * sensitivity;
      const maxRotationY = Math.PI / 3;
      targetRotationRef.current.x = Math.max(
        Math.min(newRotationY, maxRotationY),
        -maxRotationY
      );

      const newRotationX = cameraRotationRef.current.y - deltaY * sensitivity;
      const maxRotationX = Math.PI / 6;
      targetRotationRef.current.y = Math.max(
        Math.min(newRotationX, maxRotationX),
        -maxRotationX
      );
    };

    const handleTouchEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [camera, isDragging]);

  return null;
};
