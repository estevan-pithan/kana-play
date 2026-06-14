import enUS from './en-US.json'
import ptBR from './pt-BR.json'

export const RESOURCES = {
  enUS: { translation: enUS, iconName: 'FlagUSA', label: 'EN' },
  ptBR: { translation: ptBR, iconName: 'FlagBrazil', label: 'PT' },
} as const

export type LanguageKey = keyof typeof RESOURCES
