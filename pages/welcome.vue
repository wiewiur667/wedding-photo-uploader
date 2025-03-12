<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ulid } from 'ulid'
import { useField, useForm } from 'vee-validate'

definePageMeta({
  layout: 'default',
})

const appStore = useAppStore()
const router = useRouter()

const routeCode = useRoute().query.code

const { handleSubmit, meta } = useForm({
  validationSchema: {
    name(value: string) {
      if (value?.length >= 3)
        return true
      return 'Imie i nazwisko jest wymagane (min. 3 znaki)'
    },
    code(value: string) {
      if (value?.length >= 3)
        return true
      return 'Kod dostępu jest wymagany (min. 3 znaki)'
    },
  },
})

const { userName, sessionId } = storeToRefs(appStore)
const name = useField('name')
const code = useField('code')

if (routeCode)
  code.setValue(routeCode)

const submit = handleSubmit(async (values) => {
  userName.value = values.name
  sessionId.value = ulid()
  if (userName.value.length > 0) {
    try {
      await useApi('/api/user/register', {
        body: {
          name: userName.value,
        },
      })

      router.push('/')
    }
    catch (error) {
      console.error(error)
    }
  }
})
</script>

<template>
  <div class="flex flex flex-1 gap-3 bg-gray-700 font-sans!">
    <div class="flex flex-1 flex-col gap-4">
      <v-spacer />
      <div class="flex flex-col gap-8 text-xl">
        <div class="flex flex-col items-center justify-center gap-2 text-3xl text-white">
          <div>
            Witamy na weselu
          </div>
          <span class="font-bold">Klaudii i Sebastiana</span>
        </div>
      </div>
      <v-spacer />
      <v-card
        flat
        class="w-full rounded-t-lg bg-white/50!"
      >
        <form @submit.prevent="() => submit()">
          <v-card-text class="px-6!">
            <div class="mb-8 text-lg" />
            <v-text-field
              v-model="name.value.value"
              type="string"
              autocomplete="name"
              label="Imię i nazwisko"
              variant="solo"
              density="comfortable"
              prepend-icon="mdi:account"
              flat
              block
              placeholder="Podaj swoje imię i nazwisko"
              :error="name.meta.dirty && !meta.valid"
              :error-messages="name.errors.value"
            />
            <v-text-field
              v-model="code.value.value"
              type="number"
              variant="solo"
              density="comfortable"
              pattern="\d*"
              prepend-icon="mdi:lock"
              flat
              block
              :disabled="!!routeCode"
              :error="code.meta.dirty && !meta.valid"
              :error-messages="code.errors.value"
              placeholder="Podaj kod dostępu"
              label="Kod dostępu"
            />
          </v-card-text>
          <v-card-actions class="m-3 flex justify-end">
            <v-btn
              text="Wejdź"
              variant="flat"
              color="primary"
              type="submit"
              class="px-8"
              :disabled="!meta.dirty || !meta.valid"
            />
          </v-card-actions>
        </form>
      </v-card>
    </div>
  </div>
</template>

<style>

</style>
