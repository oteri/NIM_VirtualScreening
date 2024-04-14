<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import * as z from 'zod';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values);
  resetForm();
});

const onRunESMFold = () => {
  console.log('Run ESM Fold');
  
}

const onGenerateLigands = () => {
  console.log('Run Generate Ligands');
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormField name="apiKey">
      <FormItem>
        <FormDescription> Virtual Screening using Nvdia NMI </FormDescription>
      </FormItem>

      <FormItem>
        <FormLabel>API Key</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your API key" v-model="apiKey" />
          <FormMessage v-if="apiKeyError">{{ apiKeyError }}</FormMessage>
        </FormControl>
      </FormItem>
    </FormField>

    <FormField name="proteinSequence">
      <FormItem>
        <FormLabel>Protein Sequence</FormLabel>
        <FormControl>
          <Textarea placeholder="Protein Sequence" v-model="proteinSequence" />
          <FormMessage v-if="proteinSequenceError">{{ proteinSequenceError }}</FormMessage>
        </FormControl>
        <Button type="button" @click="onRunESMFold">Run ESM Fold</Button>
      </FormItem>
    </FormField>

    <FormField name="smileString">
      <FormItem>
        <FormLabel>SMILES String</FormLabel>
        <FormControl>
          <Input type="text" placeholder="SMILES string" v-model="smileString" />
          <FormMessage v-if="smileStringError">{{ smileStringError }}</FormMessage>
          <Button type="button" @click="onGenerateLigands">Generate Ligands</Button>
        </FormControl>
      </FormItem>
    </FormField>

    <div class="flex gap-2">
      <Button type="submit">Submit</Button>
      <Button type="button" @click="resetForm">Reset</Button>
    </div>
  </form>
</template>
