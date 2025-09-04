<template>
  <li>
    <input
      type="checkbox"
      :checked="activity.completed"
      @change="toggleCompleted"
      :class="activity.completed ? 'checkbox-completed' : 'checkbox-pending'"
    />
    <div class="activity-details">
      <span class="activity-title">{{ activity.title }}</span>
      <span v-if="activity.time" class="activity-time">{{ activity.time }}</span>
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-activity']);

const toggleCompleted = () => {
  emit('update-activity', { ...props.activity, completed: !props.activity.completed });
};
</script>

<style scoped>
li {
  display: flex;
  align-items: center;
  gap: 10px; 
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.activity-details {
  display: flex;
  flex-direction: column;
}

.activity-title {
  font-weight: 500;
}

.activity-time {
  font-size: 0.85em;
  color: #666; 
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
  width: 1.15em;
  height: 1.15em;
  border: 1px solid #ccc;
  border-radius: 3px;
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em white;
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.checkbox-pending {
  background-color: #4CAF50;
  border-color: #3e8e41;
}

.checkbox-completed {
  background-color: #888;
  border-color: #aaa;
}
</style>
