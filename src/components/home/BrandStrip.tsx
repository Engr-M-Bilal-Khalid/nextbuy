import { BrandStripMobile } from "./BrandCarousel";

function BrandStripDesktop() {
  return (
    <div className="hidden sm:flex w-full justify-around items-start font-bold lg:text-[2em] md:text-[1.5em]  text-gray-900 bg-gray-50 py-8 tracking-wider">
      <div className="  font-bold  tracking-wide uppercase versace shine-text">ZERO</div>
      <div className="  font-bold  tracking-widest uppercase zara shine-text">RONIN</div>
      <div className="   tracking-widest uppercase gucci shine-text">AUDIONIC</div>
      <div className="  font-extrabold  tracking-wider uppercase prada shine-text">DANY</div>
    </div>
  );
}

export default function BrandStrip() {
  return (
    <>
      <BrandStripDesktop />
      <BrandStripMobile />
    </>
  )
}