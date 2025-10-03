/**
 * Composable for form auto-save functionality
 * 
 * This composable provides reactive auto-save capabilities for form sections,
 * integrating with the Vuex store and Supabase API.
 */

import { ref, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { autoSaveSection, cancelAutoSave, updateContractProgress } from '@/utils/autoSaveUtils'

export function useFormAutoSave(sectionId: string) {
  const store = useStore()
  const isSaving = ref(false)
  const lastSaveTime = ref<Date | null>(null)
  const saveError = ref<string | null>(null)
  
  /**
   * Set up auto-save watcher for a specific section
   * @param inputValues - Reactive object containing form values
   */
  function setupAutoSave(inputValues: any) {
    const contractId = store.state.contractId
    
    if (!contractId) {
      console.warn('No contract ID available for auto-save')
      return
    }
    
    // Watch for changes in input values and auto-save
    const unwatch = watch(
      () => ({ ...inputValues }),
      async (newValues, oldValues) => {
        // Skip if this is the initial load
        if (!oldValues) return
        
        // Skip if values haven't actually changed
        if (JSON.stringify(newValues) === JSON.stringify(oldValues)) return
        
        try {
          isSaving.value = true
          saveError.value = null
          
          // Update the store first
          store.commit('updateSectionFormData', {
            sectionId,
            data: { ...newValues }
          })
          
          // Auto-save to database
          await autoSaveSection(
            contractId,
            sectionId,
            newValues,
            store.state.markedQuestions
          )
          
          lastSaveTime.value = new Date()
          
        } catch (error) {
          console.error('Auto-save failed:', error)
          saveError.value = error instanceof Error ? error.message : 'Auto-save failed'
        } finally {
          isSaving.value = false
        }
      },
      { 
        deep: true,
        // Debounce to avoid excessive saves
        flush: 'post'
      }
    )
    
    // Clean up watcher when component unmounts
    onUnmounted(() => {
      unwatch()
      cancelAutoSave(contractId, sectionId)
    })
  }
  
  /**
   * Manually trigger a save for the current section
   * @param inputValues - Current form values
   */
  async function forceSave(inputValues: any): Promise<void> {
    const contractId = store.state.contractId
    
    if (!contractId) {
      throw new Error('No contract ID available for saving')
    }
    
    try {
      isSaving.value = true
      saveError.value = null
      
      // Update the store
      store.commit('updateSectionFormData', {
        sectionId,
        data: { ...inputValues }
      })
      
      // Save to database
      await autoSaveSection(
        contractId,
        sectionId,
        inputValues,
        store.state.markedQuestions
      )
      
      lastSaveTime.value = new Date()
      
    } catch (error) {
      console.error('Manual save failed:', error)
      saveError.value = error instanceof Error ? error.message : 'Save failed'
      throw error
    } finally {
      isSaving.value = false
    }
  }
  
  /**
   * Update progress for this section
   * @param isComplete - Whether the section is complete
   */
  async function updateSectionProgress(isComplete: boolean): Promise<void> {
    const contractId = store.state.contractId
    
    if (!contractId) return
    
    try {
      await updateContractProgress(contractId, {
        lastUpdatedSection: sectionId,
        // Add more progress tracking as needed
      })
    } catch (error) {
      console.error('Failed to update section progress:', error)
    }
  }
  
  /**
   * Get formatted last save time for display
   */
  function getLastSaveDisplay(): string {
    if (!lastSaveTime.value) return ''
    
    const now = new Date()
    const diff = now.getTime() - lastSaveTime.value.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Saved just now'
    if (minutes < 60) return `Saved ${minutes} minute${minutes === 1 ? '' : 's'} ago`
    
    return `Saved at ${lastSaveTime.value.toLocaleTimeString()}`
  }
  
  return {
    isSaving,
    lastSaveTime,
    saveError,
    setupAutoSave,
    forceSave,
    updateSectionProgress,
    getLastSaveDisplay
  }
}