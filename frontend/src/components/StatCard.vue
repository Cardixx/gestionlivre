<template>
  <div :class="['stat-card', { highlight }]">
    <div class="stat-header">
      <span class="stat-icon">{{ icon }}</span>
      <h3>{{ title }}</h3>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="$slots.details" class="stat-details">
      <slot name="details"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  highlight: Boolean
})
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.highlight {
  border-left: 4px solid #42b983;
  background: #f8faf9;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.stat-details {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}
</style>