"use client";

/**
 * HERO — rebuilt 2026-10-01, on request, from new footage ("First clip.mp4" +
 * "Second clip.mp4", supplied directly), after the previous hero was removed
 * entirely on 2026-09-23 (see page.tsx's own history note).
 *
 * A REAL <video>, NOT A FRAME SEQUENCE (2026-10-01, on request — "I want
 * smooth output"): this first shipped as WebP frame sequences — frames-v7
 * (578 frames, 1280px/q75, 39MB) then frames-v8 (289 frames, 1024px/q55,
 * 9.6MB) — with an <img> whose `src` was swapped from a rAF loop. Even v8
 * still hitched: every swap is a main-thread image decode, and the whole
 * sequence had to download before playback could start. Now both clips are
 * joined into one H.264 MP4 (public/video/hero.mp4, 1920×1080, 60fps,
 * CRF 26, 4.9MB, +faststart), which the browser's hardware decoder plays on
 * its own compositor clock — no per-frame JS at all. Encoded from the source
 * MP4s with ffmpeg:
 *
 *   ffmpeg -i "First clip.mp4" -i "Second clip.mp4" -filter_complex \
 *     "[0:v]setpts=PTS-STARTPTS[a];[1:v]trim=end_frame=312,setpts=PTS-STARTPTS[b];
 *      [a][b]concat=n=2:v=1:a=0,setpts=PTS*24/110,fps=60,
 *      scale=1920:1080:flags=lanczos,format=yuv420p[v]" \
 *     -map "[v]" -an -c:v libx264 -preset slow -crf 26 -profile:v high \
 *     -level 4.2 -movflags +faststart hero.mp4
 *
 * `trim=end_frame=312` drops clip 2's final frame (the held TNT-logo card —
 * see AUTO-SCROLL below); `setpts=PTS*24/110` bakes in the playback speed
 * (see PLAYBACK SPEED below). hero-poster.webp is the video's first frame.
 *
 * FULLY AUTOMATED, NOT SCROLL-DRIVEN (on request — "I don't want have user
 * interaction while playing. Every thing automated from first frame to last
 * frame. User can experience only one time. After that they need to reload
 * the site to experience it again"): no scroll interaction of any kind — the
 * section is a normal single-viewport-height block. The video is muted +
 * playsInline (what every browser requires for autoplay), plays once (no
 * `loop`), and starts on `canplaythrough` so it doesn't stall partway. A
 * reload plays it again from the start; there is no replay affordance.
 *
 * AUTOPLAY BLOCKED → FRAME-SEQUENCE FALLBACK (2026-10-01, on request —
 * "There is no movement on Hero section Video!" / "It stays in first frame"):
 * Safari in macOS/iOS Low Power Mode refuses autoplay even for muted
 * video, and the first video version also waited on `canplaythrough`, which
 * Safari may never fire when it isn't allowed to preload — so the poster
 * just sat there. Now `play()` is called directly (it starts the load on its
 * own), and if it rejects, the hero falls back to the previous WebP frame
 * sequence (public/video/frames-v8: 289 frames, 1024px/q55, 9.6MB, stepped
 * at 55fps by a rAF loop swapping an <img> over the poster). A JS-driven
 * image swap isn't subject to autoplay policy, so that path always moves.
 * The frames are only fetched on that fallback path — browsers that play the
 * video never download them. Both paths end in the same auto-scroll +
 * collapse.
 *
 * REDUCED MOTION: under `prefers-reduced-motion` neither path runs — the
 * poster stays up as a static hero and nothing auto-scrolls.
 *
 * FULL-BLEED UNDER THE FIXED NAV (2026-10-01, on request — "I can see dark
 * space on the top of this video clip"): this first shipped sitting inside
 * <main>'s normal `pt-[var(--chrome-h)]` nav clearance, which read as a
 * solid dark band above the footage instead of video running the full
 * height of the viewport. Reverted to the pre-removal placement instead —
 * page.tsx's wrapper cancels that padding (`-mt-[var(--chrome-h)] bg-black`)
 * so this section starts at true y=0, with `.glass-nav`'s own translucent,
 * backdrop-blurred fixed bar (SiteNav.tsx) floating over it exactly as it
 * did before. `h-screen` here (not the shorter mobile-specific height this
 * used at first) matches that full-bleed placement.
 *
 * PLAYBACK SPEED (2026-10-01, on request, across five rounds — "increase
 * the speed of this video" → … → "I want full speed on both clip"): both
 * clips ended up at 110fps from 24fps footage, i.e. ~4.58× real time,
 * ~5.25s total. That speed is now baked into hero.mp4 itself
 * (`setpts=PTS*24/110`), so the element plays at a normal playbackRate of
 * 1. Changing it, or splitting it per clip again, means re-encoding — e.g.
 * a separate `setpts` on each of [a]/[b] before the concat.
 *
 * AUTO-SCROLL ON COMPLETION, SKIPPING THE TRUE LAST FRAME (2026-10-01, on
 * request — "auto scroll up to nav bar visible. User no need to see last
 * frame of second clip"): the held TNT-logo card is cut out of hero.mp4 at
 * encode time (`trim=end_frame=312`), and the video's `ended` event fires
 * `scrollToFamilyStrip()` immediately rather than holding on the last
 * frame.
 *
 * LANDING SPOT, BACK AND FORTH (2026-10-01, same day, three requests in a
 * row): first landed on #family (FamilyStripV2, the logo strip right under
 * the hero) — the same spot the OLD hero's useHeroAutoScroll.ts used. Then
 * moved to #statement ("About Us"), on request ("just scroll to about us
 * section, no need to stop there [at Family]") — landing on the short
 * Family strip read as the scroll stalling partway rather than going
 * anywhere. Then moved BACK to #family, on request ("can we stop the auto
 * scroll on TNT Family of company section?") — so #family is the landing
 * spot again, same as the very first version; the intervening #statement
 * target was not kept. SiteNav.tsx's own reveal check also watches
 * #family's position directly, so landing there is the simplest case for
 * the nav to reveal correctly — no "is the next section far enough past
 * #family" reasoning needed the way the #statement version required.
 *
 * Driven by `getLenis()` (SmoothScroll.tsx) — the same "drive the scroll
 * programmatically" escape hatch useHeroAutoScroll.ts used — falling back
 * to a plain `window.scrollTo` under reduced motion / before Lenis has
 * booted.
 *
 * HERO COLLAPSES AFTER LANDING (2026-10-01, on request — "remove the scroll
 * back to hero section final frame... automatically stop at TNT Crane family
 * of companies section"): replaces the earlier scroll-listener WALL, which
 * clamped scrollY back up after the fact. That version had two holes: it only
 * armed from Lenis's `onComplete`, so a wheel/touch during the 1.2s
 * auto-scroll (which interrupts it) left it permanently unarmed; and the
 * "Home" nav link (/#top) still scrolled straight back onto the frozen last
 * frame. Clamping after each scroll event could also flash a sliver of the
 * hero before snapping back.
 *
 * Now, once the post-playback scroll lands (or COLLAPSE_FALLBACK_MS passes,
 * covering the interrupted case), the section shrinks to a black spacer of
 * exactly LANDING_OFFSET px and, in the same layout pass, scrollY is shifted
 * up by the height that was removed — so the view doesn't move at all. The
 * top of the document IS the landing spot from then on: scrolling up just
 * stops there with nothing to bounce off, and /#top lands there too. The
 * spacer keeps #family's top at the same LANDING_OFFSET from the viewport
 * top as the auto-scroll left it (tucked `LANDING_MARGIN` under the bar,
 * past SiteNav.tsx's REVEAL_AT line), so the nav stays revealed. A reload
 * restores the full hero and plays it again, per the one-time-playback spec.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getLenis } from "@/components/SmoothScroll";
import { CHROME_H } from "@/components/site/chrome";

const VIDEO_SRC = "/video/hero.mp4";
const POSTER_SRC = "/video/hero-poster.webp";

/** Fallback frame sequence — see AUTOPLAY BLOCKED above. Every other frame
 *  of the original 110fps sequence, so 55fps gives the same speed and
 *  duration (~5.25s) as hero.mp4. */
