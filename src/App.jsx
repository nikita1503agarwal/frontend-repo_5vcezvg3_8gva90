import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import EditorPanel from './components/EditorPanel'
import Preview from './components/Preview'

const defaultProject = {
  name: 'Zenview Eyewear',
  description: 'Quiet luxury eyewear storefront',
  products: [
    { name: 'Aero 01', price: 420, description: 'Sculptural acetate, balanced silhouette' },
    { name: 'Linea 02', price: 460, description: 'Slim titanium, architectural lines' },
    { name: 'Shade 03', price: 480, description: 'Deep lens profile, cinematic' },
  ],
  theme: { accent: '#C2A676', background: '#FAFAF8', text: '#111111' },
  sections: {
    hero_title: 'Zenview Eyewear',
    hero_subtitle: 'See Without Noise',
    hero_cta: 'Shop the Collection',
    story_title: 'Quiet Luxury, Considered Design',
    story_body: 'Handcrafted eyewear balancing proportion, material and restraint.',
    craft_title: 'Craftsmanship & Materials',
    craft_points: [
      'Premium Italian acetate, hand-polished',
      'Anti-reflective Zeiss lenses',
      'Featherlight titanium hardware',
      'Precision-balanced comfort fit',
    ],
    lookbook_title: 'Lookbook',
    testimonials: [
      'Understated and impeccably made.',
      'The only frames I wear now.',
      'Pure, quiet confidence.',
    ],
    faqs: [
      { q: 'What makes Zenview different?', a: 'A focus on restraint, proportion and material honesty.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide with premium tracked service.' },
      { q: 'What is your return policy?', a: '30-day returns in original condition for a full refund.' },
    ],
  },
  images: {}
}

function App() {
  const [project, setProject] = useState(defaultProject)
  const [projectId, setProjectId] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL

  const save = async () => {
    if (!backend) return alert('Backend URL not configured')
    if (!projectId) {
      // create
      const res = await fetch(`${backend}/api/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project }) })
      const data = await res.json()
      setProjectId(data.id)
    } else {
      await fetch(`${backend}/api/projects/${projectId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: projectId, project }) })
    }
  }

  const exportZip = async () => {
    if (!projectId) { await save() }
    const id = projectId || (await (await fetch(`${backend}/api/projects`)).json())[0]?.id
    if (!id) return alert('No project to export')
    const url = `${backend}/api/projects/${id}/export.zip`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-neutral-900">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <div className="font-serif tracking-wide">Zenview Builder</div>
          <div className="text-xs text-neutral-500">Tagline: See Without Noise</div>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[420px,1fr] gap-6 p-6">
        <div className="rounded-2xl overflow-hidden border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,.06)] h-[calc(100vh-120px)]">
          <EditorPanel project={project} setProject={setProject} onSave={save} onExportZip={exportZip} />
        </div>
        <div className="rounded-2xl overflow-hidden border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,.06)] h-[calc(100vh-120px)]">
          <Preview project={project} />
        </div>
      </div>
    </div>
  )
}

export default App
