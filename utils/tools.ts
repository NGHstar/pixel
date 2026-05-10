import { filters } from 'fabric'
import { Crop, Expand, Eye, Maximize2, Palette, Sliders, Text } from 'lucide-react'

export const EditorTopSideBarTools = [
  {
    id: 'resize',
    label: 'Resize',
    icon: Expand,
    isActive: true,
  },
  {
    id: 'crop',
    label: 'Crop',
    icon: Crop,
  },
  {
    id: 'adjust',
    label: 'Adjust',
    icon: Sliders,
  },
  {
    id: 'text',
    label: 'Text',
    icon: Text,
  },
  {
    id: 'background',
    label: 'AI Background',
    icon: Palette,
    proOnly: true,
  },
  {
    id: 'ai_extender',
    label: 'AI Image Extender',
    icon: Maximize2,
    proOnly: true,
  },
  {
    id: 'ai_edit',
    label: 'AI Editing',
    icon: Eye,
    proOnly: true,
  },
]

export const EditorSideBarTools = [
  {
    title: 'Resize',
    icon: Expand,
    description: 'Change project dimensions',
  },
  {
    title: 'Crop',
    icon: Crop,
    description: 'Crop and trim your image',
  },
  {
    title: 'Adjust',
    icon: Sliders,
    description: 'Brightness, contrast and more (manual saving required)',
  },
  {
    title: 'Background',
    icon: Palette,
    description: 'Remove or change background',
  },
  {
    title: 'AI Extender',
    icon: Maximize2,
    description: 'Extend image boundaries with AI',
  },
  {
    title: 'Add Text',
    icon: Text,
    description: 'Customize in various fonts',
  },
  {
    title: 'AI Editing',
    icon: Eye,
    description: 'Enhance image quality with AI',
  },
]

export const AdjustToolOptions = [
  {
    key: 'brightness',
    label: 'Brightness',
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
    label: 'Contrast',
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
    label: 'Saturation',
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
    label: 'Vibrance',
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
    label: 'Blur',
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
    label: 'Hue',
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
