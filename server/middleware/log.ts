export default defineEventHandler((event) => {
  let ip = getRequestIP(event) ?? "";
  //console.log(ip + getRequestURL(event))

  const method = event.node.req.method;
  const path = event.node.req.url;
  const d = new Date().toLocaleTimeString();
  console.log(`[${d}] ${method} ${path}`);
});
