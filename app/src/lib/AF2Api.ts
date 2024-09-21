// Define the type for the function parameters and the response
interface RunAF2Params {
  apiKey: string|undefined;
  proteinSequence: string;
}

interface AF2Response {
  pdbs: string[];
}

export const runAF2Fold = async ({
  apiKey,
  proteinSequence,
}: RunAF2Params): Promise<string> => {
  const invokeUrl = ' /biology/v1/biology/deepmind/alphafold2';
  const statusUrl = ' /biology/v1/status';

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${apiKey}`,
    "NVCF-POLL-SECONDS": "5",
  };

  const data = {
    sequence: proteinSequence,
    algorithm: "jackhmmer",
    e_value: 0.0001,
    iterations: 1,
    databases: ["uniref90", "small_bfd", "mgnify"],
    relax_prediction: true,
  };
  
  console.log("Making request...");

  try {
  const response = await fetch(invokeUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      });

    if (response.status === 200) {
      const jsonResponse: AF2Response = await response.json();
      return jsonResponse.pdbs[0];
    } else if (response.status === 202) {
      console.log("Request accepted...");
      const reqId = response.headers.get("nvcf-reqid");

      // Poll the /status endpoint
      while (true) {
        console.log("Polling for response...");
        const statusResponse = await fetch(`${statusUrl}/${reqId}`, { headers });

        if (statusResponse.status !== 202) {
          const jsonResponse: AF2Response = await statusResponse.json();
          return jsonResponse.pdbs[0];
}

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } else {
      throw new Error(`Unexpected HTTP status: ${response.status}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};