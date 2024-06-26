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
  
  const invokeUrl = '/biology/v1/biology/mit/diffdock' //'https://health.api.nvidia.com/v1/biology/mit/diffdock';
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
    'NVCF-INPUT-ASSET-REFERENCES': `${proteinAssetId}, ${ligandAssetId}`,
  };
  const payload = {
  protein:proteinAssetId,
  ligand: ligandAssetId,
  ligand_file_type: "sdf",
  num_poses: 20,
  steps: 18,
  time_divisions: 20,
  save_trajectory: false,
  is_staged: true,
}


  try {    
    const executionResponse = await fetch(invokeUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!executionResponse.ok) {
      throw new Error( "Error Running DiffDock");
    }

    return await executionResponse.json();
    
  } catch (error:any) {
    throw new Error(`Execution error: ${error.message}`);
  }
}
