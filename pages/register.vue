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

  //if (passwd1.value.length < 8) {
  //  e = 'Insert a password of at least 8 character'
  //  ok = false
  //} else

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
  <div class="flex min-h-screen items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Register</h2>
        <form @click.prevent="">
          <div class="form-control">
            <label for="input-mail" class="label">
              <span class="label-text"> Username </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-username"
                v-model="username"
                type="text"
                class="X-required grow invalid:text-error"
                :placeholder="usernamePlaceholders[placeholderIndex]"
              />
            </div>
          </div>

          <div class="form-control mt-5">
            <label for="input-password1" class="label">
              <span class="label-text"> Password </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-password1"
                v-model="passwd1"
                type="password"
                class="X-required grow invalid:text-error"
                placeholder="Choose a password"
              />
            </div>
            <label for="input-password2" class="label">
              <span class="label-text"> Confirm Password </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-password2"
                v-model="passwd2"
                type="password"
                class="X-required grow invalid:text-error"
                placeholder="Confirm password"
              />
            </div>

            <div class="form-control mt-5">
              <label for="input-name" class="label">
                <span class="label-text"> Full Name </span>
              </label>
              <div
                class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
              >
                <input
                  id="input-name"
                  v-model="name"
                  type="text"
                  class="grow invalid:text-error"
                  placeholder="Alex"
                />
              </div>
            </div>
          </div>

          <div class="form-control mt-6">
            <button class="btn btn-secondary" @click="register">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
