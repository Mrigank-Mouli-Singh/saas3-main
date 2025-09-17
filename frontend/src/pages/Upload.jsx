import React, { useState } from 'react'
import { client } from '../api'

export default function Upload(){
  const [file,setFile]=useState(null)
  const [status,setStatus]=useState('idle') // idle, uploading, success, error
  const [message,setMessage]=useState('')

  const onDrop = (e)=>{
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    setFile(f)
  }

  const onUpload = async ()=>{
    if(!file) return
    setStatus('uploading'); setMessage('Parsing and saving…')
    try{
      const form = new FormData()
      form.append('file', file)
      const {data} = await client.post('/upload', form, { headers: {'Content-Type':'multipart/form-data'}})
      setStatus('success'); setMessage(`Uploaded. Saved ${data.chunks_saved} chunks.`)
    }catch(e){
      setStatus('error'); setMessage(e.response?.data?.detail || 'Upload failed')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Upload Contract</h1>
      <div className="border-2 border-dashed rounded-xl p-10 text-center"
        onDragOver={(e)=>e.preventDefault()}
        onDrop={onDrop}>
        {file ? (
          <div className="space-y-2">
            <div className="font-medium">{file.name}</div>
            <button onClick={onUpload} className="px-4 py-2 border rounded">Upload</button>
          </div>
        ) : (
          <div>Drag & drop a PDF/TXT/DOCX here, or <label className="underline cursor-pointer">browse<input type="file" className="hidden" accept=".pdf,.txt,.docx" onChange={e=>setFile(e.target.files[0])}/></label></div>
        )}
      </div>
      {status!=='idle' && <div className={status==='error'?'text-red-600':'text-gray-700'}>{message}</div>}
    </div>
  )
}
