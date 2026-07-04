// Chequeo manual, sin framework. Ejecutar con:
//   node --experimental-strip-types src/shared/notifications/habitNotifications.selfcheck.ts
import assert from 'node:assert'
import dayjs from 'dayjs'
import { buildScheduleTimes, notificationIdFor } from './habitNotifications.ts'

// El esquema de IDs no debe chocar entre offsets del mismo hábito ni entre hábitos vecinos.
assert.strictEqual(notificationIdFor(3, 0), 300)
assert.strictEqual(notificationIdFor(3, 29), 329)
assert.notStrictEqual(notificationIdFor(3, 29), notificationIdFor(4, 0))

// Si el aviso de hoy (hora de inicio - 10 min) ya pasó, no debe programarse; el de mañana sí.
const now = dayjs('2026-07-04T09:00:00')
const pastToday = buildScheduleTimes({ habitId: 1, startTime: '09:05', days: 2, now })
assert.strictEqual(pastToday.length, 1)
assert.strictEqual(pastToday[0].id, notificationIdFor(1, 1))

// Si el aviso de hoy todavía no ha llegado, sí debe incluirse.
const futureToday = buildScheduleTimes({ habitId: 2, startTime: '20:00', days: 1, now })
assert.strictEqual(futureToday.length, 1)
assert.strictEqual(futureToday[0].id, notificationIdFor(2, 0))

console.log('habitNotifications.selfcheck: OK')
