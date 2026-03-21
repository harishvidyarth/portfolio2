import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2024',
    title: 'Rajalakshmi Engineering College',
    subtitle: 'B.E. CSE – Cyber Security, Chennai',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2025',
    title: 'SCI Q1 Publication',
    subtitle: 'Springer Nature – Graph Theory Research',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2025',
    title: 'Best Paper Award',
    subtitle: 'IC-CAMSTIA – Graph Invariants',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: '2025',
    title: 'SIH Runner-Up',
    subtitle: 'Smart India Hackathon 2025',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: '2nd Dan Black Belt',
    subtitle: 'WKF Judge B Certified',
    position: 'right',
  }
]