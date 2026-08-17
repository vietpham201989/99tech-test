/* eslint-disable no-undef */
//https://github.com/grafana/k6/releases 
import http from "k6/http"
import { check, sleep } from "k6"
import encoding from "k6/encoding"
const accData = JSON.parse(open("../data/account.json"))
export let options = {
  vus: 5,
  duration: "10s",
}

export default function () {
  const env = __ENV.ENV
  let user = accData["uat"].username
  let password = accData["uat"].password
  if (env == "stg") {
    user = accData["stg"].username
    password = accData["stg"].username
  }
  const api_url = __ENV.API_URL
  const pass = encoding.b64encode(password) // encode Base64
  const res = http.post(
    `${api_url}/login`,
    JSON.stringify({ username: user, password: pass }),
    {
      headers: { "Content-Type": "application/json" },
    }
  )

  check(res, {
    "status 200": (r) => r.status === 200,
    "token exists": (r) => !!JSON.parse(r.body).token,
  })
  sleep(1)
}
