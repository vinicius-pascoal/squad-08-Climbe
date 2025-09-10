<template>
  <div class="activity-list">
    <h2>Atividades para {{ formatDate(selectedDate) }}</h2>
    <ul>
      <ActivityItem
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        @update-activity="onUpdateActivity"
      />
    </ul>
  </div>
</template>

<script setup>

import ActivityItem from './ActivityItem.vue';

const props = defineProps({
  activities: {
    type: Array,
    required: true
  },
  selectedDate: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-activity']);

const formatDate = (date) => {
  return date.toLocaleDateString();
};

const onUpdateActivity = (updatedActivity) => {
  emit('update-activity', updatedActivity);
};
</script>

<style scoped>
.activity-list{
  max-height: 170px;
  overflow-y: auto;
  }
</style>