<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})
const { $toast } = useNuxtApp()

const passwd1 = ref('')
const passwd2 = ref('')
const username = ref('')
const name = ref('')

const placeholderIndex = ref(0)
const usernamePlaceholders = [
  'cristiano',
  'therock',
  'elonmusk',
  'kingjames',
  'champagnepapi',
  'nasa',
  'billgates',
  'edsgerdijkstra',
  'omar',
  'alanturing'
]

let placeholderRotationInterval: NodeJS.Timeout

onMounted(() => {
  placeholderRotationInterval = setInterval(() => {
    placeholderIndex.value =
      (placeholderIndex.value + 1) % usernamePlaceholders.length
  }, 500)
})

onBeforeUnmount(() => {
  clearInterval(placeholderRotationInterval)
})

async function register() {
  if (!validate()) {
    return
  }

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username.value,
        password: passwd1.value,
        name: name.value
      })
    })

    navigateTo('/login')
  } catch (e) {
    console.error(e)
    $toast.error('Registration failed')
  }
}

function validate() {
  const el = document.getElementsByClassName('X-required')
  for (let i = 0; i < el.length; i++) {
    el[i].setAttribute('required', '')
  }

  let ok = true

  if (passwd1.value != passwd2.value) {
    $toast.error('Passwords do not match')
    ok = false
  } else if (username.value.length < 3) {
    $toast.error('Username must be at least 3 characters long')
    ok = false
  }

  return ok
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4"
  >
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-base-content">
            Create Your Account
          </h2>
          <p class="mt-2 text-sm text-base-content/70">
            Join our community today
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="register">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Username</span>
            </label>
            <div class="relative">
              <input
                v-model="username"
                type="text"
                class="X-required input input-bordered w-full bg-base-100 pl-4 pr-4 transition-colors focus:border-primary"
                :placeholder="usernamePlaceholders[placeholderIndex]"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Password</span>
            </label>
            <input
              v-model="passwd1"
              type="password"
              class="X-required input input-bordered w-full bg-base-100 transition-colors focus:border-primary"
              placeholder="Choose a password"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Confirm Password</span>
            </label>
            <input
              v-model="passwd2"
              type="password"
              class="X-required input input-bordered w-full bg-base-100 transition-colors focus:border-primary"
              placeholder="Confirm your password"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Full Name</span>
              <span class="label-text-alt text-base-content/70"
                >(Optional)</span
              >
            </label>
            <input
              v-model="name"
              type="text"
              class="input input-bordered w-full bg-base-100 transition-colors focus:border-primary"
              placeholder="Alex Smith"
            />
          </div>

          <div class="form-control mt-6">
            <button
              class="btn btn-primary w-full text-lg font-semibold transition-all hover:brightness-105"
              @click="register"
            >
              Create Account
            </button>
          </div>

          <div class="text-center text-sm text-base-content/70">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-primary hover:underline"
            >
              Sign in
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
