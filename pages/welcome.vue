<script lang="ts" setup>
import { FetchError } from 'ofetch'
import { useField, useForm } from 'vee-validate'

definePageMeta({
  layout: 'default',
})

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
const route = useRoute()
const { fetch: refreshSession } = useUserSession()
const routeCode = route.query.code as string | undefined

const name = useField('name')
const code = useField('code')

const steps = [1, 2]
const stepsTitle = ['Imię i nazwisko', 'Kod dostępu']
const formStep = ref(1)

if (routeCode)
  code.setValue(routeCode)

const submit = handleSubmit(async (values) => {
  if (values.name.length > 0) {
    try {
      await $fetch('/api/users/welcome', {
        method: 'POST',
        body: {
          name: values.name,
          code: values.code,
        },
      })

      await refreshSession()
      await navigateTo('/')
    }
    catch (error) {
      if (error instanceof FetchError) {
        if (error.statusCode === 409) {
          name.setErrors(['Użytkownik o podanej nazwie już istnieje'])
          return
        }
        if (error.statusCode === 401) {
          code.setErrors('Nieprawidłowy kod dostępu')
        }
      }
      else {
        console.error(error)
      }
    }
  }
})
</script>

<template>
  <div

    class="relative flex flex-1 gap-3 p-6! font-sans!"
  >
    <div
      id="welcome-page-background"
      class="z-1"
    />
    <div class="z-2 flex flex-1 flex-col justify-center gap-4">
      <div class="flex flex-col items-center gap-3 text-center text-4xl font-bold">
        <span> Witamy na weselu</span>
        <span>Klaudii i Sebastiana</span>
      </div>

      <div class="bottom-0 left-0 right-0 flex-1 flex-col rounded pb-0 absolute! flex!">
        <form
          class="flex flex-1 flex-col justify-center gap-4"
          @submit.prevent="() => submit()"
        >
          <v-stepper
            v-model="formStep"
            hide-actions
            flat
            bg-color="transparent"
            alt-labels
          >
            <template #default>
              <v-stepper-header class="shadow-none!">
                <template
                  v-for="(n, index) in steps"
                  :key="`${n}-step`"
                >
                  <v-stepper-item
                    :value="n"
                    :title="stepsTitle[index]"
                  />
                </template>
              </v-stepper-header>

              <v-stepper-window class="mt-0!">
                <v-stepper-window-item :value="steps[0]">
                  <div class="flex flex-col gap-3 p-2">
                    <v-text-field
                      v-model.trim="name.value.value"
                      type="string"
                      autocomplete="name"
                      label="Imię i nazwisko"
                      variant="outlined"
                      density="comfortable"
                      width="100%"
                      flat
                      block
                      rounded="lg"

                      placeholder="Podaj swoje imię i nazwisko"
                      :error="name.meta.dirty && !name.meta.valid"
                      :error-messages="name.errors.value"
                    />
                    <div class="flex">
                      <v-spacer />
                      <v-btn
                        :disabled="!name.meta.dirty || !name.meta.valid"
                        color="primary"
                        variant="outlined"
                        flat
                        :text="$t('action.enter_passcode')"
                        @click="formStep = steps[1]"
                      />
                    </div>
                  </div>
                </v-stepper-window-item>
                <v-stepper-window-item :value="steps[1]">
                  <div class="flex flex-col gap-3">
                    <span class="text-xs text-gray-500">
                      Kod dostępu jest wymagany do zalogowania się do aplikacji, możesz go znaleźć na winietce przy twoim siedzeniu</span>
                    <v-text-field
                      v-model.trim="code.value.value"
                      type="number"
                      density="comfortable"
                      pattern="\d*"
                      variant="outlined"

                      flat
                      hide-spin-buttons
                      block
                      :disabled="!!routeCode"
                      :error="code.meta.dirty && !code.meta.valid"
                      :error-messages="code.errors.value"
                      placeholder="Podaj kod dostępu"
                      label="Kod dostępu"
                    />
                    <div class="flex">
                      <v-btn
                        variant="outlined"
                        :text="$t('action.back')"
                        @click="formStep = steps[0]"
                      />
                      <v-spacer />
                      <v-btn
                        :text="$t('action.enter')"
                        variant="outlined"
                        color="primary"
                        type="submit"
                        class="px-8"

                        flat
                        block
                        :disabled="!meta.dirty || !meta.valid"
                      />
                    </div>
                  </div>
                </v-stepper-window-item>
              </v-stepper-window>
            </template>
          </v-stepper>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#welcome-page-background {
  content: '';
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //background-color: red !important;
  background: url('~/public/assets/couple-bg.jpg') no-repeat center ;
  filter:blur(40px);
  transform:scale(1.2);
}
</style>
