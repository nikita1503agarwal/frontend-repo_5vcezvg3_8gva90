import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Image as ImageIcon, Download, Save, Upload, ArrowRight } from 'lucide-react'

const NB_PROMPTS = {
  hero: "Ultra realistic luxury sunglasses on a clean marble pedestal, soft natural light, shallow depth of field, premium editorial look, elegant reflections, crisp shadows, shot on a high end camera, photorealistic.",
  lifestyle: "Fashion model wearing premium sunglasses in a modern European street, soft cinematic light, neutral tones, quiet luxury styling.",
  closeup: "Macro shot of handcrafted acetate sunglasses hinge and lens edge, extremely realistic textures, high detail, crisp reflections.",
  flatlay: "Minimalist flat lay of three premium eyewear frames on concrete or marble, balanced shadows and clean composition."
}

const defaultProject = {
  name: 'Zenview Eyewear',
  headline: 'See Without Noise',
  subheading: 'Minimalist luxury eyewear crafted for clarity.',
  cta: 'Shop Signature Collection',
  collections: [
    { name: 'Aperture 01', price: 420, description: 'Sculpted acetate with precision edges' },
    { name: 'Contour 02', price: 480, description: 'Featherlight titanium bridge' },
    { name: 'Silence 03', price: 520, description: 'Ultra-flat lenses, anti-glare finish' },
  ],
  story: 'Born from a pursuit of quiet luxury, Zenview crafts eyewear that disappears so you can see more.',
  craftsmanship: [
    { title: 'Japanese Acetate', description: 'Dense, richly pigmented acetate hand-polished to a mirror finish.' },
    { title: 'Titanium Hardware', description: 'Featherweight strength with hypoallergenic comfort.' },
    { title: 'Optical Clarity', description: 'Multi-layer anti-reflective coating for glare-free vision.' },
  ],
  lookbook: [],
  testimonials: [
    { quote: 'Effortless, quiet and impeccably made.', author: 'Leah M.', role: 'Stylist' },
    { quote: 'Like a great suit for your face.', author: 'Marco D.' },
    { quote: 'Understated, beautifully executed.', author: 'Elle Magazine' },
  ],
  faq: [
    { question: 'Where are your frames made?', answer: 'Frames are crafted in small batches with global materials and finished by hand.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide with tracked, insured delivery.' },
    { question: 'What is the warranty?', answer: 'Two-year limited warranty covering manufacturing defects.' },
  ],
  images: { hero: '', lifestyle: '', closeup: '', flatlay: '' },
  styles: { brand: 'Zenview Eyewear', tagline: 'See Without Noise', primary: '#0b0b0c', background: '#f7f6f4', accent: '#c7b199', text: '#111111' }
}

const Section = ({ title, children }) => (
  <div className="mb-8">
    <div className="text-xs uppercase tracking-widest text-neutral-400 mb-3">{title}</div>
    <div className="space-y-3">{children}</div>
  </div>
)

const Input = (props) => (
  <input {...props} className={`w-full rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neutral-400 transition ${props.className||''}`} />
)
const Textarea = (props) => (
  <textarea {...props} className={`w-full rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neutral-400 transition ${props.className||''}`} />
)
const Button = ({ children, className, ...rest }) => (
  <button {...rest} className={`inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black text-white px-4 py-2 text-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition ${className||''}`}>{children}</button>
)

