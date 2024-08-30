export interface SettingData {
  data: any
}

export interface Setting<T = any> {
  id: string
  name: string
  componentType: string
  data: ({ componentStateId: T } & SettingData)[]
  component: SettingComponent
  state?: T
  defaultState: T
}

interface SettingComponent {
  ui?: any
  styling: { order: number }
}
