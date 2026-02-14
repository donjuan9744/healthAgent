import { useSyncExternalStore } from 'react'

type Listener = () => void

type Updater<T> = Partial<T> | ((state: T) => Partial<T>)

export function createStore<T extends object>(initialState: T) {
  let state = initialState
  const listeners = new Set<Listener>()

  const getState = (): T => state

  const setState = (update: Updater<T>): void => {
    const partial = typeof update === 'function' ? update(state) : update
    state = { ...state, ...partial }
    listeners.forEach((listener) => listener())
  }

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const useStore = <S>(selector: (state: T) => S): S => useSyncExternalStore(subscribe, () => selector(state))

  return {
    getState,
    setState,
    subscribe,
    useStore,
  }
}
