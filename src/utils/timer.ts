export class Timer {
  handler: any
  timeout?: number
  id: number | undefined
  constructor(handler: any, timeout?: number) {
    this.handler = handler
    this.timeout = timeout
  }

  Start = () => {
    const interval = () => {
      this.handler()
      this.id = window.setTimeout(interval, this.timeout)
    }

    this.id = window.setTimeout(interval, this.timeout)
  }

  Stop = () => {
    window.clearTimeout(this.id)
  }

  Reset = () => {
    this.Stop()
    this.Start()
  }
}
