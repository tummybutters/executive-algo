import { useReducedMotion } from 'motion/react';
import {
  GravityHeroSection,
  MemoSection,
  ValueSection,
  SlopSection,
  MomentumSection,
  PeopleSection,
  LeisureSection
} from '../sections/home/index.js';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main>
      <GravityHeroSection prefersReducedMotion={prefersReducedMotion} />
      <MemoSection prefersReducedMotion={prefersReducedMotion} />
      <ValueSection prefersReducedMotion={prefersReducedMotion} />
      <SlopSection prefersReducedMotion={prefersReducedMotion} />
      <MomentumSection prefersReducedMotion={prefersReducedMotion} />
      <PeopleSection prefersReducedMotion={prefersReducedMotion} />
      <LeisureSection prefersReducedMotion={prefersReducedMotion} />
    </main>
  );
}
