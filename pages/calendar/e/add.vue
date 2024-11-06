<script setup lang="ts">
const route = useRoute()

const _event: EventType = {
  id: '0',
  title: route.query.title as string,
  start: new Date(
    route.query.start_date + ' ' + route.query.start_time
  ).getTime(),
  end: new Date(route.query.end_date + ' ' + route.query.end_time).getTime(),
  location: route.query.location as string,
  note: route.query.note as string,
  category: route.query.category as string,
  repetition: null,
  notify: [],
  guests: { accepted: [], waiting: [] }
}
</script>

<template>
  <CalendarEventAdder
    :event="_event"
    :is-event-new="true"
    @close="useRouter().push({ name: 'calendar' })"
  />
</template>
