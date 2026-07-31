import { filters } from 'fabric'
import { Crop, Expand, Eye, LucideProps, Maximize2, Palette, Sliders, Text } from 'lucide-react'
import { ToolKeys } from './types'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

export const EditorTopSideBarExportFormats = [
  {
    format: 'PNG',
    quality: 1.0,
    label: 'PNG',
    extension: 'png',
  },
  {
    format: 'JPEG',
    quality: 0.9,
    labelKey: 'JPEG',
    extension: 'jpg',
  },
  {
    format: 'JPEG',
    quality: 0.8,
    labelKey: 'JPEG',
    extension: 'jpg',
  },
  {
    format: 'WEBP',
    quality: 0.9,
    labelKey: 'WEBP',
    extension: 'webp',
  },
]

export const EditorTopSideBarTools: {
  id: ToolKeys
  labelKey: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  isActive?: boolean
  proOnly?: boolean
}[] = [
  {
    id: 'resize',
    labelKey: 'tools.resize',
    icon: Expand,
    isActive: true,
  },
  {
    id: 'crop',
    labelKey: 'tools.crop',
    icon: Crop,
  },
  {
    id: 'adjust',
    labelKey: 'tools.adjust',
    icon: Sliders,
  },
  {
    id: 'text',
    labelKey: 'tools.text',
    icon: Text,
  },
  {
    id: 'background',
    labelKey: 'tools.background',
    icon: Palette,
    proOnly: true,
  },
  {
    id: 'ai_extender',
    labelKey: 'tools.ai_extender',
    icon: Maximize2,
    proOnly: true,
  },
  {
    id: 'ai_edit',
    labelKey: 'tools.ai_edit',
    icon: Eye,
    proOnly: true,
  },
]

export const EditorSideBarTools = {
  resize: {
    titleKey: 'toolTitles.resize',
    icon: Expand,
    descriptionKey: 'toolDescriptions.resize',
  },
  crop: {
    titleKey: 'toolTitles.crop',
    icon: Crop,
    descriptionKey: 'toolDescriptions.crop',
  },
  adjust: {
    titleKey: 'toolTitles.adjust',
    icon: Sliders,
    descriptionKey: 'toolDescriptions.adjust',
  },
  background: {
    titleKey: 'toolTitles.background',
    icon: Palette,
    descriptionKey: 'toolDescriptions.background',
  },
  ai_extender: {
    titleKey: 'toolTitles.ai_extender',
    icon: Maximize2,
    descriptionKey: 'toolDescriptions.ai_extender',
  },
  text: {
    titleKey: 'toolTitles.text',
    icon: Text,
    descriptionKey: 'toolDescriptions.text',
  },
  ai_edit: {
    titleKey: 'toolTitles.ai_edit',
    icon: Eye,
    descriptionKey: 'toolDescriptions.ai_edit',
  },
}

export const ResizeToolOptions = [
  { name: 'Instagram Story', nameKey: 'options.instagramStory', ratio: [9, 16], label: '9:16' },
  { name: 'Instagram Post', nameKey: 'options.instagramPost', ratio: [1, 1], label: '1:1' },
  {
    name: 'Youtube Thumbnail',
    nameKey: 'options.youtubeThumbnail',
    ratio: [16, 9],
    label: '16:9',
  },
  { name: 'Portrait', nameKey: 'options.portrait', ratio: [2, 3], label: '2:3' },
  {
    name: 'Facebook Cover',
    nameKey: 'options.facebookCover',
    ratio: [851, 315],
    label: '2.7:1',
  },
  { name: 'Twitter Header', nameKey: 'options.twitterHeader', ratio: [3, 1], label: '3:1' },
]

export const AdjustToolOptions = [
  {
    key: 'brightness',
    labelKey: 'filters.brightness',
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Brightness,
    valueKey: 'brightness',
    transform: (value: number) => value / 100,
  },
  {
    key: 'contrast',
    labelKey: 'filters.contrast',
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Contrast,
    valueKey: 'contrast',
    transform: (value: number) => value / 100,
  },
  {
    key: 'saturation',
    labelKey: 'filters.saturation',
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Saturation,
    valueKey: 'saturation',
    transform: (value: number) => value / 100,
  },
  {
    key: 'vibrance',
    labelKey: 'filters.vibrance',
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Vibrance,
    valueKey: 'vibrance',
    transform: (value: number) => value / 100,
  },
  {
    key: 'blur',
    labelKey: 'filters.blur',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Blur,
    valueKey: 'blur',
    transform: (value: number) => value / 100,
  },
  {
    key: 'hue',
    labelKey: 'filters.hue',
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    filterClass: filters.HueRotation,
    valueKey: 'rotation',
    transform: (value: number) => value * (Math.PI / 180),
    suffix: '°',
  },
]
