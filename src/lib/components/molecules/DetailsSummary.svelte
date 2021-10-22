<script>
  export let title
  export let isOpen = false
  export let disabled
  export let active
  export let styleOverlay = false

  //@TODO: add way for details to close when child is clicked.
  //@TODO: make close when clicked outside optional
  const handleClickOutside = (node) => {
    //@TODO: test this with dynamic disabled.
    //Might have to remove the event listener.
    if( node.attributes['aria-disabled']?.value ) {
      node.addEventListener('keydown', (e)=> {
        if(e.key === 'Enter') {
          e.preventDefault()
        }
      })
    }
    
    const handleDetailsOutsideClick = (event) => {
      let targetElement = event.target; // clicked element

      do {
          if (targetElement == node) {
            // This is a click inside. Do nothing, just return.
            return;
          }
          // Go up the DOM
          targetElement = targetElement.parentNode
      } while (targetElement)

      isOpen = false
      document.removeEventListener('click', handleDetailsOutsideClick, true)
    }

    node.addEventListener('focusin', () => {
      document.addEventListener('click', handleDetailsOutsideClick, true)
    })
    
    return {
      destroy() {
        document.removeEventListener('click', handleDetailsOutsideClick, true);
      }
    }
  }
</script>

<details 
  bind:open={isOpen} 
  class={styleOverlay ? 'overlay' : undefined} 
  use:handleClickOutside
  aria-disabled={disabled}
>
  <summary class={active ? 'active' : undefined}><span>{@html title}</span></summary>
  <div class="contents">
    <slot />
  </div>
</details>

<style>
  summary {
    padding: 0.5rem;
    font-weight: bold;
    font-family: monospace, monospace;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: start;
    gap: 0.5rem;
    min-height: 44px;
    line-height: 1;
  }

  summary span {
    cursor: default;
    user-select: none;
  }

  summary::before {
    content: '\2023';
    display: block;
    font-size: 1.2rem;
  }

  summary.active {
    background-color: var(--action-color);
    color: var(--background-color);
  }

  [open] > summary::before {
    transform: rotate(90deg);
  }

  .contents {
    border-top: 0;
    background-color: var(--background-color);
  }

  .overlay {
    position: relative;
  }
</style>