export default function Editor({ onExport, onGenerate, onSaveProject }){
  const [project, setProject] = useState(()=>{
    const saved = localStorage.getItem('zenview-project')
    return saved ? JSON.parse(saved) : defaultProject
  })
  const [generating, setGenerating] = useState(false)

  useEffect(()=>{
    localStorage.setItem('zenview-project', JSON.stringify(project))
  }, [project])

  const backend = import.meta.env.VITE_BACKEND_URL || ''

  const update = (patch) => setProject(prev => ({ ...prev, ...patch }))

  const exportZip = async () => {
    const res = await fetch(backend + '/api/export/zip', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project })
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'zenview-site.zip'; a.click()
    window.URL.revokeObjectURL(url)
  }

  const generate = async () => {
    setGenerating(true)
    try{
      const res = await fetch(backend + '/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project }) })
      const data = await res.json()
      onGenerate?.(data)
    } finally {
      setGenerating(false)
    }
  }

  const pickImage = async (field) => {
    const url = prompt('Paste image URL (or use Nano Banana prompts below):')
    if(!url) return
    setProject(p => ({ ...p, images: { ...p.images, [field]: url } }))
  }

  const nanoPrompt = (type) => {
    const txt = NB_PROMPTS[type]
    navigator.clipboard.writeText(txt)
    alert('Prompt copied to clipboard. Paste into Nano Banana to generate, then paste the image URL back here.')
  }

  return (
    <div className="h-screen w-full grid md:grid-cols-[420px,1fr] bg-neutral-50 text-neutral-900">
      <aside className="h-screen overflow-y-auto border-r border-neutral-200 bg-white/70 backdrop-blur-sm p-6">
        <div className="mb-6">
          <div className="text-lg font-semibold tracking-tight">Zenview Builder</div>
          <div className="text-xs text-neutral-500">See Without Noise</div>
        </div>

        <Section title="Basics">
          <Input value={project.name} onChange={e=>update({name:e.target.value})} placeholder="Brand name" />
          <Input value={project.headline} onChange={e=>update({headline:e.target.value})} placeholder="Headline" />
          <Textarea rows={3} value={project.subheading} onChange={e=>update({subheading:e.target.value})} placeholder="Subheading" />
          <Input value={project.cta} onChange={e=>update({cta:e.target.value})} placeholder="CTA" />
        </Section>

        <Section title="Signature Collection">
          {project.collections.map((c, i)=> (
            <div key={i} className="grid grid-cols-5 gap-2">
              <input value={c.name} onChange={e=>{
                const arr = [...project.collections]; arr[i] = {...c, name:e.target.value}; update({collections:arr})
              }} placeholder="Name" className="col-span-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm"/>
              <input type="number" step="0.01" value={c.price} onChange={e=>{
                const arr = [...project.collections]; arr[i] = {...c, price: parseFloat(e.target.value||'0')}; update({collections:arr})
              }} placeholder="Price" className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"/>
              <input value={c.description||''} onChange={e=>{ const arr=[...project.collections]; arr[i] = {...c, description:e.target.value}; update({collections:arr}) }} placeholder="Short description" className="col-span-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm"/>
            </div>
          ))}
          <Button className="bg-neutral-900" onClick={()=>update({collections:[...project.collections, {name:'New Model', price: 450}]})}>Add Model</Button>
        </Section>

        <Section title="Images">
          <div className="grid grid-cols-2 gap-2">
            {['hero','lifestyle','closeup','flatlay'].map(k=> (
              <div key={k} className="rounded-xl border border-neutral-200 p-3">
                <div className="text-xs mb-2 capitalize">{k}</div>
                <div className="flex gap-2">
                  <Button className="bg-neutral-900" onClick={()=>pickImage(k)}><Upload size={16}/> Set</Button>
                  <Button className="bg-neutral-800" onClick={()=>nanoPrompt(k)}><Wand2 size={16}/> Nano Prompt</Button>
                </div>
                <div className="text-[10px] text-neutral-400 mt-2 line-clamp-2">{NB_PROMPTS[k]}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Lookbook">
          <Textarea rows={3} placeholder="Paste image URLs separated by new lines (Unsplash etc.)" value={project.lookbook.join('\n')} onChange={e=>update({lookbook: e.target.value.split('\n').filter(Boolean)})}/>
        </Section>

        <Section title="Brand Story">
          <Textarea rows={4} value={project.story} onChange={e=>update({story:e.target.value})}/>
        </Section>

        <Section title="Craftsmanship">
          {project.craftsmanship.map((f,i)=> (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input value={f.title} onChange={e=>{ const arr=[...project.craftsmanship]; arr[i] = {...f, title:e.target.value}; update({craftsmanship:arr}) }}/>
              <Input value={f.description} onChange={e=>{ const arr=[...project.craftsmanship]; arr[i] = {...f, description:e.target.value}; update({craftsmanship:arr}) }}/>
            </div>
          ))}
          <Button className="bg-neutral-900" onClick={()=>update({craftsmanship:[...project.craftsmanship, {title:'New Feature', description:'Description'}]})}>Add Feature</Button>
        </Section>

        <Section title="Testimonials">
          {project.testimonials.map((t,i)=> (
            <div key={i} className="grid grid-cols-3 gap-2">
              <Input value={t.quote} onChange={e=>{ const arr=[...project.testimonials]; arr[i] = {...t, quote:e.target.value}; update({testimonials:arr}) }} className="col-span-2"/>
              <Input value={t.author} onChange={e=>{ const arr=[...project.testimonials]; arr[i] = {...t, author:e.target.value}; update({testimonials:arr}) }}/>
            </div>
          ))}
          <Button className="bg-neutral-900" onClick={()=>update({testimonials:[...project.testimonials, {quote:'New quote', author:'Name'}]})}>Add Testimonial</Button>
        </Section>

        <Section title="FAQ">
          {project.faq.map((f,i)=> (
            <div key={i} className="grid grid-cols-1 gap-2">
              <Input value={f.question} onChange={e=>{ const arr=[...project.faq]; arr[i] = {...f, question:e.target.value}; update({faq:arr}) }} placeholder="Question"/>
              <Input value={f.answer} onChange={e=>{ const arr=[...project.faq]; arr[i] = {...f, answer:e.target.value}; update({faq:arr}) }} placeholder="Answer"/>
            </div>
          ))}
          <Button className="bg-neutral-900" onClick={()=>update({faq:[...project.faq, {question:'New question', answer:'Answer'}]})}>Add FAQ</Button>
        </Section>

        <div className="flex gap-2 mt-8">
          <Button onClick={generate} disabled={generating} className="bg-neutral-900">Generate <ArrowRight size={16}/></Button>
          <Button onClick={exportZip} className="bg-neutral-800"><Download size={16}/> Export</Button>
        </div>
      </aside>

      <Preview project={project} onGenerate={onGenerate} />
    </div>
  )
}

function Preview({ project }){
  const [bundle, setBundle] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || ''

  useEffect(()=>{
    const run = async()=>{
      const res = await fetch(backend + '/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ project }) })
      const data = await res.json(); setBundle(data)
    }
    run()
  }, [project])

  if(!bundle) return <div className="h-screen overflow-y-auto p-10 bg-neutral-50">Loading preview…</div>

  return (
    <div className="h-screen overflow-y-auto bg-neutral-50">
      <iframe title="Preview" className="w-full h-full" srcDoc={bundle.html}></iframe>
    </div>
  )
}
