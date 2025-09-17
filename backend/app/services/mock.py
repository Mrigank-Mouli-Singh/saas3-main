import hashlib, json, uuid, random
from typing import List, Dict

# Deterministic 4-D "embedding" for demo via hashing
def mock_embed(text: str) -> List[float]:
    h = hashlib.sha256(text.encode()).digest()
    # map 32 bytes -> 4 floats in [-1,1]
    vals = []
    for i in range(4):
        chunk = int.from_bytes(h[i*8:(i+1)*8], "big", signed=False)
        vals.append(((chunk % 2000) - 1000) / 1000.0)
    return vals

def mock_llamacloud_parse(filename: str, content_bytes: bytes) -> Dict:
    # Return fixed example + a couple extra chunks from file name to prove flow
    base = {
        "document_id": str(uuid.uuid4()),
        "chunks": [
            {
                "chunk_id": "c1",
                "text": "Termination clause: Either party may terminate with 90 days’ notice.",
                "embedding": [0.12, -0.45, 0.91, 0.33],
                "metadata": {"page": 2, "contract_name": filename},
            },
            {
                "chunk_id": "c2",
                "text": "Liability cap: Limited to 12 months’ fees.",
                "embedding": [0.01, 0.22, -0.87, 0.44],
                "metadata": {"page": 5, "contract_name": filename},
            },
        ],
    }
    # Add one deterministic chunk derived from filename
    extra_text = f"Parties: {filename.split('.')[0]} and ACME Corp."
    base["chunks"].append({
        "chunk_id": "c3",
        "text": extra_text,
        "embedding": mock_embed(extra_text),
        "metadata": {"page": 1, "contract_name": filename},
    })
    return base
