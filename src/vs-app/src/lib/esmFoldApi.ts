// Define the type for the function parameters and the response
interface RunEsmFoldParams {
  apiKey: string|undefined;
  proteinSequence: string;
}

interface EsmFoldResponse {
  pdbs: string[];  // Assuming pdbs is an array of strings
}


export const runEsmFold = async ({
  apiKey,
  proteinSequence,
}: RunEsmFoldParams): Promise<string> => {

 const invokeUrl = '/biology/v1/biology/nvidia/esmfold'; //'https://health.api.nvidia.com/v1/biology/nvidia/esmfold';

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  const data = {
    sequence: proteinSequence,
  };
  
  const response = await fetch(invokeUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error('HTTP error, status = ' + response.status);
      }

      const jsonResponse: EsmFoldResponse = await response.json();
      const pdbText = jsonResponse.pdbs[0]      
      return pdbText;
}