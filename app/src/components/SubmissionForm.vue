<template>
  <div class="container mx-auto">
    <h3 class="text-lg font-medium">Virtual Screening</h3>
    <p class="text-sm text-muted-foreground">
      Virtual Screening using Nvidia NMI.
    </p>
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
    <ESMFoldForm :api-key="apiKey" @loading="handleLoading" @update:proteinPdb="onPdbUpdate" />
    <LigandDockingForm v-if="proteinPdb" :api-key="apiKey" :receptor="proteinPdb" @loading="handleLoading" />
    <Spinner :visible="loading" />
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/Spinner.vue';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useField } from 'vee-validate';
import { ref } from 'vue';
import ESMFoldForm from './ESMFoldForm.vue';
import LigandDockingForm from './LigandDockingForm.vue';

const { value: apiKey, errorMessage: apiKeyError } = useField<string>('apiKey');

const loading = ref(false);
const proteinPdb = ref('');

const handleLoading = (status:boolean) => {
  loading.value = status;
};

const onPdbUpdate = (pdbTxt:string) => {
 proteinPdb.value = pdbTxt
};

</script>
