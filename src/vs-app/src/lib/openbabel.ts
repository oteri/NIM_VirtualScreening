
/**
 * Converts a SMILES string to its corresponding SDF format using the OpenBabel API.
 * 
 * @param smiles - The SMILES string to be converted.
 * @returns The SDF format as a string if successful, or null if conversion fails.
 */
export async function smiles2sdf(smiles: string): Promise<string | null> {
    const url = "/openbabel/v1/convert";
    const formData = new FormData();

    // Setting up the form data for the POST request
    formData.append('input', smiles);
    formData.append('inputFormat', 'smiles');
    formData.append('outputFormat', 'sdf');
    formData.append('coordinates', '3D');
    formData.append('hydrogens', 'Delete');

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if(data.result=="")
            throw Error(data.log)
        return data.result; // Assuming the API returns JSON with a 'result' field containing the SDF data
    } catch (error) {
        console.error("Error converting SMILES to SDF:", error);
        return null;
    }
}

