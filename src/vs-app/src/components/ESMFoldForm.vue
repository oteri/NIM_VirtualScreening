<template>
  <form @submit.prevent="onSubmit">
    <FormField name="proteinSequence">
      <FormItem class="flex flex-col w-full">
        <FormLabel class="w-1/6">Protein Sequence</FormLabel>
        <FormControl class="w-full">
          <Textarea placeholder="Protein Sequence used as input for EMS Fold" v-model="proteinSequence" />
          <FormMessage v-if="proteinSequenceError">{{ proteinSequenceError }}</FormMessage>
        </FormControl>
        <Button type="submit">Run ESM Fold</Button>
      </FormItem>
    </FormField>

    <FormField v-if="proteinPdb!=''" name="downloadPDB">
      <FormItem class="flex flex-col w-full">
        <Button class="mt-4" type="button" @click="downloadFile('protein_data.pdb', proteinPdb)">
          Download Protein Structure</Button>
      </FormItem>
    </FormField>
  </form>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

import { runEsmFold } from '@/lib/esmFoldApi';
import { useField } from 'vee-validate';
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { downloadFile } from '@/lib/IO';

const emit = defineEmits(['loading', 'update:proteinPdb']);
const proteinPdb = ref('');

const props = defineProps({
  apiKey: String
});

const { value: proteinSequence, errorMessage: proteinSequenceError } = useField<string>('proteinSequence');

const onSubmit = async () => {
  emit('loading', true);
  try {
    proteinPdb.value = await runEsmFold({apiKey:props.apiKey, proteinSequence: proteinSequence.value });
    emit('update:proteinPdb', proteinPdb.value);
  } catch (error) {
    console.error('Error running ESM Fold:', error);
  }
  emit('loading', false);
};
</script>