const FRAME_DIR = "/video/frames-v8";
const FRAME_COUNT = 289;
const FRAME_FPS = 55;
const FRAME_DURATION = 1000 / FRAME_FPS;
const FRAMES_TOTAL_MS = FRAME_COUNT * FRAME_DURATION;
const framePath = (n: number) => `${FRAME_DIR}/${String(n).padStart(5, "0")}.webp`;

/** How far #family's top sits under the bar's bottom edge on landing —
 *  comfortably past the nav's reveal line, not balanced on it. */
const LANDING_MARGIN = 24;
/** #family's top, in viewport px, once landed — also the collapsed spacer's
 *  height, so the post-collapse scrollY 0 is the same view. */
const LANDING_OFFSET = CHROME_H - LANDING_MARGIN;
/** Collapse even if the auto-scroll never reports completion (a wheel/touch
 *  mid-flight interrupts it). Comfortably past its 1.2s duration. */
const COLLAPSE_FALLBACK_MS = 1600;

/** Scrolls to #family (the Family-of-companies logo strip) — see the
 *  LANDING SPOT note above for the back-and-forth that settled here. Lenis
 *  when it's booted (the ordinary case); a plain smooth window.scrollTo as
 *  the fallback (whose completion is approximated with a timeout — no
 *  cross-browser-reliable completion event for native smooth scroll). */
