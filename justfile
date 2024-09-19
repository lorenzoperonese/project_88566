build:
  rm -rf .output/
  npm install
  npm run build
  sed -i 's/process.env.NITRO_PORT/8000/g' .output/server/chunks/runtime.mjs
