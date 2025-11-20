import { motion } from 'framer-motion'

export default function Preview({ project }) {
  const p = project
  return (
    <div className="w-full h-full overflow-auto bg-[#FAFAF8]">
      {/* Sticky nav */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="font-serif text-lg tracking-wide">Zenview</div>
          <div className="hidden md:flex gap-6 text-sm text-neutral-600">
            <a href="#collections" className="hover:text-black transition">Collections</a>
            <a href="#story" className="hover:text-black transition">Story</a>
            <a href="#craft" className="hover:text-black transition">Craft</a>
            <a href="#lookbook" className="hover:text-black transition">Lookbook</a>
            <a href="#faq" className="hover:text-black transition">FAQ</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="flex items-center">
          <div className="px-10 py-16">
            <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="font-serif text-5xl md:text-6xl leading-tight">{p.sections.hero_title}</motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} className="text-neutral-600 mt-3">{p.sections.hero_subtitle}</motion.p>
            <motion.a href="#collections" whileHover={{y:-2}} className="inline-block mt-6 bg-black text-white rounded-full px-6 py-3 shadow-[0_12px_28px_rgba(0,0,0,.12)]">{p.sections.hero_cta}</motion.a>
          </div>
        </div>
        <div className="relative border-l border-black/5">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}} className="absolute inset-0" style={{backgroundImage:`url(${p.images.hero || 'https://placehold.co/1600x900?text=Zenview+Hero'})`, backgroundSize:'cover', backgroundPosition:'center'}} />
        </div>
      </section>

      {/* Collection */}
      <section id="collections" className="max-w-[1200px] mx-auto px-6 py-24">
        <h2 className="font-serif text-3xl mb-8">Signature Collection</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {p.products.map((prod, idx)=> (
            <motion.div whileHover={{y:-6}} key={idx} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,.06)]">
              <div className="pt-[66%] bg-center bg-cover" style={{backgroundImage:`url(${prod.image || 'https://placehold.co/800x600?text=Frame'})`}} />
              <div className="flex items-center justify-between p-4">
                <div className="font-medium">{prod.name}</div>
                <div className="text-neutral-500">${prod.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl h-[520px] bg-center bg-cover shadow-[0_20px_60px_rgba(0,0,0,.08)]" style={{backgroundImage:`url(${p.images.lifestyle || 'https://placehold.co/1200x1400?text=Lifestyle'})`}} />
          <div>
            <h3 className="font-serif text-3xl mb-3">{p.sections.story_title}</h3>
            <p className="text-neutral-600 leading-relaxed">{p.sections.story_body}</p>
          </div>
        </div>
      </section>

      {/* Craft */}
      <section id="craft" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h3 className="font-serif text-3xl mb-6">{p.sections.craft_title}</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {p.sections.craft_points.map((c, i)=> (
              <div key={i} className="flex gap-3 items-start bg-white border border-black/5 rounded-xl p-4">
                <div className="w-2 h-2 rounded-full" style={{background:p.theme.accent, marginTop:8}}></div>
                <p className="text-neutral-700 text-sm">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section id="lookbook" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h3 className="font-serif text-3xl mb-6">{p.sections.lookbook_title}</h3>
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]"><img className="mb-4 rounded-xl shadow-[0_14px_40px_rgba(0,0,0,.08)]" src={p.images.lifestyle || 'https://placehold.co/800x1000'} /><img className="mb-4 rounded-xl shadow-[0_14px_40px_rgba(0,0,0,.08)]" src={p.images.flatlay || 'https://placehold.co/1000x800'} /><img className="mb-4 rounded-xl shadow-[0_14px_40px_rgba(0,0,0,.08)]" src={p.images.closeup || 'https://placehold.co/900x900'} /></div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-[900px] mx-auto px-6 grid gap-4">
          {p.sections.testimonials.map((t,i)=> (
            <blockquote key={i} className="border-l-2 pl-4 text-neutral-800" style={{borderColor:p.theme.accent}}>&ldquo;{t}&rdquo;</blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-[900px] mx-auto px-6 grid gap-2">
          {p.sections.faqs.map((f,i)=> (
            <details key={i} className="bg-white border border-black/5 rounded-xl p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="text-neutral-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-black/5 py-10 bg-white/70 backdrop-blur">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-neutral-700">Zenview Eyewear — {p.sections.hero_subtitle}</div>
          <form className="flex items-center gap-2">
            <input placeholder="Email" className="rounded-full border border-black/10 px-4 py-2"/>
            <button className="rounded-full bg-black text-white px-5 py-2">Join</button>
          </form>
        </div>
      </footer>
    </div>
  )
}
