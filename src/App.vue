<script setup lang="ts">
import useForm from './useForm'
import { helpers, required } from '@vuelidate/validators'

const initialState = {
  name: '',
  password: ''
}

const rules = {
  name: { required: helpers.withMessage('이름은 필숫값입니다', required) },
  password: { required: helpers.withMessage('패스워드는 필숫값입니다', required) }
}

const onValid = <T,>(payload: T) => {
  alert(JSON.stringify(payload))
}

const onInvalid = (errors: string[]) => {
  alert(JSON.stringify(errors))
}

const { model, submit, reset } = useForm<typeof initialState>({
  onValid,
  onInvalid,
  rules,
  initialState
})
</script>

<template>
  <form @submit.prevent="submit">
    <input type="text" name="name" v-model="model.name" />
    <input type="text" name="password" v-model="model.password" />
    <input type="submit" />
    <input type="reset" @click="reset" />
  </form>
</template>
