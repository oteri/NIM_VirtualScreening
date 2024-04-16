// Define the type for the function parameters
interface RunMolmimParams {
  apiKey: string;
  smiles: string;
}

// Define the Molecule interface as before
export interface Molecule {
  sample: string;
  score: number;
  sdf?: string; // Optional sdf property to store SDF format
}

// Update the function to return a Promise of an array of Molecules
export const runMolmim = async ({
  apiKey,
  smiles,
}: RunMolmimParams): Promise<Molecule[]> => {
  const invokeUrl = '/api/v1/biology/nvidia/molmim/generate'; //https://health.api.nvidia.com/api/v1/biology/nvidia/molmim/generate';

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  const data = {
    "algorithm": "CMA-ES",
    "num_molecules": 30,
    "property_name": "QED",
    "minimize": false,
    "min_similarity": 0.3,
    "particles": 30,
    "iterations": 10,
    "smi": smiles
  };

  try {
    const response = await fetch(invokeUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
    }

    const jsonResponse = await response.json();
    if (jsonResponse && jsonResponse.molecules) {
      const moleculesData = JSON.parse(jsonResponse.molecules);
      return moleculesData.map((mol: { sample: string, score: number }) => ({
        sample: mol.sample,
        score: mol.score
      }));
    } else {
      throw new Error('No molecules data found');
    }

  } catch (error) {
    console.error('Error making request:', error);
    throw new Error;
  }
}
