<script>
  export let title
  export let isOpen = false
  export let styleOverlay = false
</script>

<details bind:open={isOpen} class={styleOverlay ? 'overlay' : undefined}>
  <summary><span>{@html title}</span></summary>
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

  [open] summary::before {
    transform: rotate(90deg);
  }

  .overlay {
    position: relative;
  }

  .overlay .contents {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }
</style>