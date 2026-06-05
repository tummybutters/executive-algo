import { motion } from 'motion/react';

const webp = (stem) => `/hero/people-optimized-webp/${stem}.webp`;

export const trackedPeople = [
  { stem: 'jensen', name: 'Jensen Huang', role: 'NVIDIA' },
  { stem: 'sammy', name: 'Sam Altman', role: 'OpenAI' },
  { stem: 'dario_amodei', name: 'Dario Amodei', role: 'Anthropic' },
  { stem: 'satya', name: 'Satya Nadella', role: 'Microsoft' },
  { stem: 'elon_musk', name: 'Elon Musk', role: 'Tesla / xAI' },
  { stem: 'demmy', name: 'Demis Hassabis', role: 'DeepMind' },
  { stem: 'karp', name: 'Alex Karp', role: 'Palantir' },
  { stem: 'marc_andreessen', name: 'Marc Andreessen', role: 'a16z' },
  { stem: 'peter_thiel', name: 'Peter Thiel', role: 'Founders Fund' },
  { stem: 'ilya_sutskever', name: 'Ilya Sutskever', role: 'SSI' },
  { stem: 'michael_truell', name: 'Michael Truell', role: 'Cursor' },
  { stem: 'palmer_luckey', name: 'Palmer Luckey', role: 'Anduril' },
  { stem: 'aravind_srinivas', name: 'Aravind Srinivas', role: 'Perplexity' },
  { stem: 'brett_adcock', name: 'Brett Adcock', role: 'Figure' },
  { stem: 'zuckerberg', name: 'Mark Zuckerberg', role: 'Meta' },
  { stem: 'jamie_dimon', name: 'Jamie Dimon', role: 'JPMorgan' },
  { stem: 'ray_dalio', name: 'Ray Dalio', role: 'Bridgewater' },
  { stem: 'reid_hoffman', name: 'Reid Hoffman', role: 'LinkedIn' },
  { stem: 'mati_staniszewski', name: 'Mati Staniszewski', role: 'ElevenLabs' },
  { stem: 'braddy', name: 'Brian Armstrong', role: 'Coinbase' },
  { stem: 'tim_ellis', name: 'Tim Ellis', role: 'Relativity' },
  { stem: 'brian', name: 'Brian Chesky', role: 'Airbnb' },
  { stem: 'chamath_palihapitiya', name: 'Chamath Palihapitiya', role: 'Social Capital' },
  { stem: 'bill', name: 'Bill Gates', role: 'Gates Foundation' }
];

function Tile({ person }) {
  return (
    <figure className="op-tile">
      <div className="op-tile-img">
        <img
          src={webp(person.stem)}
          alt={`${person.name}, ${person.role}, a leader tracked by The Conviction Index`}
          loading="lazy"
          decoding="async"
          width="720"
          height="540"
        />
      </div>
      <figcaption className="op-tile-cap">
        <span className="op-tile-name">{person.name}</span>
        <span className="op-tile-role">{person.role}</span>
      </figcaption>
    </figure>
  );
}

export default function HeroPortraitBand({ prefersReducedMotion }) {
  const loop = [...trackedPeople, ...trackedPeople];

  return (
    <div className="op-band" aria-hidden="true">
      <div className={`op-track${prefersReducedMotion ? ' is-static' : ''}`}>
        {loop.map((person, index) => (
          <Tile key={`${person.stem}-${index}`} person={person} />
        ))}
      </div>
    </div>
  );
}
