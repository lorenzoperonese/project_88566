<script setup lang="ts">

const $props = defineProps<{
  event?: EventType
}>()

useHead({
  script: [
    {
      src: 'https://cdn.addevent.com/libs/atc/1.6.1/atc.min.js',
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.addevent.com/libs/atc/themes/fff-theme-3/theme.css'
    }
  ]
})
</script>
<template>
  <div v-if="$props.event" class="addeventatc" data-styling="none">
    <div class="date">
      <span class="mon">{{ shortMonths[new Date($props.event.start).getMonth()] }}</span>
      <span class="day">{{ new Date($props.event.start).getDate() }}</span>
      <div class="bdr1"></div>
      <div class="bdr2"></div>
    </div>
    <div class="desc">
      <p>
        <strong class="hed">{{ $props.event.title }}</strong>
        <span class="des">{{ $props.event.location ? `Location: ${$props.event.location} ` : `Location: unknown` }}
          <br />When: {{ formatTime($props.event.start, true) }} - {{ formatTime($props.event.end, true) }}</span>
      </p>
    </div>
    <span class="start">{{ new Date($props.event.start).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }) }}</span>
    <span class="end">{{ new Date($props.event.end).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }) }}</span>
    <span class="timezone">Europe/Paris <!-- TODO -->
</span>
    <span class="title">{{ $props.event.title }}</span>
    <span v-if="$props.event.note" class="description">{{ $props.event.note }}</span>
    <span v-if="$props.event.location" class="location">{{ $props.event.location }}</span>
  </div>
</template>