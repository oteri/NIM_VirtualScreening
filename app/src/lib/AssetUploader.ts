// Define the type for the function parameters
interface UploadAssetsParams {
  apiKey: string;
  receptor: string,
  ligands: (string|undefined)[];
}
export const uploadAssets = async ({
  apiKey,
  receptor,
  ligands
}: UploadAssetsParams): Promise<string[]> => {

  const assetUploadUrl = "/upload/v2/nvcf/assets"; //'https://api.nvcf.nvidia.com/v2/nvcf/assets';

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  const uploadData = [
    { description: 'Protein', payload: receptor },
    ...ligands.map(ligand => ({ description: 'Ligand', payload: ligand }))
  ];

  try {
    const results = await Promise.allSettled(
      uploadData.map(async ({ description, payload }) => {
        if(payload===undefined)
          throw new Error("Ligand payload is undefined");
        
        const metadataResponse = await getAssetMetadata(assetUploadUrl, description, headers);

        if (!metadataResponse.ok)
          throw new Error("Error getting metadata");

        const { assetId, uploadUrl, contentType } = await metadataResponse.json();
        const uploadResponse = await uploadAsset(uploadUrl, payload, contentType, description);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(errorText);
        }
        
        return assetId;
      })
    );


    const assetIds = results.map(result => {
      if (result.status === "fulfilled")
        return result.value; // The successful docking result
      return undefined
    });
    return assetIds;

  } catch (error:any) {
    console.error('Upload error:', error.message);
    throw new Error;
  }
}
async function uploadAsset(uploadUrl: any, payload: string, contentType: any, description: string) {
  const amazon = 'https://nv-gdn-strap-assets-prd.s3-accelerate.amazonaws.com';
  const uploadUrl_fixed = uploadUrl.replace(amazon,"amazon");
  
  return await fetch(uploadUrl_fixed, {
    method: 'PUT',
    body: payload,
    headers: {
      'Content-Type': contentType,
      'x-amz-meta-nvcf-asset-description': description,
    },
  });
}

async function getAssetMetadata(assetUploadUrl: string, description: string, headers: { Authorization: string; Accept: string;}) {
  return await fetch(assetUploadUrl, {
    method: 'POST',
    body: JSON.stringify({
      contentType: 'text/plain',
      description,
    }),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