function scrollToFamilyStrip(onComplete: () => void) {
  const family = document.getElementById("family");
  if (!family) return;
  const target = window.scrollY + family.getBoundingClientRect().top - LANDING_OFFSET;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, onComplete });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
    window.setTimeout(onComplete, 700);
  }
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // "video" until play() is refused, then "frames" — see AUTOPLAY BLOCKED.
  const [mode, setMode] = useState<"video" | "frames">("video");
  // Frame fallback only: true once every frame has preloaded.
  const [framesReady, setFramesReady] = useState(false);
  // HERO COLLAPSES AFTER LANDING — see that docblock note above.
  // `removedRef` is the height the collapse takes out, measured just before
  // it, so the layout effect below can shift scrollY by exactly that much.
  const [collapsed, setCollapsed] = useState(false);
  const removedRef = useRef(0);
  const finishedRef = useRef(false);
  const fallbackTimerRef = useRef<number | undefined>(undefined);

  // Shared ending for both paths: auto-scroll to #family, then collapse
  // (or collapse after COLLAPSE_FALLBACK_MS if that scroll is interrupted).
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    let done = false;
    const collapse = () => {
      if (done) return;
      done = true;
      window.clearTimeout(fallbackTimerRef.current);
      removedRef.current = (sectionRef.current?.offsetHeight ?? 0) - LANDING_OFFSET;
      setCollapsed(true);
    };
    scrollToFamilyStrip(collapse);
    fallbackTimerRef.current = window.setTimeout(collapse, COLLAPSE_FALLBACK_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(fallbackTimerRef.current), []);

  // Video path. play() is called straight away rather than waiting for
  // `canplaythrough` (Safari may not preload enough to fire it); a rejection
  // means autoplay was refused, so hand over to the frame sequence.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const onEnded = () => finish();
    video.addEventListener("ended", onEnded);
    video.muted = true; // property, not just the attribute — some engines check only this
    video.play().catch(() => {
      if (!cancelled) setMode("frames");
    });
    return () => {
      cancelled = true;
      video.removeEventListener("ended", onEnded);
    };
  }, [finish]);

  // Frame fallback, step 1: preload every frame before playback starts — a
  // mid-sequence stutter waiting on a late frame would be worse than a
  // longer, one-time wait up front.
  useEffect(() => {
    if (mode !== "frames") return;
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let settled = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const done = () => {
        if (cancelled) return;
        settled += 1;
        if (settled === FRAME_COUNT) setFramesReady(true);
      };
      img.onload = done;
      img.onerror = done; // a missing frame must not deadlock the preload
      img.src = framePath(i);
      images[i] = img;
    }
    return () => {
      cancelled = true;
      for (const img of images) {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      }
    };
  }, [mode]);

  // Frame fallback, step 2: the one-time playback. Elapsed-time driven, so a
  // dropped rAF tick shows a later frame next time rather than falling
  // behind permanently.
  useEffect(() => {
    if (!framesReady) return;
    let startTime: number | null = null;
    let rafId: number;
    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const index = Math.min(Math.floor(elapsed / FRAME_DURATION), FRAME_COUNT - 1);
      if (imgRef.current) imgRef.current.src = framePath(index);
      if (elapsed < FRAMES_TOTAL_MS) {
        rafId = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [framesReady, finish]);

  // The collapse's scroll compensation. Runs before paint, so the shorter
  // section and the shifted scrollY land in the same frame — no visible jump.
  // If the visitor had scrolled back up into the hero mid-flight, this clamps
  // to 0, which is the landing view anyway.
  useLayoutEffect(() => {
    if (!collapsed) return;
    const top = Math.max(0, window.scrollY - removedRef.current);
    const lenis = getLenis();
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(top, { immediate: true, force: true });
    } else {
      window.scrollTo({ top });
    }
  }, [collapsed]);

  if (collapsed) {
    return <section ref={sectionRef} className="bg-black" style={{ height: LANDING_OFFSET }} />;
  }

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[600px] overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-label="TNT Crane & Rigging"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {mode === "frames" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={framePath(0)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </section>
  );
}
