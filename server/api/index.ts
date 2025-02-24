import fs from 'node:fs'
import process from 'node:process'

export default defineEventHandler((event) => {
  console.log('Hello world', process.cwd())
  return {
    hello: 'world',
  }
})
