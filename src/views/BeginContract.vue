<template>
  <div
    class="py-4 sm:py-8 px-0 sm:px-6 lg:px-8 flex items-center justify-center"
  >
    <div class="w-full sm:max-w-7xl mx-auto flex items-center">
      <Card class="w-full mx-0 sm:mx-4">
        <template #content>
          <div
            class="flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-8"
          >
            <p class="text-2xl sm:text-4xl mb-6 sm:mb-8 text-center">
              First we'll gather some data on the property you are wanting to
              purchase...
            </p>
            <Button
              label="Let's Go!"
              class="p-button-primary w-full sm:w-auto"
              @click="$emit('next-step')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  :deep(.p-card) {
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }

  :deep(.p-card .p-card-content) {
    padding: 0.75rem;
  }
}
</style>
