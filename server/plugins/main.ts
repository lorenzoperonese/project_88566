// @ts-ignore
import { updateTasks, updateProjectTasks } from '#imports'

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
    updateTasks()
    updateProjectTasks()

    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
}
