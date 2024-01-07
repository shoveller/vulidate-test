import type { ValidationArgs } from '@vuelidate/core'
import { reactive } from 'vue'
import type { Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'

type UseFormParam<FormType> = {
  onValid: (payload: FormType) => void
  onInvalid: (errors: string[]) => void
  initialState: FormType
  rules: any
}

const useForm = <FormType extends ValidationArgs>({
  rules,
  onValid,
  onInvalid,
  initialState
}: UseFormParam<FormType>) => {
  // 리액티브 객체를 생성. useState 와 비슷한 것이다.
  const model = reactive({ ...initialState }) as Ref<FormType>
  // 벨리데이터 객체를 생성
  const v$ = useVuelidate<FormType>(rules, model)

  const submit = async (e: Event) => {
    // 이 메소드가 벨리데이션을 트리거한다
    const isValid = await v$.value.$validate()

    if (!isValid) {
      const errors = v$.value.$errors.map((item) => `${item.$message}`)
      onInvalid(errors)
      return
    }

    const data = new FormData(e.target as HTMLFormElement)
    const payload = Object.fromEntries(data.entries()) as FormType

    onValid(payload)
  }

  const reset = () => {
    v$.value.$reset()
    // vue 의 reactive 객체는 이 방법으로 초기화하기를 권한다고 한다.
    // https://github.com/vuejs/core/issues/1081#issuecomment-621385050
    Object.assign(model, { ...initialState })
  }

  return { v$, submit, reset, model }
}

export default useForm
