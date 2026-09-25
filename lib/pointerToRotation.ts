const MAX_ROTATION = 0.4; // radians, subtle tilt not a full spin

export function pointerToRotation(
  pointerX: number,
  pointerY: number,
  width: number,
  height: number
): { x: number; y: number } {
  const normX = (pointerX / width) * 2 - 1; // -1..1
  const normY = (pointerY / height) * 2 - 1; // -1..1
  return {
    x: normY * MAX_ROTATION,
    y: normX * MAX_ROTATION,
  };
}
