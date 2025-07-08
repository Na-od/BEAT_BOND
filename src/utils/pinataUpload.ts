// Utility to upload JSON to Pinata and return the ipfs:// URI using JWT
export async function uploadJsonToPinata(json: object, jwt: string): Promise<string> {
  const endpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pinataContent: json }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Pinata upload failed: ' + err);
  }
  const data = await res.json();
  if (!data || !data.IpfsHash) {
    throw new Error('Invalid response from Pinata');
  }
  return `ipfs://${data.IpfsHash}`;
}
