<script setup lang="ts">
import { computed, ref } from 'vue';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import Spinner from '@/components/Spinner.vue';

import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';

import * as z from 'zod';

import { DockingResult, runDiffDock } from '@/lib/DiffDockRunner';
import { runEsmFold } from '@/lib/esmFoldApi';
import { Molecule, runMolmim } from '@/lib/molmimApi';

// Creating a Zod schema
const formSchema = z.object({
  apiKey: z.string().min(1, { message: 'API Key is required.' }),
  proteinSequence: z.string().min(1, { message: 'Protein Sequence is required.' }),
  smileString: z.string().min(1, { message: 'SMILES string is required.' }),
});

// Using `toTypedSchema` to ensure VeeValidate compatibility
const typedSchema = toTypedSchema(formSchema);

// Setup form with VeeValidate
const { handleSubmit, resetForm, formContext } = useForm({
  validationSchema: typedSchema,
  initialValues: {
    apiKey: '',
    proteinSequence: '',
    smileString: '',
  },
});

const { value: apiKey, errorMessage: apiKeyError } = useField('apiKey');
const { value: proteinSequence, errorMessage: proteinSequenceError } = useField('proteinSequence');
const { value: smileString, errorMessage: smileStringError } = useField('smileString');
const loading = ref(false);

const proteinPdb = ref('');
const molecules: Molecule[] = ref([]);
const complexes: DockingResult[] = ref([]);

const currentPage = ref(0);
const itemsPerPage = ref(5);

// Computed property to calculate the number of pages
const pageCount = computed(() => {
  return Math.ceil(molecules.value.length / itemsPerPage.value);
});

// Computed property to get the subset of molecules for the current page
const paginatedMolecules = computed(() => {
  const start = currentPage.value * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return molecules.value.slice(start, end);
});

// Methods to navigate pagination
const nextPage = () => {
  if (currentPage.value < pageCount.value - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values);
  resetForm();
});

const handleRunEsmFold = async () => {
  try{
  loading.value = true;

  proteinPdb.value = await runEsmFold({
    apiKey: apiKey.value,
    proteinSequence: proteinSequence.value,
  });    

 } finally {
    loading.value = false;
  }
};


const handleGenerateLigands = async () => {  
  try {
    loading.value = true;
    // Fetch molecules
    const fetchedMolecules = await runMolmim({
      apiKey: apiKey.value,
      smiles: smileString.value,
    });

    // Convert SMILES to SDF and update molecules
    molecules.value = fetchedMolecules.map(mol => {
      const rdKitMol = window.RDKit.get_mol(mol.sample);
      if (rdKitMol) {
        return {
          ...mol,
          sdf: rdKitMol.get_molblock() // Add SDF data to the molecule object
        };
      } else {
        console.error('Invalid SMILES for molecule:', mol.sample);
        return { ...mol }; // Return the original molecule if conversion fails
      }
    });

  } catch (error) {
    console.error('Error generating ligands:', error);
  } finally {
    loading.value = false;
  }
}

const handleRunDiffDock  = async () => {
  try{
    loading.value = true;
    const ligands = molecules.value.map( mol=>mol.sdf);
  
    complexes.value = await runDiffDock({
      apiKey: apiKey.value,
      receptor: proteinPdb.value,
      ligands: ligands
    });   

  }
  finally{
    loading.value = false;
  }  
}


</script>

<template>
  <form @submit.prevent="onSubmit" class="container mx-auto">
    <div>
      <h3 class="text-lg font-medium">
        Virtual Screening
      </h3>
      <p class="text-sm text-muted-foreground">
        Virtual Screening using Nvdia NMI.
      </p>
    </div>
    <Separator />
    <FormField name="apiKey">
      <FormItem class="flex items-center w-full">
        <FormLabel class="w-1/6">API Key</FormLabel>
        <FormControl class="w-5/6">
          <Input type="text" placeholder="Your API key" v-model="apiKey" />
          <FormMessage v-if="apiKeyError">{{ apiKeyError }}</FormMessage>
        </FormControl>
      </FormItem>
    </FormField>

    <FormField name="proteinSequence">
      <FormItem class="flex flex-col w-full">
        <FormLabel class="w-1/6">Protein Sequence</FormLabel>
        <FormControl class="w-full">
          <Textarea placeholder="Protein Sequence used as input for EMS Fold" v-model="proteinSequence" />
          <FormMessage v-if="proteinSequenceError">{{ proteinSequenceError }}</FormMessage>
        </FormControl>
        <Button type="button" @click="handleRunEsmFold">Run ESM Fold</Button>
      </FormItem>
    </FormField>

    <FormField name="smileString">
      <FormItem class="flex items-center w-full">
        <FormLabel class="w-1/6">SMILES String</FormLabel>
        <FormControl class="w-5/6">
          <Input type="text" placeholder="SMILES string used as input for molmim-generate" v-model="smileString" />
          <FormMessage v-if="smileStringError">{{ smileStringError }}</FormMessage>
          <Button type="button" @click="handleGenerateLigands">Generate Ligands</Button>
        </FormControl>
      </FormItem>
    </FormField>

    <Card v-if='molecules.length>0' class="border-top-1 xl:col-span-2 mt-6">
      <CardHeader class="flex flex-row items-center">
        <div class="w-1/6 grid gap-2">
          <CardTitle>Ligands</CardTitle>
          <CardDescription>
            Ligands generated by MolMim
          </CardDescription>
        </div>
        <div class="w-4/6 grid gap-2"></div>
        <Button class="w-1/6" type="button" @click="handleRunDiffDock">Run DiffDock</Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SMILES</TableHead>
              <TableHead class="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(molecule, index) in paginatedMolecules" :key="index">
              <TableCell>{{ molecule.sample }}</TableCell>
              <TableCell class="text-right">{{ molecule.score }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

      </CardContent>

      <CardFooter class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div class="text-xs text-muted-foreground">
          Page {{currentPage +1}} of {{ pageCount }}
        </div>
        <Pagination class="ml-auto mr-0 w-auto">
          <PaginationList class="gap-1">
            <PaginationPrev @click="prevPage" variant="outline" class="h-6 w-6" />
            <PaginationNext @click="nextPage" variant="outline" class="h-6 w-6" />
          </PaginationList>
        </Pagination>
      </CardFooter>
    </Card>

  </form>
  <Spinner :visible="loading" />
</template>
