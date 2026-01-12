const logger: typeof import('consola').Consola = import.meta.server
  ? require('consola').consola
  : new Proxy(
      {},
      {
        get() {
          return () => {}
        },
      },
    )

export default logger
