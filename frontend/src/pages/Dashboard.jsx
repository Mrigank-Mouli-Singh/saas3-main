import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { client } from '../api'

export default function Dashboard(){
  const [items,setItems]=useState([])
  const [q,setQ]=useState('')
  const [status,setStatus]=useState('')
  const [risk,setRisk]=useState('')
  const [page,setPage]=useState(1)
  const [total,setTotal]=useState(0)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  const load = async ()=>{
    setLoading(true); setError(null)
    try{
      const {data} = await client.get('/contracts', { params: { q, status, risk, page, page_size: 10 } })
      setItems(data.items); setTotal(data.total)
    }catch(e){ setError('Failed to load') }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [page])

  const onSearch = (e)=>{ e.preventDefault(); setPage(1); load() }
  const totalPages = Math.ceil(total/10) || 1

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Contracts</h1>
        <div className="space-x-2">
          <Link to="/upload" className="px-3 py-2 border rounded">Upload</Link>
          <Link to="/ask" className="px-3 py-2 border rounded">Ask</Link>
        </div>
      </div>

      <form onSubmit={onSearch} className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Search by name or parties" value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="border p-2 rounded" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Status</option>
          <option>Active</option><option>Renewal Due</option><option>Expired</option>
        </select>
        <select className="border p-2 rounded" value={risk} onChange={e=>setRisk(e.target.value)}>
          <option value="">Risk</option>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <button className="border px-3 rounded">Filter</button>
      </form>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && items.length===0 && <div className="text-gray-500">No contracts yet. Click Upload to add one.</div>}

      {!loading && !error && items.length>0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Contract Name</th>
                <th className="p-2">Parties</th>
                <th className="p-2">Expiry Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {items.map(row=> (
                <tr key={row.doc_id} className="border-b hover:bg-gray-50">
                  <td className="p-2"><Link className="underline" to={`/contracts/${row.doc_id}`}>{row.filename}</Link></td>
                  <td className="p-2">{row.parties}</td>
                  <td className="p-2">{row.expiry_date || '—'}</td>
                  <td className="p-2">{row.status}</td>
                  <td className={`p-2 ${row.risk_score==='High'?'text-red-600':row.risk_score==='Medium'?'text-yellow-600':'text-green-700'}`}>{row.risk_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-2 mt-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="border px-2 py-1 rounded disabled:opacity-50">Prev</button>
            <div>Page {page} / {totalPages}</div>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="border px-2 py-1 rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
