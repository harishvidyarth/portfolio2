import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const KARATE_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(-3, 0, 0),
    year: '2023',
    title: '2nd Dan Black Belt',
    subtitle: 'Shotokan Karate',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-6, -3, -2),
    year: '2024',
    title: 'WKF Judge B',
    subtitle: 'World Karate Federation',
    position: 'left',
  },
];

export const MUSIC_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(3, 0, 0),
    year: '2023',
    title: 'Guitar & Music',
    subtitle: 'Keys, Composition',
    position: 'right',
  },
  {
    point: new THREE.Vector3(6, -3, -2),
    year: '2024',
    title: 'Band Culturals',
    subtitle: 'Stage Performer',
    position: 'right',
  },
];

export const ACTIVITIES_TIMELINE = [...KARATE_TIMELINE, ...MUSIC_TIMELINE];