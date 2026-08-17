/* eslint-disable no-undef */
//https://github.com/grafana/k6/releases 
import http from "k6/http"
import { check, sleep } from "k6"
import encoding from "k6/encoding"
const accData = JSON.parse(open("../../data/account.json"))
const configData = JSON.parse(open("../../data/api/config.json"))
const env = __ENV.ENV || 'stg';

export const options = {
  scenarios: {
    user_login_load: {
      executor: 'ramping-arrival-rate',
      startRate: 1, // starting arrival rate (iterations per timeUnit)
      timeUnit: '1s', // time unit for the rate
      preAllocatedVUs: 5, // pre-allocate VUs
      maxVUs: 50, // maximum virtual users
      stages: [
        { duration: '5s', target: 50 }, // ramp up to 50 iterations/s
        { duration: '20s', target: 50 }, // stay at 50 iterations/s
        { duration: '10s', target: 10 }, // ramp down to 10 iterations/s
        { duration: '5s', target: 0 }, // ramp down to 0 iterations/s
      ],
    },
  },
}


const BASE_API_URL = configData[env].API_URL

export default function () {
  let user = accData[env].username
  let password = accData[env].password
  const pass = encoding.b64encode(password) // encode Base64
  const res = http.post(
    `${BASE_API_URL}/login`,
    JSON.stringify({ username: user, password: pass }),
    {
      headers: { "Content-Type": "application/json" },
    }
  )

  check(res, {
    "status 200": (r) => r.status === 200,
    "token exists": (r) => !!res.body.startsWith("\"Auth_token:"),
    "response time < 500ms": (r) => r.timings.duration < 500,
  })
  sleep(1)
}
