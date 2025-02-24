<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'

definePageMeta({
  layout: 'default',
})

const appStore = useAppStore()
const router = useRouter()

const { handleSubmit, meta, values } = useForm({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 3)
        return true
      return 'Imie i nazwisko jest wymagane'
    },
  },
})

const { userName, sessionId } = storeToRefs(appStore)
const name = useField('name')

const submit = handleSubmit((values) => {
  console.log(values)

  userName.value = values.name
  sessionId.value = Math.random().toString(36).substring(7)
  if (userName.value.length > 0) {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex flex flex-1 gap-3 p-4 font-sans!">
    <div class="flex flex-1 flex-col items-center gap-4">
      <v-spacer />

      <div class="mb-10 flex flex-col gap-8 text-xl">
        <div class="flex flex-col items-center justify-center gap-4 text-4xl font-600 tracking-wide!">
          <div class="text-center text-4xl">
            Witamy na weselu
          </div>
          <span>Klaudii</span>
          <span class="text-2xl">i</span>
          <span>Sebastiana</span>
        </div>
      </div>

      <v-card
        flat
        width="400px"
      >
        <form @submit.prevent="() => submit()">
          <v-card-text>
            <v-text-field
              v-model="name.value.value"
              type="string"
              autocomplete="name"

              variant="solo-filled"
              flat
              block
              placeholder="Wpisz swoje imie i nazwisko"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Potwierdz obecnosc"
              variant="tonal"
              color="primary"
              type="submit"
              :disabled="!meta.dirty || !meta.valid"
            />
          </v-card-actions>
        </form>
      </v-card>
      <v-spacer />
    </div>
  </div>
</template>

<style>

</style>
