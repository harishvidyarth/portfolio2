import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const ACTIVITIES_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2023',
    title: '2nd Dan Black Belt',
    subtitle: 'Shotokan Karate under Master D. Nirmal Kumar',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2024',
    title: 'WKF Judge B Certified',
    subtitle: 'World Karate Federation Approved Official',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2023',
    title: 'Guitar & Music',
    subtitle: 'Composition, Ear Training, Keys',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: '2024',
    title: 'Music Production',
    subtitle: 'Rhythm, Harmony, Improvisation',
    position: 'left',
  },
]