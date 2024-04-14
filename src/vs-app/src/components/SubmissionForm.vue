<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { runEsmFold } from '@/lib/esmFoldApi';
import { runMolmim } from '@/lib/molmimApi';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import * as z from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

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
const responseMessage = ref('');

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values);
  resetForm();
});

const handleRunEsmFold = async () => {
  loading.value = true;
  const result = await runEsmFold({
    apiKey: apiKey.value,
    proteinSequence: proteinSequence.value,
  });  
  responseMessage.value = JSON.stringify(result, null, 2);
  loading.value = false;
};


const handleGenerateLigands = async () => {
  loading.value = true;
  const result = await runMolmim({
    apiKey: apiKey.value,
    smiles: smileString.value,
  });
  responseMessage.value = JSON.stringify(result, null, 2);
  loading.value = false;
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
          <Textarea placeholder="Protein Sequence" v-model="proteinSequence" />
          <FormMessage v-if="proteinSequenceError">{{ proteinSequenceError }}</FormMessage>
        </FormControl>
        <Button type="button" @click="handleRunEsmFold">Run ESM Fold</Button>
      </FormItem>
    </FormField>

    <FormField name="smileString">
      <FormItem class="flex items-center w-full">
        <FormLabel class="w-1/6">SMILES String</FormLabel>
        <FormControl class="w-5/6">
          <Input type="text" placeholder="SMILES string" v-model="smileString" />
          <FormMessage v-if="smileStringError">{{ smileStringError }}</FormMessage>
          <Button type="button" @click="handleGenerateLigands">Generate Ligands</Button>
        </FormControl>
      </FormItem>
    </FormField>
  </form>
</template>
