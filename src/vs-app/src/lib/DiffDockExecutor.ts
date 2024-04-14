interface DiffDockRunParams {
  apiKey: string;
  proteinAssetId: string,
  ligandAssetId: string;
}
export default async function executeDiffDock({
  apiKey,
  proteinAssetId,
  ligandAssetId
}: DiffDockRunParams) {
  
  const invokeUrl = '/api/v1/biology/mit/diffdock' //'https://health.api.nvidia.com/v1/biology/mit/diffdock';
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
    'NVCF-INPUT-ASSET-REFERENCES': [proteinAssetId, ligandAssetId],
  };
  const payload = {
  protein:proteinAssetId,
  ligand: ligandAssetId,
  ligand_file_type: "sdf",
  num_poses: 20,
  steps: 18,
  time_divisions: 20,
  save_trajectory: true,
  is_staged: true,
}


  try {    
    const executionResponse = await fetch(invokeUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!executionResponse.ok) {
      throw new Error(
        
      );
    }

    return await executionResponse.json();
  } catch (error) {
    console.error('Execution error:', error.message);
    throw error;
  }
}
