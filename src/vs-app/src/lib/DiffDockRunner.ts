import { uploadAssets } from "./AssetUploader";
import executeDiffDock from "./DiffDockExecutor"; // Assuming executeDiffDock is the default export

// Define the type for the function parameters
interface RunDiffDockParams {
  apiKey: string;
  receptor: string;
  ligands: (string|undefined)[];
}

// Define the Molecule interface
export interface DockingResult {
  ligand: string; // UUID or identifier for the ligand
  ligand_positions: string[]; // Array of SDF representations for different ranks
  position_confidence: number[]; // Array of confidence scores for each position
  protein: string; // UUID or identifier for the protein
  trajectory: string[]; // Array of trajectory data in some format
  error?: string; // Optional error message if there was an error during processing
}

// Function to run DiffDock which now returns a Promise of an array of Molecules
export const runDiffDock = async ({
  apiKey,
  receptor,
  ligands
}: RunDiffDockParams): Promise< DockingResult[]|undefined> => {
  let proteinAssetId: string;
  let ligandIds: string[];
  console.info('Uploading receptor and ligands');
  try {
    // First upload the receptor and ligands, then execute DiffDock
    const assetIds = await uploadAssets({apiKey: apiKey, receptor: receptor, ligands: ligands});
    proteinAssetId = assetIds[0];  // Get the first element as the protein ID
    ligandIds = assetIds.slice(1);  // Get all elements after the first one as ligand IDs
  } catch (error) {
    console.error("Error in running DiffDock:", error);
    throw new Error;  // Re-throw to handle it in caller function or global error handler
  }

  try {
    // Assuming `ligandIds` is an array of asset IDs for the ligands
    const results = await Promise.allSettled(
                      ligandIds.map(ligandAssetId => executeDiffDock({
                        apiKey,
                        proteinAssetId,
                        ligandAssetId,
                      }))
    );
  
    // Process results to handle both successes and errors
    const executionResults = results.map(result => {
      if (result.status === "fulfilled") {
        return result.value;  // The successful docking result
      } else {
        return { error: result.reason };  // Capture the error object
      }
    });
    return executionResults;
    
  } catch (error) {
    console.error("Error managing docking processes:", error);
  }    
}
