'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useCanvas } from '@/context/canvas'
import { AdjustToolOptions } from '@/utils/tools'
import { Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

const defaultValues = AdjustToolOptions.reduce((acc, option) => {
  acc[option.key] = option.defaultValue
  return acc
}, {})

function AdjustTool() {
  // ---
  const [filterValues, setFilterValues] = useState(defaultValues)
  const [isApplying, setIsApplying] = useState(false)

  const { canvasEditor } = useCanvas()

  const getActiveImage = () => {
    if (!canvasEditor) return null
    const activeObject = canvasEditor.getActiveObject()
    if (activeObject && activeObject.type === 'image') return activeObject

    const objects = canvasEditor.getObjects()
    return objects.find(obj => obj.type === 'image') || null
  }

  const applyFilters = async values => {
    const imageObject = getActiveImage()

    if (!imageObject || isApplying) return

    setIsApplying(true)
    try {
      const filtersToApply = []
      AdjustToolOptions.forEach(option => {
        const value = values[option.key]
        if (value !== option.defaultValue) {
          const transformedValue = option.transform(value)
          filtersToApply.push(
            new option.filterClass({
              [option.valueKey]: transformedValue,
            })
          )
        }
        imageObject.filters = filtersToApply
        new Promise(resolve => {
          imageObject.applyFilters()
          canvasEditor.requestRenderAll()
          setTimeout(resolve, 50)
        })
      })
    } catch (error) {
      console.log('err', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleValueChange = (filterKey, value) => {
    const newValues = {
      ...filterValues,
      [filterKey]: Array.isArray(value) ? value[0] : value,
    }
    setFilterValues(newValues)
    applyFilters(newValues)
  }

  const resetFilters = () => {
    setFilterValues(defaultValues)
    applyFilters(defaultValues)
  }

  const extractFilterValues = imageObject => {
    if (!imageObject?.filters?.length) return defaultValues
    const extractedValues = { ...defaultValues }
    imageObject.filters.forEach(filter => {
      const option = AdjustToolOptions.find(o => o.filterClass.name === filter.constructor.name)

      if (option) {
        const filterValue = filter[option.valueKey]
        if (option?.key === 'hue') {
          extractedValues[option.key] = Math.round(filterValue * (180 / Math.PI))
        } else extractedValues[option.key] = Math.round(filterValue * 100)
      }
    })

    return extractedValues
  }

  useEffect(() => {
    // todo: it should save changes and we can load changes when we refresh the page
    // right now when we refresh the page the values get reset
    const imageObject = getActiveImage()
    if (imageObject?.filters) {
      const existingValues = extractFilterValues(imageObject)
      setFilterValues(existingValues)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Image Adjustment</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-foreground/70 hover:text-foreground pt-2 px-8"
        >
          <RotateCcw className="h-4 w-4 mr-0.5 -translate-y-0.75" />
          Reset
        </Button>
      </div>
      {/* Filters */}
      {AdjustToolOptions.map(option => {
        return (
          <div key={option.key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">{option.label}</label>
              <span className="text-xs text-foreground/70">
                {filterValues[option.key]}
                {option.suffix || ''}
              </span>
            </div>
            <Slider
              value={[filterValues[option.key]]}
              onValueChange={value => handleValueChange(option.key, value)}
              max={option.max}
              min={option.min}
              step={option.step}
              className="w-full"
            />
          </div>
        )
      })}
      {/* Info */}
      <div className="mt-8 px-3 pt-3 pb-2.5 bg-foreground/10 rounded-lg">
        <p className="text-xs text-foreground/80">
          Adjust are applied in real-time. Use the reset button to restore original values.
        </p>
      </div>

      {isApplying && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="ml-2 text-xs text-foreground/70 translate-y-px">Applying filters</span>
        </div>
      )}
    </div>
  )
}

export default AdjustTool
