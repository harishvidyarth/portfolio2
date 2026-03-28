import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2010',
    title: 'Velammal Vidyalaya',
    subtitle: 'Primary Education',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1.5, -3, -2),
    year: '2022',
    title: '10th Board',
    subtitle: 'Score: 89.9%',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-3, -6, -4),
    year: '2024',
    title: '12th Board',
    subtitle: 'Score: 94.2%',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-4.5, -9, -6),
    year: '2024',
    title: 'Rajalakshmi Engineering College',
    subtitle: 'B.E. CSE – Cyber Security',
    position: 'left',
  },
]