// Utility to upload JSON to NFT.Storage and return the ipfs:// URI
export async function uploadJsonToNftStorage(json: object, apiKey: string): Promise<string> {
  const endpoint = 'https://api.nft.storage/upload';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('NFT.Storage upload failed: ' + err);
  }
  const data = await res.json();
  if (!data || !data.value || !data.value.cid) {
    throw new Error('Invalid response from NFT.Storage');
  }
  return `ipfs://${data.value.cid}`;
}
