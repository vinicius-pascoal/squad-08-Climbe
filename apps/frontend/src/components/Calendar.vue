<template>
  <div class="calendar">
    <div class="weekdays">
      <span>D</span>
      <span>S</span>
      <span>T</span>
      <span>Q</span>
      <span>Q</span>
      <span>S</span>
      <span>S</span>
    </div>

    <div class="days">
      <div
        v-for="day in daysInMonth"
        :key="day.date.toISOString()"
        class="day"
        :class="{
          'selected': isSelected(day.date),
          'other-month': !day.isCurrentMonth
        }"
        @click="selectDate(day.date)"
      >
        <span class="day-number">{{ day.dayOfMonth }}</span>
        <div 
          v-if="hasActivity(day.date) && day.isCurrentMonth" 
          class="activity-indicator"
          :class="{ 'past': isPast(day.date) }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  activities: {
    type: Array,
    required: true
  },
  viewDate: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['date-selected']);

const selectedDate = ref(new Date());

const today = new Date();
today.setHours(0, 0, 0, 0);

const isPast = (date) => {
  return date < today;
};

const currentYear = computed(() => props.viewDate.getFullYear());
const currentMonth = computed(() => props.viewDate.getMonth());

const daysInMonth = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push({
      date: date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.value
    });
  }
  return days;
});

const hasActivity = (date) => {
  return props.activities.some(activity => {
    const activityDate = new Date(activity.date);
    return activityDate.toDateString() === date.toDateString();
  });
};

const isSelected = (date) => {
  return selectedDate.value.toDateString() === date.toDateString();
};

const selectDate = (date) => {
  selectedDate.value = date;
  emit('date-selected', date);
};

</script>

<style scoped>
.calendar {
  font-family: 'Roboto', sans-serif;
  width: 100%;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.75rem;
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;  
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  cursor: pointer;
  position: relative;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.day:not(.selected):hover {
  background-color: #f0f0f0;
}

.day.other-month .day-number {
  color: #ccc;
}

.day-number {
  font-size: 0.9rem;
  line-height: 1;
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}

.day.selected {
  background-color: transparent;
  color: white;
  box-shadow: none;
}

.day::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34px;
  height: 34px;
  background-color: #0E9989;
  border-radius: 8px;
  box-shadow: 4px 5px 9px rgba(0, 0, 0, 0.25);
  z-index: 0;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.day.selected::before {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.day.selected .day-number {
  color: white;
}

.activity-indicator {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #26A69A;
  box-shadow: 0 1.2px 2px rgba(0, 0, 0, 0.5);
  transform: scale(1.2);
}

.activity-indicator.past {
  background-color: #BDBDBD;
  box-shadow: 0 1.2px 2px rgba(0, 0, 0, 0.5);
}

.day.selected .activity-indicator {
  display: none;
}
</style>