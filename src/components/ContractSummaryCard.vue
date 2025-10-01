<template>
  <Panel class="summary-card">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="property-info flex-1">
        <h3 class="text-xl font-bold mb-4">
          Property Details
        </h3>
        <div class="info-grid">
          <div class="info-item">
            <i class="pi pi-home" />
            <span>{{ formData.property.streetAddress }}</span>
          </div>
          <div class="info-item">
            <i class="pi pi-dollar" />
            <span>{{ formatCurrency(formData.property.price) }}</span>
          </div>
          <div class="info-item">
            <i class="pi pi-calendar" />
            <span>Close Date: {{ formatDate(formData.closing.closeDate) }}</span>
          </div>
        </div>
      </div>

      <div class="parties-info flex-1">
        <h3 class="text-xl font-bold mb-4">
          Parties
        </h3>
        <div class="parties-grid">
          <div class="party-group">
            <h4 class="text-lg font-semibold">
              Buyers
            </h4>
            <div
              v-for="buyer in formData.buyers"
              :key="buyer.id"
              class="party-item"
            >
              <i class="pi pi-user" />
              <span>{{ buyer.name }}</span>
            </div>
          </div>
          <div class="party-group">
            <h4 class="text-lg font-semibold">
              Sellers
            </h4>
            <div
              v-for="seller in formData.sellers"
              :key="seller.id"
              class="party-item"
            >
              <i class="pi pi-user" />
              <span>{{ seller.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>

<style scoped>
.summary-card {
  background: linear-gradient(
    135deg,
    var(--surface-0) 0%,
    var(--surface-50) 100%
  );
  border-radius: 1rem;
}

.info-grid,
.parties-grid {
  display: grid;
  gap: 1rem;
}

.info-item,
.party-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--surface-card);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.party-group {
  margin-bottom: 1rem;
}

.info-item i,
.party-item i {
  color: var(--primary-color);
}
</style>
