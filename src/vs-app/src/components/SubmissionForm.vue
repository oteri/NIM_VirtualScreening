<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'

const schema = toTypedSchema(z.object({
  apiKey: z.string().nonempty({ message: 'API Key is required.' }),
  proteinSequence: z.string().nonempty({ message: 'Protein sequence is required.' }),
  smileString: z.string().optional(),
}))

const { handleSubmit, resetForm, formContext } = useForm({
  validationSchema: schema,
  initialValues: {
    apiKey: '',
    proteinSequence: '',
    smileString: '',
  },
})

const onSubmit = handleSubmit((values) => {
  // Implement your form submission logic here
  console.log(values);
})

const onRunESMFold = () => {
  // Implement ESM Fold logic here
}

const onGenerateSmile = () => {
  // Implement Smile string generation logic here
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <FormItem>
      <FormLabel>API Key</FormLabel>
      <FormControl>
        <Input type="text" placeholder="Your API Key" v-model="formContext.values.apiKey" />
      </FormControl>
    </FormItem>

    <FormItem>
      <FormLabel>Protein Sequence</FormLabel>
      <FormControl>
        <Textarea placeholder="Protein Sequence" v-model="formContext.values.proteinSequence" />
      </FormControl>
    </FormItem>

    <FormItem>
      <Button type="button" @click="onRunESMFold">Run ESM Fold</Button>
    </FormItem>

    <FormItem>
      <FormLabel>Smile String</FormLabel>
      <FormControl>
        <Input type="text" placeholder="Smile String" v-model="formContext.values.smileString" />
      </FormControl>
      <Button type="button" @click="onGenerateSmile">Generate</Button>
    </FormItem>

    <div class="flex gap-2">
      <Button type="submit">Submit</Button>
      <Button type="button" @click="resetForm">Reset</Button>
    </div>
  </form>
</template>

<style scoped>
/* Add your CSS styles here */
</style>
