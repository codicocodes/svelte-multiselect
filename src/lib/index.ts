export { default as CircleSpinner } from './CircleSpinner.svelte'
export { default as CmdPalette } from './CmdPalette.svelte'
export { default as MultiSelect, default } from './MultiSelect.svelte'
export { default as Wiggle } from './Wiggle.svelte'

export type Option = string | number | ObjectOption

export type ObjectOption = {
  label: string | number // user-displayed text
  value?: unknown // associated value, can be anything incl. objects (defaults to label if undefined)
  title?: string // on-hover tooltip
  disabled?: boolean // make this option unselectable
  preselected?: boolean // make this option selected on page load (before any user interaction)
  disabledTitle?: string // override the default disabledTitle = 'This option is disabled'
  selectedTitle?: string // tooltip to display when this option is selected and hovered
  [key: string]: unknown // allow any other keys users might want
}

export type DispatchEvents<T = Option> = {
  add: { option: T }
  create: { option: T }
  remove: { option: T }
  removeAll: { options: T[] }
  change: {
    option?: T
    options?: T[]
    type: 'add' | 'remove' | 'removeAll'
  }
  open: { event: Event }
  close: { event: Event }
}

export type MultiSelectEvents = {
  [key in keyof DispatchEvents]: CustomEvent<DispatchEvents[key]>
} & {
  blur: FocusEvent
  click: MouseEvent
  focus: FocusEvent
  keydown: KeyboardEvent
  keyup: KeyboardEvent
  mouseenter: MouseEvent
  mouseleave: MouseEvent
  touchcancel: TouchEvent
  touchend: TouchEvent
  touchmove: TouchEvent
  touchstart: TouchEvent
}

// Firefox lacks support for scrollIntoViewIfNeeded (https://caniuse.com/scrollintoviewifneeded).
// See https://github.com/janosh/svelte-multiselect/issues/87
// Polyfill copied from
// https://github.com/nuxodin/lazyfill/blob/a8e63/polyfills/Element/prototype/scrollIntoViewIfNeeded.js
// exported for testing
export function scroll_into_view_if_needed_polyfill(
  centerIfNeeded: boolean = true
) {
  const elem = this as Element
  const observer = new IntersectionObserver(function ([entry]) {
    const ratio = entry.intersectionRatio
    if (ratio < 1) {
      const place = ratio <= 0 && centerIfNeeded ? `center` : `nearest`
      elem.scrollIntoView({
        block: place,
        inline: place,
      })
    }
    this.disconnect()
  })
  observer.observe(elem)

  return observer // return for testing
}

if (
  typeof Element !== `undefined` &&
  !Element.prototype?.scrollIntoViewIfNeeded &&
  typeof IntersectionObserver !== `undefined`
) {
  Element.prototype.scrollIntoViewIfNeeded = scroll_into_view_if_needed_polyfill
}
