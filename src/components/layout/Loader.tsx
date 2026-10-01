'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

const STATUS = [
  { at: 0, text: 'Setting up your practice room' },
  { at: 34, text: 'Checking your resume match' },
  { at: 67, text: 'Warming up your interviewer' },
  { at: 96, text: 'Ready when you are' },
]
/** Progress (0–100) at which each floating card pops in */
const CARD_AT = [22, 55, 85]

/**
 * Preloader in the site's own language: the hero's cream backdrop, grid and colour fields;
 * the MentorX logo rising in with a glass status pill (like the hero eyebrow) counting to 100;
 * the hero's white cards popping in as each step completes; then the cards drift apart and the
 * loader wipes up to reveal the hero underneath.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      if (prefersReducedMotion()) {
        gsap.set(el, { display: 'none' })
        onDone()
        return
      }

      const count = el.querySelector<HTMLElement>('.ld2__count')!
      const status = el.querySelector<HTMLElement>('.ld2__status')!
      const cards = gsap.utils.toArray<HTMLElement>('.ld2__card')
      const scoreNum = el.querySelector<HTMLElement>('.ld2__score b')!
      gsap.set(cards, { autoAlpha: 0, y: 30, scale: 0.85 })

      // ambient: colour fields drift slowly
      gsap.utils.toArray<HTMLElement>('.ld2__mesh span').forEach((b, i) =>
        gsap.to(b, {
          xPercent: i % 2 ? -12 : 12,
          yPercent: i % 2 ? 8 : -8,
          duration: 6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      )

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.ld2__logo', { yPercent: 110, duration: 1.1 }, 0.1)
        .from('.ld2__pill', { y: 20, autoAlpha: 0, scale: 0.9, duration: 0.9 }, 0.35)
        .from('.ld2__track', { scaleX: 0, duration: 0.9 }, 0.45)

      const progress = { v: 0 }
      let statusIdx = 0
      const shown = new Set<number>()
      tl.to(
        progress,
        {
          v: 100,
          duration: 2.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            const v = Math.round(progress.v)
            count.textContent = `${v}%`
            const next = STATUS.findLastIndex((st) => v >= st.at)
            if (next !== statusIdx) {
              statusIdx = next
              gsap.fromTo(status, { yPercent: 80, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out' })
              status.textContent = STATUS[next].text
            }
            CARD_AT.forEach((at, i) => {
              if (v >= at && !shown.has(i)) {
                shown.add(i)
                gsap.to(cards[i], { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' })
                if (i === 2) {
                  const s = { n: 0 }
                  gsap.to(s, {
                    n: 91,
                    duration: 0.9,
                    ease: 'power3.out',
                    onUpdate: () => {
                      scoreNum.textContent = String(Math.round(s.n))
                    },
                  })
                }
              }
            })
          },
        },
        0.4
      ).to('.ld2__fill', { scaleX: 1, duration: 2.6, ease: 'power2.inOut' }, 0.4)

      // Exit: cards drift outward, centre lifts, then the loader wipes up off the hero
      tl.addLabel('exit', 3.25)
        .to(cards, { y: -40, autoAlpha: 0, scale: 0.9, duration: 0.5, stagger: 0.05, ease: 'power3.in' }, 'exit')
        .to('.ld2__center', { y: -30, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, 'exit+=0.1')
        .add(() => onDone(), 'exit+=0.45')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, 'exit+=0.45')
        .set(el, { display: 'none' })
    },
    { scope: root }
  )

  return (
    <div className="ld2" ref={root} aria-hidden="true">
      <div className="ld2__mesh">
        <span />
        <span />
        <span />
      </div>
      <div className="ld2__grid" />

      <div className="ld2__center">
        <div className="ld2__logomask">
          <Image
            className="ld2__logo"
            src="/brand/mentorx-logo.png"
            alt=""
            width={949}
            height={240}
            priority
            style={{ width: 'auto' }}
          />
        </div>
        <div className="ld2__pill">
          <span className="ld2__dot" />
          <span className="ld2__statuswrap">
            <span className="ld2__status">{STATUS[0].text}</span>
          </span>
          <b className="ld2__count">0%</b>
        </div>
        <div className="ld2__track">
          <span className="ld2__fill" />
        </div>
      </div>

      {/* The hero's floating cards, popping in as each step completes */}
      <div className="ld2__card ld2__card--a">
        <span className="ld2__ring">84</span>
        <div>
          <p className="ld2__t">Resume match</p>
          <p className="ld2__m">7 keywords found</p>
        </div>
      </div>
      <div className="ld2__card ld2__card--b">
        <span className="ld2__icon">
          <Image src="/brand/mentorx-icon.png" alt="" width={64} height={64} />
        </span>
        <div>
          <p className="ld2__t">AI interviewer</p>
          <p className="ld2__m ld2__m--live">Ready to listen</p>
        </div>
      </div>
      <div className="ld2__card ld2__card--c ld2__score">
        <b>0</b>
        <div>
          <p className="ld2__t">Answer score</p>
          <p className="ld2__m">After every answer</p>
        </div>
      </div>
    </div>
  )
}
