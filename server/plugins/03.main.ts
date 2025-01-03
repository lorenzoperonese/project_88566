// @ts-ignore
import { updateTasks, updateProjectTasks, updatePomodoros } from '#imports'
import { updateNotesTasks } from '../utils/background'

export default defineNitroPlugin(async () => {
  //while (true) {
  //  await new Promise((resolve) => setTimeout(resolve, 1000))
  //  console.log('Hello from main.ts')
  //}

  mainCycle()
})

async function mainCycle() {
  await new Promise((resolve) => setTimeout(resolve, 4000))
  while (true) {
    await Promise.all([
      updateTasks(),
      updateProjectTasks(),
      updatePomodoros(),
      updateNotesTasks()
    ])

    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
}
