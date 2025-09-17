import React, { useState } from 'react'
import { client } from '../api'

export default function Ask(){
  const [q,setQ]=useState('What is the termination notice period?')
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)

  const submit = async (e)=>{
    e.preventDefault(); setLoading(true); setError(null); setData(null)
    try{
      const {data} = await client.post('/ask', {question: q})
      setData(data)
    }catch(e){ setError('Failed to query') }
    setLoading(false)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Ask your contracts</h1>
      <form onSubmit={submit} className="flex gap-2">
        <input className="border p-2 rounded flex-1" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a question in natural language"/>
        <button className="border px-3 rounded">Ask</button>
      </form>
      {loading && <div>Thinking…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div className="space-y-3">
          <div className="border rounded p-3">
            <div className="font-medium mb-1">Mock AI Answer</div>
            <div className="text-sm">{data.answer}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">Top retrieved chunks</div>
            {data.results.map((r,i)=> (
              <div key={i} className="border rounded p-3 text-sm">
                <div className="text-gray-600">Doc: {r.doc_id} • Relevance: {Math.round(r.relevance*100)}%</div>
                <div className="mt-1">{r.text_chunk}</div>
                <div className="text-xs text-gray-500 mt-1">Page {(r.metadata||{}).page}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
