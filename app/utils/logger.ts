import { consola } from 'consola'
import type { ConsolaInstance } from 'consola'

const logger: ConsolaInstance = import.meta.client
  ? new Proxy({} as ConsolaInstance, {
      get() {
        return () => {}
      },
    })
  : consola

export default logger
