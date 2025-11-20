import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Image as ImageIcon, FileDown, Upload, Save } from 'lucide-react'

const prompts = {
  hero: 'Ultra realistic luxury sunglasses on a clean marble pedestal, soft natural light, shallow depth of field, premium editorial look, elegant reflections, crisp shadows, shot on a high end camera, photorealistic.',
  lifestyle: 'Fashion model wearing premium sunglasses in a modern European street, soft cinematic light, neutral tones, quiet luxury styling.',
  closeup: 'Macro shot of handcrafted acetate sunglasses hinge and lens edge, extremely realistic textures, high detail, crisp reflections.',
  flatlay: 'Minimalist flat lay of three premium eyewear frames on concrete or marble, balanced shadows and clean composition.'
}

export default function EditorPanel({ project, setProject, onSave, onExportZip }) {
  const [tab, setTab] = useState('content')
  const backend = import.meta.env.VITE_BACKEND_URL

  const update = (path, value) => {
    setProject(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = next
      while (keys.length > 1) obj = obj[keys.shift()]
      obj[keys[0]] = value
      return next
    })
  }

  const genImage = async (type) => {
    const res = await fetch(`${backend}/api/generate-image`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) })
    const data = await res.json()
    const map = { hero: 'images.hero', lifestyle: 'images.lifestyle', closeup: 'images.closeup', flatlay: 'images.flatlay' }
    update(map[type], data.url)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200/60 px-5 py-3 bg-white/70 backdrop-blur-sm">
        <div className="text-sm tracking-wide text-neutral-700">Zenview Editor</div>
        <div className="flex gap-2">
          <button onClick={onSave} className="px-3 py-1.5 rounded-full bg-black text-white text-sm hover:opacity-90 transition">Save</button>
          <button onClick={onExportZip} className="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm hover:opacity-90 transition inline-flex items-center gap-1"><FileDown size={16}/>Export</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-8">
        {/* Content */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Content</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Hero Title</label>
              <input value={project.sections.hero_title} onChange={e=>update('sections.hero_title', e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"/>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Hero Subtitle</label>
              <input value={project.sections.hero_subtitle} onChange={e=>update('sections.hero_subtitle', e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"/>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">CTA</label>
              <input value={project.sections.hero_cta} onChange={e=>update('sections.hero_cta', e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"/>
            </div>
          </div>
        </section>

        {/* Products */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Signature Collection</h3>
          <div className="space-y-3">
            {project.products.map((p, i)=> (
              <div key={i} className="border border-neutral-200 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  <input value={p.name} onChange={e=>{
                    const arr=[...project.products];arr[i]={...arr[i], name:e.target.value};update('products', arr)
                  }} className="rounded-md border border-neutral-200 px-2 py-2 text-sm" placeholder="Name"/>
                  <input type="number" value={p.price} onChange={e=>{const arr=[...project.products];arr[i]={...arr[i], price:parseFloat(e.target.value)};update('products', arr)}} className="rounded-md border border-neutral-200 px-2 py-2 text-sm" placeholder="Price"/>
                  <input value={p.description||''} onChange={e=>{const arr=[...project.products];arr[i]={...arr[i], description:e.target.value};update('products', arr)}} className="col-span-2 rounded-md border border-neutral-200 px-2 py-2 text-sm" placeholder="Description"/>
                  <input value={p.image||''} onChange={e=>{const arr=[...project.products];arr[i]={...arr[i], image:e.target.value};update('products', arr)}} className="col-span-2 rounded-md border border-neutral-200 px-2 py-2 text-sm" placeholder="Primary Image URL"/>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Generate Images</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(prompts).map((k)=> (
              <button key={k} onClick={()=>genImage(k)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:shadow-sm transition inline-flex items-center gap-2"><ImageIcon size={16}/>Generate {k}</button>
            ))}
          </div>
          <p className="text-[11px] text-neutral-400 mt-2">Predefined prompts are tailored for luxury eyewear photography.</p>
        </section>

        {/* Theme */}
        <section>
          <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Accent</label>
              <input type="color" value={project.theme.accent} onChange={e=>update('theme.accent', e.target.value)} className="w-full h-9 rounded"/>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Background</label>
              <input type="color" value={project.theme.background} onChange={e=>update('theme.background', e.target.value)} className="w-full h-9 rounded"/>
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Text</label>
              <input type="color" value={project.theme.text} onChange={e=>update('theme.text', e.target.value)} className="w-full h-9 rounded"/>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
