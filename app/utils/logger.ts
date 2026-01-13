import { consola } from 'consola'
import type { ConsolaInstance } from 'consola'

const logger: ConsolaInstance = import.meta.server
  ? consola
  : new Proxy({} as ConsolaInstance, {
      get() {
        return () => {}
      },
    })

export default logger
