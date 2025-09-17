<template>
  <div class="activity-list">
    <ul v-if="activities.length > 0">
      <ActivityItem
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        @update-activity="onUpdateActivity"
      />
    </ul>
    <div v-else class="no-activities-message">
      <span>Sem tarefas para o dia selecionado.</span>
    </div>
  </div>
</template>

<script setup>
import ActivityItem from './ActivityItem.vue';

defineProps({
  activities: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update-activity']);

const onUpdateActivity = (updatedActivity) => {
  emit('update-activity', updatedActivity);
};
</script>

<style scoped>
.activity-list {
  max-height: 170px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.no-activities-message {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  color: #888;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>