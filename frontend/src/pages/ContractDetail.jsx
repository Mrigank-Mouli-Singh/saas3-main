import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../api'

export default function ContractDetail(){
  const { id } = useParams()
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const [showEvidence,setShowEvidence]=useState(false)

  useEffect(()=>{
    (async ()=>{
      try{
        const {data} = await client.get(`/contracts/${id}`)
        setData(data)
      }catch(e){ setError('Failed to load') }
      setLoading(false)
    })()
  },[id])

  if(loading) return <div className="p-4">Loading…</div>
  if(error) return <div className="p-4 text-red-600">{error}</div>

  const c = data.contract

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{c.filename}</h1>
          <div className="text-sm text-gray-600">Status: {c.status} • Risk: <span className={`${c.risk_score==='High'?'text-red-600':c.risk_score==='Medium'?'text-yellow-600':'text-green-700'}`}>{c.risk_score}</span></div>
        </div>
        <button onClick={()=>setShowEvidence(s=>!s)} className="border px-3 py-1 rounded">{showEvidence? 'Hide' : 'Show'} Evidence</button>
      </div>

      <section>
        <h2 className="font-semibold mb-2">Clauses</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {data.clauses.map((cl,i)=> (
            <div key={i} className="border rounded-lg p-3">
              <div className="font-medium">{cl.title}</div>
              <div className="text-sm mt-1">{cl.text}</div>
              <div className="text-xs text-gray-600 mt-2">Confidence: {cl.confidence}%</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">AI Insights</h2>
        <ul className="list-disc pl-5 text-sm">
          {data.insights.map((it,i)=> <li key={i}><span className="font-medium">{it.risk}</span> — {it.recommendation}</li>)}
        </ul>
      </section>

      {showEvidence && (
        <section className="border rounded-lg p-3">
          <h3 className="font-semibold mb-2">Evidence Drawer</h3>
          <div className="space-y-2">
            {data.snippets.map((s,i)=> (
              <div key={i} className="text-sm">
                <div className="text-gray-600">Page {s.page} • Relevance {Math.round(s.relevance*100)}%</div>
                <div>{s.text}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
